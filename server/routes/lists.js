const express = require("express");
const { admin } = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const db = admin.firestore(); // Firestore Database

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log("Token received:", token); // Log the raw token
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify the token
    console.log("Decoded Token:", decodedToken); // Log the decoded token
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Add destinations to list
router.post("/lists/:id/destinations", verifyToken, async (req, res) => {
  const listId = req.params.id;
  const { destinationId } = req.body; // Destination ID to add

  if (!destinationId) {
    return res.status(400).json({ error: "Destination ID is required" });
  }

  try {
    const listRef = db.collection("lists").doc(listId);
    const listDoc = await listRef.get();

    if (!listDoc.exists) {
      return res.status(404).json({ error: "List not found" });
    }

    if (listDoc.data().userID !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Unauthorized to modify this list" });
    }

    await listRef.update({
      destinationIds: admin.firestore.FieldValue.arrayUnion(destinationId), // Append destination ID
      updatedAt: admin.firestore.Timestamp.now(),
    });

    res.status(200).json({ message: "Destination added successfully" });
  } catch (error) {
    console.error("Error adding destination:", error.message);
    res.status(500).json({ error: "Failed to add destination" });
  }
});

// Get full destination details for a specific list
router.get("/lists/:id/destinations", verifyToken, async (req, res) => {
  const listId = req.params.id;

  try {
    const listRef = db.collection("lists").doc(listId);
    const listDoc = await listRef.get();

    if (!listDoc.exists) {
      return res.status(404).json({ error: "List not found" });
    }

    if (listDoc.data().userID !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Unauthorized to access this list" });
    }

    const { destinationIds = [] } = listDoc.data();

    if (destinationIds.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch destinations by IDs
    const destinationDocs = await Promise.all(
      destinationIds.map((id) => db.collection("destinations").doc(id).get())
    );

    const destinations = destinationDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error.message);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

// Create a new list
router.post("/lists", verifyToken, async (req, res) => {
  const { name, description, isPublic, destinationIds } = req.body;

  if (!name) {
    return res.status(400).json({ error: "List name is required" });
  }

  try {
    // Check if the user already has a list with the same name
    const existingListSnapshot = await db
      .collection("lists")
      .where("userID", "==", req.user.uid)
      .where("name", "==", name)
      .get();

    if (!existingListSnapshot.empty) {
      return res
        .status(400)
        .json({ error: "A list with this name already exists." });
    }

    const newList = {
      userID: req.user.uid,
      name,
      description: description || "",
      isPublic: isPublic || false,
      destinationIds: destinationIds || [],
      averageRating: 0, // Default value
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    const listRef = await db.collection("lists").add(newList);
    res.status(201).json({ id: listRef.id, ...newList });
  } catch (error) {
    console.error("Error creating list:", error.message);
    res.status(500).json({ error: "Failed to create list" });
  }
});

// Get all lists for the logged-in user
router.get("/lists", verifyToken, async (req, res) => {
  try {
    const listsSnapshot = await db
      .collection("lists")
      .where("userID", "==", req.user.uid) // Filter by userID
      .get();

    const lists = listsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ error: "Failed to fetch lists" });
  }
});

// Delete a list
router.delete("/lists/:id", verifyToken, async (req, res) => {
  const listId = req.params.id;

  try {
    const listRef = db.collection("lists").doc(listId);
    const listDoc = await listRef.get();

    if (!listDoc.exists) {
      return res.status(404).json({ error: "List not found" });
    }

    if (listDoc.data().userID !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this list" });
    }

    await listRef.delete();
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ error: "Failed to delete list" });
  }
});

// Get all public lists
router.get("/lists/public", async (req, res) => {
  try {
    const publicListsSnapshot = await db
      .collection("lists")
      .where("isPublic", "==", true)
      .get();

    const publicLists = publicListsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(publicLists);
  } catch (error) {
    console.error("Error fetching public lists:", error);
    res.status(500).json({ error: "Failed to fetch public lists" });
  }
});

//update list
router.put("/lists/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, isPublic, destinationIds } = req.body;

  try {
    const listRef = db.collection("lists").doc(id);
    const listDoc = await listRef.get();

    if (!listDoc.exists) {
      return res.status(404).json({ error: "List not found" });
    }

    if (listDoc.data().userID !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await listRef.update({
      name,
      description,
      isPublic,
      destinationIds,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    res.status(200).json({ message: "List updated successfully" });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ error: "Failed to update list" });
  }
});

module.exports = router;

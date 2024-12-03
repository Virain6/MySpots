const express = require("express");
const { admin } = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const db = admin.firestore(); // Firestore Database

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  console.log("Middleware: verifyToken called");
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify the token
    req.user = decodedToken; // Attach user info to request
    console.log("Middleware: verifyToken successful");
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Helper function to fetch nickname
const getNicknameByUserID = async (userID) => {
  console.log(`Helper: getNicknameByUserID called for userID ${userID}`);
  try {
    const userDoc = await db.collection("users").doc(userID).get();
    if (userDoc.exists) {
      return userDoc.data().nickname;
    }
    return "Unknown";
  } catch (error) {
    console.error("Error fetching user nickname:", error.message);
    return "Unknown";
  }
};

// Add destinations to a list
router.post("/lists/:id/destinations", verifyToken, async (req, res) => {
  console.log("API: POST /lists/:id/destinations called");
  const listId = req.params.id;
  const { destinationId } = req.body;

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
      destinationIds: admin.firestore.FieldValue.arrayUnion(destinationId),
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
  console.log("API: GET /lists/:id/destinations called");
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
  console.log("API: POST /lists called");
  const { name, description, isPublic, destinationIds } = req.body;

  if (!name) {
    return res.status(400).json({ error: "List name is required" });
  }

  try {
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
      averageRating: 0,
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
  console.log("API: GET /lists called");
  try {
    const listsSnapshot = await db
      .collection("lists")
      .where("userID", "==", req.user.uid)
      .orderBy("updatedAt", "desc") // Sort by modification date (most recent first)
      .get();

    const lists = await Promise.all(
      listsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const nickname = await getNicknameByUserID(data.userID);
        return { id: doc.id, ...data, nickname };
      })
    );

    res.status(200).json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ error: "Failed to fetch lists" });
  }
});

// Get all public lists
router.get("/lists/public", async (req, res) => {
  console.log("API: GET /lists/public called");
  try {
    const publicListsSnapshot = await db
      .collection("lists")
      .where("isPublic", "==", true)
      .orderBy("updatedAt", "desc") // Sort by updatedAt descending
      .limit(10) // Limit to 10 results
      .get();

    const publicLists = await Promise.all(
      publicListsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const nickname = await getNicknameByUserID(data.userID);
        return { id: doc.id, ...data, nickname };
      })
    );

    res.status(200).json(publicLists);
  } catch (error) {
    console.error("Error fetching public lists:", error);
    res.status(500).json({ error: "Failed to fetch public lists" });
  }
});
// Update list
router.put("/lists/:id", verifyToken, async (req, res) => {
  console.log("API: PUT /lists/:id called");
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

// Delete a list
router.delete("/lists/:id", verifyToken, async (req, res) => {
  console.log("API: DELETE /lists/:id called");
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

module.exports = router;

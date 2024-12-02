const express = require("express");
const { admin } = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const db = admin.firestore(); // Firestore Database

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Bearer token is missing" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Helper to check user roles
const getUserRole = async (userID) => {
  try {
    const userDoc = await db.collection("users").doc(userID).get();
    if (userDoc.exists) {
      return userDoc.data().role || "user"; // Default to "user" if no role is defined
    }
    return "user";
  } catch (error) {
    console.error("Error fetching user role:", error.message);
    return "user";
  }
};

// Add a review to a list
router.post("/reviews", verifyToken, async (req, res) => {
  console.log("API call: POST /reviews");

  const { listID, comment, rating, hidden } = req.body;

  if (!listID || !comment || !rating) {
    return res
      .status(400)
      .json({ error: "listID, comment, and rating are required" });
  }

  try {
    const newReview = {
      listID: db.doc(listID),
      userID: db.doc(`users/${req.user.uid}`),
      comment,
      rating,
      hidden: !!hidden, // Defaults to false if not provided
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const reviewRef = await db.collection("reviews").add(newReview);
    console.log("Review added successfully:", reviewRef.id);

    res.status(201).json({ id: reviewRef.id, ...newReview });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// Fetch reviews for a specific list
router.get("/reviews/:listID", verifyToken, async (req, res) => {
  console.log("API call: GET /reviews/:listID");

  const { listID } = req.params;

  if (!listID) {
    return res.status(400).json({ error: "listID is required" });
  }

  try {
    const userRole = await getUserRole(req.user.uid);

    let query = db.collection("reviews").where("listID", "==", db.doc(listID));

    // Restrict to non-hidden reviews for regular users
    if (userRole !== "admin" && userRole !== "manager") {
      query = query.where("hidden", "==", false);
    }

    const reviewsSnapshot = await query.get();

    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Reviews fetched successfully");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;

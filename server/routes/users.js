const express = require("express");
const { admin } = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const db = admin.firestore(); // Firestore Database

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify the token
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Get user profile
router.get("/users/profile", verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put("/users/profile", verifyToken, async (req, res) => {
  const { nickname, role } = req.body; // Fields you want to allow updates for
  try {
    const userRef = db.collection("users").doc(req.user.uid);

    // Only update allowed fields
    const updateData = {};
    if (nickname) updateData.nickname = nickname;
    if (role) updateData.role = role;

    await userRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

module.exports = router;

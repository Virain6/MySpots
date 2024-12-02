const express = require("express");
const { admin } = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const db = admin.firestore(); // Firestore Database

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  console.log("API call: Verifying token");

  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    console.error("Error: No token provided");
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
  console.log("API call: GET /users/profile");

  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      console.error("Error: User profile not found");
      return res.status(404).json({ error: "User profile not found" });
    }

    console.log("User profile fetched successfully");
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put("/users/profile", verifyToken, async (req, res) => {
  console.log("API call: PUT /users/profile");

  const { nickname, role } = req.body; // Fields to update
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

    console.log("User profile updated successfully");
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Update user password
router.post("/users/update-password", verifyToken, async (req, res) => {
  console.log("API call: POST /users/update-password");

  const { currentPassword, newPassword } = req.body;
  const userID = req.user.uid;

  try {
    // Replace this with your logic to verify the current password
    await admin.auth().updateUser(userID, { password: newPassword });

    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ error: "Failed to update password" });
  }
});

module.exports = router;

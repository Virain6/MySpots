const express = require("express");
const { admin, db } = require("../firebaseAdmin"); // Import initialized Firebase Admin SDK
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nickname,
    });

    // Add user to Firestore
    await db.collection("users").doc(userRecord.uid).set({
      id: userRecord.uid,
      email: userRecord.email,
      nickname,
      role: "user", // Default role
      disabled: false, // Default state
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res
      .status(201)
      .json({
        message: "User registered successfully",
        userId: userRecord.uid,
      });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

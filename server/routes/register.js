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

    // Generate an email verification link
    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email);

    // Print the verification link in the console
    console.log(`Verification link for ${email}: ${verificationLink}`);

    // Send response to the client
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      userId: userRecord.uid,
      verificationLink, // Optional: Include the link in the response for debugging (not recommended for production)
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

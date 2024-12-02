const express = require("express");
const { admin } = require("../firebaseAdmin"); // Import Firebase Admin SDK
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (!user.emailVerified) {
      // Generate a new email verification link
      const verificationLink = await admin
        .auth()
        .generateEmailVerificationLink(email);

      return res.status(403).json({
        error: "Email not verified. Please verify your email to log in.",
        verificationLink, // Send the link in the response
      });
    }

    const customToken = await admin.auth().createCustomToken(user.uid);
    res.status(200).json({ token: customToken, message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

module.exports = router;

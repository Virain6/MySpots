const express = require("express");
const { admin } = require("../firebaseAdmin"); // Import Firebase Admin SDK
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Get the user record by email
    const user = await admin.auth().getUserByEmail(email);

    // Check if the email is verified
    if (!user.emailVerified) {
      return res
        .status(403)
        .json({
          error: "Email not verified. Please verify your email to log in.",
        });
    }

    // Generate a custom Firebase token for the user
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.status(200).json({ token: customToken, message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Invalid email or password" });
  }
});

module.exports = router;

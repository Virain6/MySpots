const express = require("express");
const { admin } = require("../firebaseAdmin"); // Import Firebase Admin SDK
const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("API: POST /login called"); // Log when the route is called
  const { email } = req.body;

  if (!email) {
    console.error("Error: Email is required but not provided."); // Log missing email
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    console.log(`Fetching user record for email: ${email}`); // Log the email being processed
    const user = await admin.auth().getUserByEmail(email);

    console.log(`User found for email: ${email}`); // Log user found

    // Check if the email is verified
    if (!user.emailVerified) {
      console.error(`Email not verified for user: ${email}`); // Log unverified email
      return res.status(403).json({
        error: "Email not verified. Please verify your email to log in.",
      });
    }

    console.log(`Generating custom token for user ID: ${user.uid}`); // Log token generation
    const customToken = await admin.auth().createCustomToken(user.uid);

    console.log(`Custom token generated for user ID: ${user.uid}`); // Log token generated
    res.status(200).json({ token: customToken, message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error.message); // Log the error message
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

module.exports = router;

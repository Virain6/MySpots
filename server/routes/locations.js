const express = require("express");
const { db } = require("../firebaseAdmin"); // Import Firestore instance
const router = express.Router();

// Fetch all locations from Firestore
router.get("/locations", async (req, res) => {
  try {
    const locationsSnapshot = await db.collection("destinations").get();
    const locations = locationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

module.exports = router;

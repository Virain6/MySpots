const express = require("express");
const { db } = require("../firebaseAdmin"); // Import Firestore instance
const router = express.Router();

// Fetch locations with optional filters and limits
router.get("/locations", async (req, res) => {
  const { name, region, country, limit } = req.query;

  try {
    let query = db.collection("destinations");

    // Partial match and case-insensitive filters
    if (name) {
      query = query
        .where("nameLowercase", ">=", name.toLowerCase())
        .where("nameLowercase", "<=", name.toLowerCase() + "\uf8ff");
    }
    if (region) {
      query = query
        .where("regionLowercase", ">=", region.toLowerCase())
        .where("regionLowercase", "<=", region.toLowerCase() + "\uf8ff");
    }
    if (country) {
      query = query
        .where("countryLowercase", ">=", country.toLowerCase())
        .where("countryLowercase", "<=", country.toLowerCase() + "\uf8ff");
    }

    // Limit the results
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const locationsSnapshot = await query.get();
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

// Fetch specific destinations by IDs
router.post("/destinations", async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid destination IDs provided" });
  }

  try {
    const destinationDocs = await Promise.all(
      ids.map((id) => db.collection("destinations").doc(id).get())
    );

    const destinations = destinationDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

module.exports = router;

const express = require("express");
const { db } = require("../firebaseAdmin"); // Import Firestore instance
const router = express.Router();

// Fetch locations with optional filters and limits
router.get("/locations", async (req, res) => {
  console.log("API: GET /locations called");
  const { name, region, country, limit } = req.query;

  try {
    let query = db.collection("destinations");
    console.log("Filters received:", { name, region, country, limit });

    // Partial match and case-insensitive filters
    if (name) {
      console.log(`Applying name filter: ${name}`);
      query = query
        .where("nameLowercase", ">=", name.toLowerCase())
        .where("nameLowercase", "<=", name.toLowerCase() + "\uf8ff");
    }
    if (region) {
      console.log(`Applying region filter: ${region}`);
      query = query
        .where("regionLowercase", ">=", region.toLowerCase())
        .where("regionLowercase", "<=", region.toLowerCase() + "\uf8ff");
    }
    if (country) {
      console.log(`Applying country filter: ${country}`);
      query = query
        .where("countryLowercase", ">=", country.toLowerCase())
        .where("countryLowercase", "<=", country.toLowerCase() + "\uf8ff");
    }

    // Limit the results
    if (limit) {
      console.log(`Applying limit: ${limit}`);
      query = query.limit(parseInt(limit));
    }

    const locationsSnapshot = await query.get();
    const locations = locationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Fetched ${locations.length} location(s)`);
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error.message);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Fetch specific destinations by IDs
router.post("/destinations", async (req, res) => {
  console.log("API: POST /destinations called");
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    console.error("Invalid destination IDs provided");
    return res.status(400).json({ error: "Invalid destination IDs provided" });
  }

  try {
    console.log(`Fetching destinations for IDs: ${ids}`);
    const destinationDocs = await Promise.all(
      ids.map((id) => db.collection("destinations").doc(id).get())
    );

    const destinations = destinationDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    console.log(`Fetched ${destinations.length} destination(s)`);
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error.message);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

module.exports = router;

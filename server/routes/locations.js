const express = require("express");
const { db } = require("../firebaseAdmin"); // Import Firestore instance
const router = express.Router();

router.get("/locations", async (req, res) => {
  console.log("API: GET /locations called");
  const { name, region, country, limit } = req.query;

  try {
    let queries = [];
    console.log("Filters received:", { name, region, country, limit });

    // Partial match queries for each field
    if (name) {
      console.log(`Applying name filter: ${name}`);
      queries.push(
        db
          .collection("destinations")
          .where("nameLowercase", ">=", name.toLowerCase())
          .where("nameLowercase", "<=", name.toLowerCase() + "\uf8ff")
          .get()
      );
    }
    if (region) {
      console.log(`Applying region filter: ${region}`);
      queries.push(
        db
          .collection("destinations")
          .where("regionLowercase", ">=", region.toLowerCase())
          .where("regionLowercase", "<=", region.toLowerCase() + "\uf8ff")
          .get()
      );
    }
    if (country) {
      console.log(`Applying country filter: ${country}`);
      queries.push(
        db
          .collection("destinations")
          .where("countryLowercase", ">=", country.toLowerCase())
          .where("countryLowercase", "<=", country.toLowerCase() + "\uf8ff")
          .get()
      );
    }

    let locations = [];
    if (queries.length === 0) {
      // If no filters are provided, fetch all documents with a limit
      console.log("No filters provided, fetching all documents.");
      const allDocs = await db
        .collection("destinations")
        .limit(parseInt(limit || 5)) // Default limit to 5 if not specified
        .get();
      locations = allDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      // Handle filtered results
      const querySnapshots = await Promise.all(queries);

      // Combine results from all queries
      const combinedResults = new Map();
      querySnapshots.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => {
          combinedResults.set(doc.id, {
            id: doc.id,
            ...doc.data(),
          });
        });
      });

      // Convert the Map back to an array and apply the limit
      locations = Array.from(combinedResults.values()).slice(
        0,
        parseInt(limit || 5) // Default limit to 5 if not specified
      );
    }

    console.log(`Fetched ${locations.length} location(s).`);
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

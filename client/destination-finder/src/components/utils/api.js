export const fetchLocations = async (filters = {}, limit = 5) => {
  try {
    const queryParams = new URLSearchParams({
      name: filters.name ? filters.name.toLowerCase() : "",
      region: filters.region ? filters.region.toLowerCase() : "",
      country: filters.country ? filters.country.toLowerCase() : "",
      limit: limit.toString(),
    });

    const response = await fetch(
      `http://localhost:3001/api/locations?${queryParams}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

export const fetchUserProfile = async (token) => {
  try {
    const response = await fetch("http://localhost:3001/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

export const fetchUserLists = async (token) => {
  console.log("Token being sent:", token); // Debugging log
  try {
    const response = await fetch("http://localhost:3001/api/lists", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user-specific lists");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user-specific lists:", error);
    return [];
  }
};

export const fetchPublicLists = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/lists/public");
    if (!response.ok) {
      throw new Error("Failed to fetch public lists");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching public lists:", error);
    return [];
  }
};

export const createList = async (token, listData) => {
  try {
    const response = await fetch("http://localhost:3001/api/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listData),
    });

    if (!response.ok) {
      throw new Error("Failed to create list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating list:", error.message);
    throw error;
  }
};

export const addDestinationToList = async (token, listId, destinationId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/lists/${listId}/destinations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinationId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add destination to list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding destination:", error.message);
    throw error;
  }
};

export const fetchDestinations = async (destinationIds) => {
  try {
    const response = await fetch("http://localhost:3001/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: destinationIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch destinations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
};

export const updateListDetails = async (token, updatedList) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/lists/${updatedList.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedList.name,
          description: updatedList.description,
          isPublic: updatedList.isPublic,
          destinationIds: updatedList.destinations.map((d) => d.id),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update list: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

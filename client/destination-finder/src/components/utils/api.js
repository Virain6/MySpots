export const fetchLocations = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/locations");
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
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

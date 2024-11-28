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

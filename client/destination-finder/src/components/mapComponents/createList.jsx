import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext for token and user
import { createList, fetchLocations, fetchUserLists } from "../utils/api"; // API calls to create list, fetch locations, and user lists

const CreateListForm = ({ closeList }) => {
  const { token } = useAuth(); // Access the token from AuthContext
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    destinations: [],
  });
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [resultLimit, setResultLimit] = useState(10); // Limit for results
  const [existingListNames, setExistingListNames] = useState([]); // Existing user list names
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user's existing lists to ensure unique list names
  useEffect(() => {
    const fetchUserListsNames = async () => {
      try {
        const userLists = await fetchUserLists(token);
        setExistingListNames(userLists.map((list) => list.name.toLowerCase()));
      } catch (err) {
        console.error("Failed to fetch user lists:", err);
      }
    };
    fetchUserListsNames();
  }, [token]);

  // Fetch destinations based on search term and result limit
  const loadDestinations = async () => {
    setLoadingLocations(true);
    try {
      const locations = await fetchLocations({
        name: searchTerm,
        limit: resultLimit,
      });
      setAvailableDestinations(locations);
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
      setError("Failed to load destinations. Please try again.");
    } finally {
      setLoadingLocations(false);
    }
  };

  // Load destinations whenever searchTerm or resultLimit changes
  useEffect(() => {
    loadDestinations();
  }, [searchTerm, resultLimit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddDestination = (destination) => {
    if (!formData.destinations.some((d) => d.id === destination.id)) {
      setFormData({
        ...formData,
        destinations: [...formData.destinations, destination],
      });
    }
  };

  const handleRemoveDestination = (destinationId) => {
    setFormData({
      ...formData,
      destinations: formData.destinations.filter((d) => d.id !== destinationId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Check if list name is unique
    if (existingListNames.includes(formData.name.toLowerCase())) {
      setError("A list with this name already exists.");
      setLoading(false);
      return;
    }

    try {
      // Send formData with destinationIds instead of full destination objects
      await createList(token, {
        ...formData,
        destinationIds: formData.destinations.map((d) => d.id),
      });
      setSuccess("List created successfully!");
      setFormData({
        name: "",
        description: "",
        isPublic: false,
        destinations: [],
      }); // Reset form
      setSearchTerm(""); // Reset search
    } catch (err) {
      console.error("Error creating list:", err);
      setError("Failed to create list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create a New List</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">List Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Selected Destinations</h3>
          <ul className="max-h-40 overflow-y-auto">
            {formData.destinations.map((destination) => (
              <li
                key={destination.id}
                className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
              >
                <span>{destination.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDestination(destination.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h4 className="font-semibold mb-2">Add Destinations</h4>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          />
          {loadingLocations ? (
            <p>Loading destinations...</p>
          ) : (
            <ul className="max-h-40 overflow-y-auto">
              {availableDestinations.map((location) =>
                formData.destinations.some(
                  (d) => d.id === location.id
                ) ? null : (
                  <li
                    key={location.id}
                    className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
                  >
                    <span>{location.name}</span>
                    <button
                      type="button"
                      onClick={() => handleAddDestination(location)}
                      className="text-blue-500"
                    >
                      Add
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
          <div className="mt-2 flex justify-between items-center">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setResultLimit((prev) => Math.max(5, prev - 5))}
            >
              Show Less
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setResultLimit((prev) => prev + 5)}
            >
              Show More
            </button>
          </div>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <span>Make Public</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {loading ? "Creating..." : "Create List"}
        </button>
        <button
          type="button"
          onClick={closeList}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateListForm;

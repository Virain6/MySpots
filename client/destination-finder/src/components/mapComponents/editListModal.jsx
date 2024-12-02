import React, { useState, useEffect } from "react";
import { fetchLocations } from "../utils/api"; // Updated API call for incremental fetch and server-side search

const EditListModal = ({ list, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: list.name,
    description: list.description,
    isPublic: list.isPublic,
    destinations: list.destinations,
  });
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [resultLimit, setResultLimit] = useState(5); // Limit results initially
  const [error, setError] = useState("");

  // Fetch filtered locations from the backend
  const loadLocations = async () => {
    setLoadingLocations(true);
    setError("");
    try {
      const locations = await fetchLocations(
        { name: searchTerm }, // Only search by name (case-insensitive with backend logic)
        resultLimit
      );
      setFilteredDestinations(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Failed to fetch locations. Please try again.");
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...list,
      ...formData,
      destinationIds: formData.destinations.map((d) => d.id),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">Edit List</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Public</label>
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
            <h4 className="font-semibold mb-2">Search Destinations</h4>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <button
              type="button"
              onClick={loadLocations}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
            >
              Search
            </button>
            {loadingLocations ? (
              <p>Loading locations...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul className="max-h-40 overflow-y-auto">
                {filteredDestinations.map((location) =>
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setResultLimit((prev) => Math.max(5, prev - 5))}
              >
                Show Less
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setResultLimit((prev) => prev + 5)}
              >
                Show More
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListModal;

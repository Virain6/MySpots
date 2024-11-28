import React, { useState, useEffect } from "react";
import LocationList from "./locationList";
import { fetchLocations } from "../utils/api";

const ExpandableBox = ({ onLocationSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    region: "",
    country: "",
  });
  const [resultLimit, setResultLimit] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState(null); // Store the current selected location

  useEffect(() => {
    const loadLocations = async () => {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);
    };

    loadLocations();
  }, []);

  // Filter locations dynamically based on multiple filters
  const filteredLocations = locations
    .filter((location) => {
      return (
        (!filters.name ||
          location.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.region ||
          location.region
            .toLowerCase()
            .includes(filters.region.toLowerCase())) &&
        (!filters.country ||
          location.country
            .toLowerCase()
            .includes(filters.country.toLowerCase()))
      );
    })
    .slice(0, resultLimit); // Limit results

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location); // Update the selected location
    onLocationSelect(location); // Notify parent component (map)
    setIsExpanded(false); // Collapse the box after selection
  };

  return (
    <div
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
        isExpanded ? "h-96" : "h-16"
      } w-4/5 bg-slate-500 rounded-lg shadow-lg overflow-hidden z-10`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-center h-16 bg-violet-950 text-white font-semibold cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {selectedLocation ? selectedLocation.name : "Expand"}
      </div>

      {isExpanded && (
        <div className="p-4 bg-slate-600 h-full overflow-y-auto">
          {/* Search Fields */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="text-gray-50 block mb-1">Search by Name:</label>
              <input
                type="text"
                placeholder="Enter name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="w-full p-2 rounded bg-gray-200 text-black"
              />
            </div>

            <div className="flex-1">
              <label className="text-gray-50 block mb-1">
                Search by Region:
              </label>
              <input
                type="text"
                placeholder="Enter region"
                value={filters.region}
                onChange={(e) => handleFilterChange("region", e.target.value)}
                className="w-full p-2 rounded bg-gray-200 text-black"
              />
            </div>

            <div className="flex-1">
              <label className="text-gray-50 block mb-1">
                Search by Country:
              </label>
              <input
                type="text"
                placeholder="Enter country"
                value={filters.country}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                className="w-full p-2 rounded bg-gray-200 text-black"
              />
            </div>
          </div>

          {/* Incrementer */}
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-50">Number of Results:</label>
            <div className="flex items-center">
              <button
                className="px-4 py-2 bg-gray-300 rounded-l hover:bg-gray-400"
                onClick={() => setResultLimit((prev) => Math.max(5, prev - 5))}
              >
                -
              </button>
              <span className="px-4 py-2 bg-gray-200">{resultLimit}</span>
              <button
                className="px-4 py-2 bg-gray-300 rounded-r hover:bg-gray-400"
                onClick={() => setResultLimit((prev) => prev + 5)}
              >
                +
              </button>
            </div>
          </div>

          {/* Location List */}
          <LocationList
            locations={filteredLocations}
            onLocationClick={handleLocationClick} // Pass updated click handler
          />
        </div>
      )}
    </div>
  );
};

export default ExpandableBox;

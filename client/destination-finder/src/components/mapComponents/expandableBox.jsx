import React, { useState, useEffect } from "react";
import LocationList from "./locationList";
import ListsTab from "./listTab"; // Import the ListsTab component
import { fetchLocations } from "../utils/api";

const ExpandableBox = ({
  onLocationSelect,
  onOpenCreateList,
  onEditList,
  handleOpenPopup,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("search"); // "search" or "lists"
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    region: "",
    country: "",
  });
  const [resultLimit, setResultLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the top 5 locations immediately on component load
  useEffect(() => {
    const loadInitialLocations = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedLocations = await fetchLocations({}, 5); // Fetch top 5
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching initial locations:", error);
        setError("Failed to load locations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialLocations();
  }, []);

  // Fetch locations based on filters and limit
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedLocations = await fetchLocations(filters, resultLimit);
      setLocations(fetchedLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Failed to load locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value.toLowerCase(), // Ensure lowercase values are sent
    }));
  };

  const handleIncrementLimit = () => {
    setResultLimit((prev) => prev + 5);
  };

  const handleDecrementLimit = () => {
    setResultLimit((prev) => Math.max(5, prev - 5));
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
        {isExpanded ? "Collapse" : "Expand"}
      </div>

      {isExpanded && (
        <div className="p-4 bg-slate-600 h-full overflow-y-auto">
          {/* Tabs */}
          <div className="flex justify-around mb-4">
            <button
              className={`w-1/2 py-2 text-center ${
                activeTab === "search"
                  ? "bg-violet-700 text-white"
                  : "bg-gray-700 text-gray-300"
              } rounded-l`}
              onClick={() => setActiveTab("search")}
            >
              Search Destinations
            </button>
            <button
              className={`w-1/2 py-2 text-center ${
                activeTab === "lists"
                  ? "bg-violet-700 text-white"
                  : "bg-gray-700 text-gray-300"
              } rounded-r`}
              onClick={() => setActiveTab("lists")}
            >
              View Lists
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "search" ? (
            <div>
              {/* Search Fields */}
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label className="text-gray-50 block mb-1">
                    Search by Name:
                  </label>
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
                    onChange={(e) =>
                      handleFilterChange("region", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleFilterChange("country", e.target.value)
                    }
                    className="w-full p-2 rounded bg-gray-200 text-black"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Search
              </button>

              {/* Incrementer */}
              <div className="flex items-center justify-between mb-4 mt-4">
                <label className="text-gray-50">Number of Results:</label>
                <div className="flex items-center">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-l hover:bg-gray-400"
                    onClick={handleDecrementLimit}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 bg-gray-200">{resultLimit}</span>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-r hover:bg-gray-400"
                    onClick={handleIncrementLimit}
                  >
                    +
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-gray-50">Loading locations...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <LocationList
                  locations={locations}
                  onLocationClick={onLocationSelect}
                />
              )}
            </div>
          ) : (
            <ListsTab
              onOpenCreateList={onOpenCreateList}
              onEditList={onEditList}
              handleOpenPopup={handleOpenPopup}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ExpandableBox;

import React, { useEffect, useState } from "react";
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { fetchLocations } from "./utils/api";

const LeafletMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(
    locations[0] ? locations[0] : { latitude: 0, longitude: 0 }
  );
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [resultLimit, setResultLimit] = useState(5);
  const [lists, setLists] = useState([]); // Stores all lists
  const [newListName, setNewListName] = useState(""); // For creating a new list
  const [showPopup, setShowPopup] = useState(false); // Toggle popup visibility
  const [selectedList, setSelectedList] = useState(""); // Currently selected list to view destinations

  useEffect(() => {
    const loadLocations = async () => {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);

      if (fetchedLocations.length > 0) {
        setSelectedLocation(fetchedLocations[0]);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    const initialMap = L.map("map").setView(
      [selectedLocation.latitude, selectedLocation.longitude],
      13
    );
    setMap(initialMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(initialMap);

    L.marker([selectedLocation.latitude, selectedLocation.longitude])
      .addTo(initialMap)
      .bindPopup(selectedLocation.name)
      .openPopup();

    return () => {
      initialMap.remove();
    };
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location); // Update selected location state

    if (map) {
      map.setView([location.latitude, location.longitude], 13); // Center the map
      L.marker([location.latitude, location.longitude]) // Add a marker
        .addTo(map)
        .bindPopup(location.name)
        .openPopup();
    }

    setIsExpanded(false); // Collapse the expandable box if needed
  };

  const handleCreateList = () => {
    if (newListName) {
      setLists([...lists, { name: newListName, destinations: [] }]);
      setNewListName("");
      setShowPopup(false);
    }
  };

  const addToList = (location, listName) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.name === listName
          ? { ...list, destinations: [...list.destinations, location] }
          : list
      )
    );
  };

  const removeFromList = (location, listName) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.name === listName
          ? {
              ...list,
              destinations: list.destinations.filter(
                (dest) => dest.id !== location.id
              ),
            }
          : list
      )
    );
  };

  const handleDeleteSelectedList = () => {
    if (selectedList) {
      setLists((prevLists) =>
        prevLists.filter((list) => list.name !== selectedList)
      );
      setSelectedList(""); // Reset the selected list after deletion
    } else {
      alert("No list selected!");
    }
  };

  const filteredLocations = locations
    .filter((loc) => {
      if (
        searchBy === "name" &&
        searchQuery &&
        !loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (
        searchBy === "country" &&
        searchQuery &&
        !loc.country.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .slice(0, resultLimit);

  const selectedListDestinations =
    lists.find((list) => list.name === selectedList)?.destinations || [];

  return (
    <div>
      {/* Map */}
      <div
        id="map"
        style={{
          height: "calc(100vh - 4rem)",
          width: "100vw",
          position: "fixed",
          top: "4rem",
          left: 0,
          zIndex: 0,
        }}
      ></div>

      {/* Expandable Box */}
      <div
        className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
          isExpanded ? "h-1/2" : "h-16"
        }`}
        style={{
          width: "75%",
          zIndex: 10,
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#2e1065",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <button
          className="w-full text-center bg-violet-950 text-white py-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {`Current: ${selectedLocation.name}`}
        </button>

        {isExpanded && (
          <div className="p-4 overflow-y-auto max-h-full bg-violet-600">
            <h2 className="text-xl font-semibold text-gray-50 mb-4">
              Manage Lists
            </h2>

            {/* Create List Button and View Lists Dropdown */}
            <div className="flex items-center justify-between mb-4">
              {/* View List Dropdown */}
              <select
                className="p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
              >
                <option value="">Select a List</option>
                {lists.map((list) => (
                  <option key={list.name} value={list.name}>
                    {list.name}
                  </option>
                ))}
              </select>
              <div>
                {/*Delete List Button*/}
                <button
                  onClick={handleDeleteSelectedList}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white mt-4 mr-2"
                >
                  Delete List
                </button>
                {/* Create List Button */}
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => setShowPopup(true)}
                >
                  Create New List
                </button>
              </div>
            </div>

            {/* Display Destinations in Selected List */}
            {selectedList && (
              <div className="mt-2 mb-6">
                <h4 className="text-md font-semibold text-gray-100 mb-2">
                  Destinations in {selectedList}
                </h4>
                <ul className="space-y-2">
                  {selectedListDestinations.map((destination) => (
                    <li
                      key={destination.id}
                      onClick={() => {
                        handleLocationSelect(destination); // Update the map view and marker
                      }}
                      className="py-2 px-4 bg-violet-700 rounded text-white flex justify-between items-center"
                    >
                      <span>
                        {destination.name} ({destination.country})
                      </span>
                      <button
                        onClick={() =>
                          removeFromList(destination, selectedList)
                        }
                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Popup for Creating a List */}
            {showPopup && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Create a New List
                  </h3>
                  <input
                    type="text"
                    placeholder="List Name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    onClick={handleCreateList}
                  >
                    Create
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-50 mb-4">
                Search Location
              </h2>

              {/* Search Controls */}
              <div className="flex items-center space-x-4 mb-4">
                {/* Search Type Dropdown */}
                <select
                  className="p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <option value="name">Search by Name</option>
                  <option value="country">Search by Country</option>
                </select>

                {/* Search Bar */}
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  placeholder={`Search by ${searchBy}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Incrementer for Search Results Limit */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-white">Results Limit:</label>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() =>
                      setResultLimit((prev) => Math.max(5, prev - 5))
                    }
                  >
                    -
                  </button>
                  <span className="text-white">{resultLimit}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => setResultLimit((prev) => prev + 5)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Filtered Locations */}
              <ul className="mt-4 mb-8">
                {filteredLocations.map((location) => (
                  <li
                    key={location.id}
                    onClick={() => {
                      handleLocationSelect(location); // Update the map view and marker
                    }}
                    className="py-2 px-4 bg-violet-700 rounded mb-2 text-white flex justify-between"
                  >
                    <span>
                      {location.name} ({location.country})
                    </span>
                    <button
                      className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                      onClick={() =>
                        lists.length > 0
                          ? addToList(location, lists[0].name) // Automatically adds to the first list
                          : alert("Please create a list first!")
                      }
                    >
                      Add to List
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafletMap;

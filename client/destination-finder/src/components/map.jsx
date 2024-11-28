import React, { useEffect, useState } from "react";
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const LeafletMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Initialize the map
    const map = L.map("map").setView([43.6532, -79.3832], 13); // Toronto coordinates

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker
    const marker = L.marker([43.6532, -79.3832]).addTo(map);

    // Add a popup to the marker
    marker.bindPopup("This is Toronto!").openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      {/* Map */}
      <div
        id="map"
        style={{
          height: "calc(100vh - 4rem)", // Subtract navbar height
          width: "100vw",
          position: "fixed",
          top: "4rem", // Start below the navbar
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
          width: "75%", // Adjust width
          zIndex: 10,
          borderRadius: "16px", // Fully rounded edges
          overflow: "hidden", // Prevent content overflow
          backgroundColor: isExpanded ? "white" : "transparent", // Hide white when collapsed
          boxShadow: isExpanded ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none", // Add shadow when expanded
        }}
      >
        {/* Toggle Button */}
        <button
          className="w-full text-center bg-violet-950 text-white py-2"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            borderRadius: "16px", // Rounded edges for the button itself
            borderBottomLeftRadius: isExpanded ? "0" : "16px", // Remove bottom rounding when expanded
            borderBottomRightRadius: isExpanded ? "0" : "16px",
          }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>

        {/* Box Content */}
        <div
          className={`p-4 overflow-hidden ${
            isExpanded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <h2 className="text-xl font-semibold">Expandable Box Content</h2>
          <p className="text-gray-600">
            This is the content inside the expandable box.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;

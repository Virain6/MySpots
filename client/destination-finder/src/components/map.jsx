import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ExpandableBox from "./mapComponents/expandableBox";

const LeafletMap = () => {
  const [map, setMap] = useState(null); // Store the Leaflet map instance

  useEffect(() => {
    // Initialize the map
    const initialMap = L.map("map").setView([51.505, -0.09], 13);
    setMap(initialMap); // Store the map instance

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(initialMap);

    // Add default marker
    L.marker([51.505, -0.09])
      .addTo(initialMap)
      .bindPopup("Default Location: London")
      .openPopup();

    return () => {
      initialMap.remove(); // Clean up map on component unmount
    };
  }, []);

  const handleLocationSelect = (location) => {
    if (map) {
      // Update the map view
      map.setView([location.latitude, location.longitude], 13);

      // Add a marker for the selected location
      L.marker([location.latitude, location.longitude])
        .addTo(map)
        .bindPopup(location.name)
        .openPopup();
    }
  };

  return (
    <div className="relative w-screen" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Map */}
      <div id="map" className="absolute top-0 left-0 h-full w-full z-0"></div>

      {/* Expandable Box */}
      <ExpandableBox onLocationSelect={handleLocationSelect} />
    </div>
  );
};

export default LeafletMap;

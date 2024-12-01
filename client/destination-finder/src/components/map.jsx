import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ExpandableBox from "./mapComponents/expandableBox";
import LocationDetails from "./mapComponents/locationDetails";

const LeafletMap = () => {
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const initialMap = L.map("map").setView([51.505, -0.09], 13);
    setMap(initialMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(initialMap);

    L.marker([51.505, -0.09])
      .addTo(initialMap)
      .bindPopup("Default Location: London")
      .openPopup();

    return () => {
      initialMap.remove();
    };
  }, []);

  const handleLocationSelect = (location) => {
    if (map) {
      map.setView([location.latitude, location.longitude], 13);
      L.marker([location.latitude, location.longitude])
        .addTo(map)
        .bindPopup(location.name)
        .openPopup();
    }
    setSelectedLocation(location); // Update selected location
  };

  const clearSelectedLocation = () => {
    setSelectedLocation(null); // Clear the selected location
  };

  return (
    <div className="relative w-screen" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Map */}
      <div id="map" className="absolute top-0 left-0 h-full w-full z-0"></div>

      {/* Location Details */}
      {selectedLocation && (
        <LocationDetails
          location={selectedLocation}
          onClearLocation={clearSelectedLocation}
        />
      )}

      {/* Expandable Box */}
      <ExpandableBox onLocationSelect={handleLocationSelect} />
    </div>
  );
};

export default LeafletMap;

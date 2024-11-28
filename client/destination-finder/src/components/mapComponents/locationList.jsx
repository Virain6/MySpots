import React from "react";

const LocationList = ({ locations, onLocationClick }) => {
  return (
    <div className="p-4 bg-slate-700 h-full overflow-y-auto mb-16">
      <h3 className="text-lg font-semibold mb-4 text-gray-50">Locations</h3>
      {locations.length === 0 ? (
        <p>No locations available.</p>
      ) : (
        <ul className="space-y-2">
          {locations.map((location) => (
            <li
              key={location.id}
              className="p-3 bg-emerald-500 rounded hover:bg-emerald-600 cursor-pointer"
              onClick={() => onLocationClick(location)}
            >
              {location.name} ({location.country})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationList;

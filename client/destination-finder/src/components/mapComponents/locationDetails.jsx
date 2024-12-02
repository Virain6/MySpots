import React from "react";

const LocationDetails = ({ location, onClearLocation }) => {
  const handleDuckDuckGoSearch = () => {
    if (location?.name) {
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(
        location.name + " " + location.country
      )}`;
      window.open(searchUrl, "_blank"); // Opens the search in a new tab
    }
  };
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 bg-slate-500 text-white rounded-lg shadow-lg p-4 z-20 max-h-60 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        {location ? (
          <h2 className="text-xl font-bold text-violet-200">{location.name}</h2>
        ) : (
          <p className="text-gray-300">No Location Selected</p>
        )}
        <button
          onClick={onClearLocation}
          className="text-gray-300 hover:text-white bg-transparent border-none text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {location ? (
        <>
          {/* General Information */}
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Region:</span>{" "}
              {location.region}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Country:</span>{" "}
              {location.country}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Coordinates:</span>{" "}
              {location.latitude}, {location.longitude}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Category:</span>{" "}
              {location.category}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Language:</span>{" "}
              {location.language}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Currency:</span>{" "}
              {location.currency}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Religion:</span>{" "}
              {location.religion}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Safety:</span>{" "}
              {location.safety}
            </p>
          </div>

          {/* Tourism Information */}
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold text-gray-300">
                Annual Tourists:
              </span>{" "}
              {location.annualTourists}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">
                Best Time to Visit:
              </span>{" "}
              {location.bestTimeToVisit}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">
                Cost of Living:
              </span>{" "}
              {location.costOfLiving}
            </p>
          </div>

          {/* Cultural Information */}
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold text-gray-300">
                Cultural Significance:
              </span>{" "}
              {location.culturalSignificance}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Description:</span>{" "}
              {location.description}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-300">Famous Foods:</span>{" "}
              {location.famousFoods.join(", ")}
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDuckDuckGoSearch}
              className="bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-700"
            >
              Search "{location.name}" on DuckDuckGo
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-300">
          Select a location to view details.
        </p>
      )}
    </div>
  );
};

export default LocationDetails;

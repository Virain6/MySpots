import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ExpandableBox from "./mapComponents/expandableBox";
import LocationDetails from "./mapComponents/locationDetails";
import CreateListForm from "./mapComponents/createList";
import EditListModal from "./mapComponents/editListModal";
import ListPopup from "./mapComponents/listPopup";
import { updateListDetails } from "./utils/api";
import { useAuth } from "../context/AuthContext";

const LeafletMap = () => {
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const { token } = useAuth(); // Access the token from AuthContext

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
    setSelectedLocation(location);
  };

  const clearSelectedLocation = () => {
    setSelectedLocation(null);
  };

  const toggleCreateList = () => {
    setIsCreateListOpen((prev) => !prev);
  };

  const handleEditList = (list) => {
    setEditingList(list); // Open the modal with the selected list
  };

  const handleCloseModal = () => {
    setEditingList(null); // Close the modal
  };

  const handleOpenPopup = (list) => {
    console.log("Popup data:", list);
    setPopupData(list);
  };

  const handleClosePopup = () => {
    setPopupData(null); // Close the modal
  };

  const handleSaveList = async (updatedList) => {
    try {
      const response = await updateListDetails(token, updatedList);
      console.log("Update successful:", response);
      setEditingList(null); // Close modal on success
    } catch (error) {
      console.error("Error saving list:", error);
      alert("Failed to save the list. Please try again.");
    }
  };

  return (
    <div className="relative w-screen" style={{ height: "calc(100vh - 4rem)" }}>
      <div id="map" className="absolute top-0 left-0 h-full w-full z-0"></div>

      {selectedLocation && (
        <LocationDetails
          location={selectedLocation}
          onClearLocation={clearSelectedLocation}
        />
      )}

      {isCreateListOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <button
              onClick={toggleCreateList}
              className="absolute top-2 right-2 text-gray-500"
            >
              &times;
            </button>
            <CreateListForm closeList={toggleCreateList} />
          </div>
        </div>
      )}

      {editingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <EditListModal
            list={editingList}
            onClose={handleCloseModal}
            onSave={handleSaveList}
          />
        </div>
      )}

      {popupData && (
        <ListPopup
          list={popupData}
          closePopup={handleClosePopup} // Close popup
        />
      )}

      <ExpandableBox
        onLocationSelect={handleLocationSelect}
        onOpenCreateList={toggleCreateList}
        onEditList={handleEditList}
        handleOpenPopup={handleOpenPopup}
      />
    </div>
  );
};

export default LeafletMap;

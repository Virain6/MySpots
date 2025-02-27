import React, { useState, useEffect } from "react";
import {
  fetchUserLists,
  fetchPublicLists,
  fetchDestinations,
  fetchUserProfile,
  deleteList,
} from "../utils/api";
import { useAuth } from "../../context/AuthContext";

const ListsTab = ({ onEditList, onOpenCreateList, handleOpenPopup }) => {
  const [userLists, setUserLists] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [nickname, setNickname] = useState("User");
  const [activeListTab, setActiveListTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, loading: authLoading } = useAuth();

  // Fetch user profile to retrieve nickname
  const loadUserProfile = async () => {
    if (!token) return;

    try {
      const userProfile = await fetchUserProfile(token);
      setNickname(userProfile.nickname || "User");
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  // Fetch user and public lists
  const loadLists = async () => {
    if (!token) {
      setError("User is not logged in. Token is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [userSpecificLists, publicSpecificLists] = await Promise.all([
        fetchUserLists(token),
        fetchPublicLists(),
      ]);

      const resolveDestinationNames = async (lists) => {
        return Promise.all(
          lists.map(async (list) => {
            if (
              Array.isArray(list.destinationIds) &&
              list.destinationIds.length > 0
            ) {
              const destinations = await fetchDestinations(list.destinationIds);
              return { ...list, destinations };
            }
            return { ...list, destinations: [] };
          })
        );
      };

      const [resolvedUserLists, resolvedPublicLists] = await Promise.all([
        resolveDestinationNames(userSpecificLists),
        resolveDestinationNames(publicSpecificLists),
      ]);

      setUserLists(resolvedUserLists);
      setPublicLists(resolvedPublicLists);
    } catch (err) {
      console.error("Error loading lists:", err);
      setError("Failed to load lists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!token) {
      setError("User is not logged in. Token is missing.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this list?")) return;

    setLoading(true);

    try {
      await deleteList(token, listId);
      setUserLists((prevLists) =>
        prevLists.filter((list) => list.id !== listId)
      );
      setError("");
    } catch (err) {
      console.error("Error deleting list:", err);
      setError("Failed to delete the list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOnMap = (list) => {
    console.log("View on Map clicked. List data:", list); // Debugging log
    handleOpenPopup(list); // Trigger popup with selected list data
  };

  useEffect(() => {
    if (!authLoading) {
      loadUserProfile();
      loadLists();
    }
  }, [authLoading, token]);

  const renderTabContent = () => {
    const lists = activeListTab === "user" ? userLists : publicLists;

    if (loading) {
      return <p className="text-gray-400">Loading lists...</p>;
    }

    if (error) {
      return <p className="text-red-400">{error}</p>;
    }

    if (lists.length === 0) {
      return (
        <p className="text-gray-400">
          {activeListTab === "user"
            ? "You don't have any lists yet."
            : "No public lists available."}
        </p>
      );
    }

    return (
      <div className="mt-4 mb-16">
        {lists.map((list) => (
          <div
            key={list.id}
            className="mb-4 rounded-md bg-purple-500 hover:bg-purple-600 py-2 px-4 cursor-pointer"
          >
            <h4 className="text-md font-semibold text-white">
              {list.name} ({list.isPublic ? "Public" : "Private"})
            </h4>
            <p className="text-sm text-gray-100">
              Created by: {list.nickname || "Unknown"}
            </p>
            <p className="text-sm text-gray-100">
              Average Rating: {list.averageRating?.toFixed(2) || "N/A"}
            </p>
            <p className="text-sm text-gray-100">{list.description}</p>
            {list.destinations.length > 0 ? (
              <ul className="text-sm text-gray-200 ml-4">
                {list.destinations.map((destination) => (
                  <li key={destination.id}>{destination.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No destinations added yet.</p>
            )}
            {activeListTab === "user" && (
              <>
                <button
                  onClick={() => onEditList(list)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                >
                  Edit List
                </button>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="px-4 py-2 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                >
                  Delete List
                </button>
              </>
            )}
            <button
              onClick={() => handleViewOnMap(list)}
              className="px-4 py-2 ml-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
            >
              Reviews
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-violet-500 mb-4">
        Welcome, {nickname}!
      </h3>

      {/* Tabs for switching between My Lists and Public Lists */}
      <div className="flex justify-around mb-4">
        <button
          className={`w-1/2 py-2 rounded-l ${
            activeListTab === "user"
              ? "bg-violet-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveListTab("user")}
        >
          My Lists
        </button>
        <button
          className={`w-1/2 py-2 rounded-r ${
            activeListTab === "public"
              ? "bg-violet-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveListTab("public")}
        >
          Public Lists
        </button>
      </div>

      {activeListTab === "user" && (
        <button
          onClick={onOpenCreateList}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Create New List
        </button>
      )}

      {authLoading ? (
        <p className="text-gray-400">Checking authentication...</p>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default ListsTab;

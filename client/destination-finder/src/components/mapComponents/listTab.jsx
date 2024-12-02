import React, { useState, useEffect } from "react";
import {
  fetchUserLists,
  fetchPublicLists,
  fetchDestinations,
} from "../utils/api";
import { useAuth } from "../../context/AuthContext";

const ListsTab = ({ onEditList, onOpenCreateList }) => {
  const [userLists, setUserLists] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [activeListTab, setActiveListTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, loading: authLoading } = useAuth();

  // Fetch lists and resolve destination names
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

  useEffect(() => {
    if (!authLoading) {
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
            onClick={() => activeListTab === "user" && onEditList(list)} // Trigger edit modal
          >
            <h4 className="text-md font-semibold text-white">
              {list.name} ({list.isPublic ? "Public" : "Private"})
            </h4>
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
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
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

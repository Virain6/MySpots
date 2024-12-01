import React, { useState, useEffect } from "react";
import { fetchUserLists, fetchPublicLists } from "../utils/api"; // Adjust paths as needed
import { useAuth } from "../../context/AuthContext"; // Import useAuth from AuthContext

const ListsTab = () => {
  const [userLists, setUserLists] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [activeListTab, setActiveListTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, user, loading: authLoading } = useAuth(); // Use auth state

  // Fetch lists for both user and public
  const loadLists = async () => {
    if (!token) {
      setError("User is not logged in. Token is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch user-specific and public lists in parallel
      const [userSpecificLists, publicSpecificLists] = await Promise.all([
        fetchUserLists(token),
        fetchPublicLists(),
      ]);

      setUserLists(userSpecificLists);
      setPublicLists(publicSpecificLists);
    } catch (err) {
      console.error("Error loading lists:", err);
      setError("Failed to load lists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to load lists when component mounts or when token changes
  useEffect(() => {
    if (!authLoading) {
      loadLists();
    }
  }, [authLoading, token]);

  // Render the appropriate tab content
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
      <div>
        {lists.map((list) => (
          <div key={list.id} className="mb-4">
            <h4 className="text-md font-semibold text-white">{list.name}</h4>
            <p className="text-sm text-gray-400">{list.description}</p>
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
          className={`w-1/2 py-2 ${
            activeListTab === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveListTab("user")}
        >
          My Lists
        </button>
        <button
          className={`w-1/2 py-2 ${
            activeListTab === "public"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setActiveListTab("public")}
        >
          Public Lists
        </button>
      </div>

      {/* Render content for the active tab */}
      {authLoading ? (
        <p className="text-gray-400">Checking authentication...</p>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default ListsTab;

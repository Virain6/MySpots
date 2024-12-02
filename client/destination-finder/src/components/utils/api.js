// api.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../assets/firebase/firebase";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403 && errorData.verificationLink) {
        // If the email is unverified, return the verification link
        throw new Error(errorData.verificationLink);
      } else {
        throw new Error(errorData.error || "Failed to log in");
      }
    }

    const data = await response.json();
    const idToken = await userCredential.user.getIdToken();
    return { idToken, user: { email }, data };
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

//delete list
export const deleteList = async (token, listId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/lists/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete the list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};

export const fetchLocations = async (filters = {}, limit = 5) => {
  try {
    const queryParams = new URLSearchParams({
      name: filters.name ? filters.name.toLowerCase() : "",
      region: filters.region ? filters.region.toLowerCase() : "",
      country: filters.country ? filters.country.toLowerCase() : "",
      limit: limit.toString(),
    });

    const response = await fetch(
      `http://localhost:3001/api/locations?${queryParams}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

export const fetchUserProfile = async (token) => {
  try {
    const response = await fetch("http://localhost:3001/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

// Fetch reviews for a list
export const fetchReviews = async (listId, token) => {
  if (!token) throw new Error("Authentication token is missing.");
  const response = await fetch(
    `http://localhost:3001/api/lists/${listId}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the Bearer token
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch reviews.");
  }

  return response.json();
};
// Add a new review
export const addReview = async (listID, review, token) => {
  const response = await fetch("http://localhost:3001/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...review, listID }),
  });
  if (!response.ok) throw new Error("Failed to add review.");
  return response.json();
};

export const updatePassword = async (
  token,
  { currentPassword, newPassword }
) => {
  const response = await fetch(
    "http://localhost:3001/api/users/update-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update password");
  }
};

export const fetchUserLists = async (token) => {
  console.log("Token being sent:", token); // Debugging log
  try {
    const response = await fetch("http://localhost:3001/api/lists", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user-specific lists");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user-specific lists:", error);
    return [];
  }
};

export const fetchPublicLists = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/lists/public");
    if (!response.ok) {
      throw new Error("Failed to fetch public lists");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching public lists:", error);
    return [];
  }
};

export const createList = async (token, listData) => {
  try {
    const response = await fetch("http://localhost:3001/api/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listData),
    });

    if (!response.ok) {
      throw new Error("Failed to create list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating list:", error.message);
    throw error;
  }
};

export const addDestinationToList = async (token, listId, destinationId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/lists/${listId}/destinations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinationId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add destination to list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding destination:", error.message);
    throw error;
  }
};

export const fetchDestinations = async (destinationIds) => {
  try {
    const response = await fetch("http://localhost:3001/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: destinationIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch destinations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
};

export const updateListDetails = async (token, updatedList) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/lists/${updatedList.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedList.name,
          description: updatedList.description,
          isPublic: updatedList.isPublic,
          destinationIds: updatedList.destinations.map((d) => d.id),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update list: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

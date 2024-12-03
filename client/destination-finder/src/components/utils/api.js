import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../assets/firebase/firebase";

// Base URL for the API
const API_BASE_URL = "http://localhost:3001/api";

// Endpoints
const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  LISTS: `${API_BASE_URL}/lists`,
  PUBLIC_LISTS: `${API_BASE_URL}/lists/public`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PASSWORD: `${API_BASE_URL}/users/update-password`,
  REVIEWS: `${API_BASE_URL}/reviews`,
  DESTINATIONS: `${API_BASE_URL}/locations`,
  LOCATIONS: `${API_BASE_URL}/destinations`,
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN: `${API_BASE_URL}/admin`, // Base admin endpoint
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Check if the user is disabled
      if (
        response.status === 403 &&
        errorData.error === "Your account is disabled. Please contact support."
      ) {
        throw new Error("Your account is disabled. Please contact support.");
      }

      // Handle unverified email with a verification link
      if (response.status === 403 && errorData.verificationLink) {
        throw new Error(errorData.verificationLink);
      }

      throw new Error(errorData.error || "Failed to log in");
    }

    const data = await response.json();
    const idToken = await userCredential.user.getIdToken();
    return { idToken, user: { email }, data };
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// Fetch users (Admin Dashboard)
export const fetchAdminUsers = async (token) => {
  try {
    const response = await fetch(ENDPOINTS.ADMIN_USERS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

// Update user role (Admin Dashboard)
export const updateAdminUserRole = async (token, userId, newRole) => {
  try {
    const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user role");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user role:", error.message);
    throw error;
  }
};

// Delete a user (Admin Dashboard)
export const deleteAdminUser = async (token, userId) => {
  try {
    const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};

// Enable or disable a user account
export const toggleUserDisabled = async (token, userId, disabled) => {
  try {
    const response = await fetch(`${ENDPOINTS.ADMIN}/users/${userId}/disable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ disabled }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user disabled state.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user disabled state:", error.message);
    throw error;
  }
};

// Delete list
export const deleteList = async (token, listId) => {
  try {
    const response = await fetch(`${ENDPOINTS.LISTS}/${listId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
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

// Fetch locations
export const fetchLocations = async (filters = {}, limit = 5) => {
  try {
    const queryParams = new URLSearchParams({
      name: filters.name ? filters.name.toLowerCase() : "",
      region: filters.region ? filters.region.toLowerCase() : "",
      country: filters.country ? filters.country.toLowerCase() : "",
      limit: limit.toString(),
    });

    const response = await fetch(`${ENDPOINTS.DESTINATIONS}?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// Fetch user profile
export const fetchUserProfile = async (token) => {
  try {
    const response = await fetch(ENDPOINTS.USER_PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
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
  try {
    const response = await fetch(`${ENDPOINTS.REVIEWS}/${listId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch reviews.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw error;
  }
};

// Add a new review
export const addReview = async (listID, review, token) => {
  try {
    const response = await fetch(ENDPOINTS.REVIEWS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ listID, ...review }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add review.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding review:", error.message);
    throw error;
  }
};

// Update password
export const updatePassword = async (
  token,
  { currentPassword, newPassword }
) => {
  const response = await fetch(ENDPOINTS.UPDATE_PASSWORD, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    throw new Error("Failed to update password");
  }
};

// Fetch user-specific lists
export const fetchUserLists = async (token) => {
  try {
    const response = await fetch(ENDPOINTS.LISTS, {
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

// Fetch public lists
export const fetchPublicLists = async () => {
  try {
    const response = await fetch(ENDPOINTS.PUBLIC_LISTS);
    if (!response.ok) {
      throw new Error("Failed to fetch public lists");
    }
    return await response.json(); // Backend already limits and sorts
  } catch (error) {
    console.error("Error fetching public lists:", error);
    return [];
  }
};

// Create a new list
export const createList = async (token, listData) => {
  try {
    const response = await fetch(ENDPOINTS.LISTS, {
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

// Add destination to a list
export const addDestinationToList = async (token, listId, destinationId) => {
  try {
    const response = await fetch(`${ENDPOINTS.LISTS}/${listId}/destinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ destinationId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add destination to list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding destination:", error.message);
    throw error;
  }
};

// Fetch destinations
export const fetchDestinations = async (destinationIds) => {
  try {
    const response = await fetch(ENDPOINTS.LOCATIONS, {
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

// Update list details
export const updateListDetails = async (token, updatedList) => {
  try {
    const response = await fetch(`${ENDPOINTS.LISTS}/${updatedList.id}`, {
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
    });

    if (!response.ok) {
      throw new Error(`Failed to update list: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

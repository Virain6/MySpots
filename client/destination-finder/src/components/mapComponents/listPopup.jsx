import React, { useState, useEffect } from "react";
import { fetchReviews, addReview, toggleReviewHidden } from "../utils/api"; // Added toggleReviewHidden API
import { useAuth } from "../../context/AuthContext";

const ListPopup = ({ list, closePopup }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user, token } = useAuth();

  const allowedRoles = ["admin", "manager"];
  const userRole = user?.role;

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await fetchReviews(list.id, token);
        setReviews(reviewsData);
      } catch (err) {
        setError("Failed to fetch reviews.");
      }
    };
    loadReviews();
  }, [list.id, token]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.comment || !newReview.rating) {
      setError("Comment and rating are required.");
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmSubmitReview = async () => {
    setShowConfirmDialog(false); // Hide the confirmation dialog

    try {
      // Call API to add review
      const addedReview = await addReview(list.id, newReview, token);

      // Append the added review to the list
      setReviews([...reviews, { ...addedReview, userID: user.uid }]);
      setNewReview({ comment: "", rating: 0 });
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error adding review:", err.message);
      setError("Failed to add review. Please try again.");
    }
  };

  const handleToggleHidden = async (reviewId, currentHiddenState) => {
    try {
      const updatedReview = await toggleReviewHidden(
        token,
        reviewId,
        !currentHiddenState
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, hidden: updatedReview.hidden }
            : review
        )
      );
    } catch (err) {
      console.error("Error toggling hidden flag:", err.message);
      setError("Failed to toggle review visibility. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h3 className="text-lg font-bold">{list.name}</h3>
        <p className="text-sm text-gray-600">{list.description}</p>

        <h4 className="mt-4 text-md font-semibold">Reviews</h4>
        {reviews.length > 0 ? (
          <ul className="mt-2">
            {reviews
              .filter(
                (review) => !review.hidden || allowedRoles.includes(userRole)
              )
              .map((review, index) => (
                <li key={index} className="border-b py-2">
                  <strong>Nickname:</strong> {review.nickname}
                  <br />
                  <strong>Rating:</strong> {review.rating}/5
                  <br />
                  <strong>Comment:</strong> {review.comment}
                  {allowedRoles.includes(userRole) && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          handleToggleHidden(review.id, review.hidden)
                        }
                        className={`px-4 py-2 ${
                          review.hidden ? "bg-red-500" : "bg-green-500"
                        } text-white rounded`}
                      >
                        {review.hidden ? "Unhide" : "Hide"}
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}

        {user && userRole === "user" && (
          <form onSubmit={handleReviewSubmit} className="mt-4">
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Write a comment..."
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
              placeholder="Rating (1-5)"
              className="w-full p-2 mt-2 border rounded"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit Review
            </button>
          </form>
        )}

        <button
          onClick={closePopup}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h4 className="text-lg font-semibold mb-4">
              Confirm Submit Review
            </h4>
            <p className="text-sm mb-4">
              Are you sure you want to submit this review?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmitReview}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPopup;

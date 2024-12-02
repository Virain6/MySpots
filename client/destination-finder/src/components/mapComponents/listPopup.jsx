import React, { useState, useEffect } from "react";
import { fetchReviews, addReview } from "../utils/api";
import { useAuth } from "../../context/AuthContext";

const ListPopup = ({ list, closePopup }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [error, setError] = useState("");
  const { user, token } = useAuth();

  const allowedRoles = ["user", "admin", "manager"];

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

    try {
      await addReview(list.id, newReview, token);
      setReviews([...reviews, { ...newReview, userID: user.uid }]);
      setNewReview({ comment: "", rating: 0 });
    } catch (err) {
      setError("Failed to add review.");
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
            {reviews.map((review, index) => (
              <li key={index} className="border-b py-2">
                <strong>Rating:</strong> {review.rating}/5
                <br />
                <strong>Comment:</strong> {review.comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}

        {user && allowedRoles.includes(user.role) ? (
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
        ) : (
          <p className="text-red-500 mt-4">
            You are not authorized to add reviews.
          </p>
        )}

        <button
          onClick={closePopup}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ListPopup;

const express = require("express");
const { admin } = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const db = admin.firestore(); // Firestore Database

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify token
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Middleware to verify admin or manager role
const verifyAdminOrManager = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();

    if (
      !userData ||
      (userData.role !== "admin" && userData.role !== "manager")
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.role = userData.role; // Attach role to request
    next();
  } catch (err) {
    console.error("Error verifying admin or manager role:", err.message);
    return res.status(500).json({ error: "Failed to verify role" });
  }
};

// Middleware to verify admin-only role
const verifyAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    console.error("Error verifying admin role:", err.message);
    return res.status(500).json({ error: "Failed to verify admin role" });
  }
};

// Endpoint: Get list of all users (admin or manager access)
router.get("/users", verifyToken, verifyAdminOrManager, async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs
      .map((doc) => {
        const userData = doc.data();
        return {
          id: doc.id,
          nickname: userData.nickname || "No Nickname",
          email: userData.email || "No Email",
          role: userData.role || "user",
        };
      })
      .filter((user) => user.role !== "admin");

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Endpoint: Delete a user (admin-only access)
router.delete(
  "/users/:id",
  verifyToken,
  verifyAdminOrManager,
  async (req, res) => {
    const userId = req.params.id;

    try {
      // Delete user from Firebase Authentication
      await admin.auth().deleteUser(userId);

      // Delete user from Firestore
      await db.collection("users").doc(userId).delete();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err.message);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

// Endpoint: Update user role (admin-only access)
router.put("/users/:id/role", verifyToken, verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!["manager", "user"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Invalid role. Allowed roles are 'manager' and 'user'." });
  }

  try {
    const userRef = db.collection("users").doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// Endpoint: Enable or disable a user account (admin or manager access)
router.put(
  "/users/:id/disable",
  verifyToken,
  verifyAdminOrManager,
  async (req, res) => {
    const userId = req.params.id;
    const { disabled } = req.body;

    if (typeof disabled !== "boolean") {
      return res
        .status(400)
        .json({ error: "Invalid 'disabled' value. Must be a boolean." });
    }

    try {
      const userRef = db.collection("users").doc(userId);

      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the 'disabled' field in Firestore
      await userRef.update({
        disabled,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res
        .status(200)
        .json({
          message: `User ${disabled ? "disabled" : "enabled"} successfully.`,
        });
    } catch (err) {
      console.error("Error updating user disabled state:", err.message);
      res.status(500).json({ error: "Failed to update user disabled state" });
    }
  }
);

module.exports = router;

const express = require("express");
const cors = require("cors");

// routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const locationsRoute = require("./routes/locations");
const listsRoute = require("./routes/lists");
const usersRoute = require("./routes/users"); // Add users route
const reviewRoute = require("./routes/review");
const adminRoute = require("./routes/admin"); // Admin route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", locationsRoute);
app.use("/api", listsRoute);
app.use("/api", usersRoute); // Register users route
app.use("/api", reviewRoute); // Register routes route
app.use("/api/admin", adminRoute); // Prefix admin routes with /api/admin

// Start the Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", registerRoute);

app.use("/api", loginRoute);

// Start the Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

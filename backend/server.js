const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ConnectDB = require('./config/db');
const StockRoutes = require('./routes/StockRoute');

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Connect to Database
ConnectDB();

// Routes
app.use("/api", StockRoutes);

// Define Port
const port = process.env.PORT || 8765;

// Start Server
app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
});

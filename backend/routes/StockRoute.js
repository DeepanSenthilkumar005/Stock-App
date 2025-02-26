const express = require("express");
const { getItem, postItem } = require("../controllers/StockControll");

const router = express.Router();

// Define Routes
router.get("/", getItem);
router.post("/", postItem);

module.exports = router; // Correctly export the router

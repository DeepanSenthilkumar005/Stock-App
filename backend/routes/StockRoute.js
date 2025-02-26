const express = require("express");
const { getItem, postItem, updateItem, deleteItem, putItem } = require("../controllers/StockControll");

const router = express.Router();

// Define Routes
router.get("/", getItem);
router.post("/", postItem);
// router.put("/", updateItem);
router.delete("/:id", deleteItem);
router.put("/:id", putItem);

module.exports = router; // Correctly export the router

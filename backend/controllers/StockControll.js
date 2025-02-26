const List = require("../models/stock"); // Import the Stock model

// Get all stock items
const getItem = async (req, res) => {
  try {
    const data = await List.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new stock item
const postItem = async (req, res) => {
  try {
    const newItem = new List(req.body);
    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getItem, postItem };

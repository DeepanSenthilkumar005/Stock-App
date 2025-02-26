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

// Update stock item quantity
const updateItem = async (req, res) => {
  try {
    const { category, types, quantity } = req.body;

    const updatedItem = await List.findOneAndUpdate(
      { category, types },
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Quantity updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a stock item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params; // Get id from URL params

    const deletedItem = await List.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully", item: deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Put Method
// Update stock item using PUT method
const putItem = async (req, res) => {
  try {
    const { id } = req.params; // Get id from URL params
    const { category, types, quantity } = req.body;

    const updatedItem = await List.findByIdAndUpdate(
      id,
      { category, types, quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = { getItem, postItem, updateItem, deleteItem, putItem };

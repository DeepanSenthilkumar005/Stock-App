import { useState, useEffect, useRef } from "react";

function DashBoard() {
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addPage, setAddPage] = useState(false);
  const addItemRef = useRef(null);

  const backendUrl = "http://localhost:8000/api/";

  useEffect(() => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [refresh]);

  function handleSearch(e) {
    setSearchText(e.target.value);
  }

  async function addNewItem() {
    if (!selectedCategory || !newType || !newQuantity) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          types: newType,
          quantity: parseInt(newQuantity),
        }),
      });

      setRefresh((prev) => !prev);
      setNewType("");
      setNewQuantity("");
      setSelectedCategory("");
      setAddPage(false);
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  }

  return (
    <section className="DashBoard_Page bg-[#0d1c47] min-h-screen w-full p-4 text-white">
      <div className="header w-full flex items-center mx-auto">
        <input
          type="text"
          onChange={handleSearch}
          value={searchText}
          name="search"
          className="mx-auto rounded-md text-black p-2 shadow-md w-full border border-slate-400"
          placeholder="Search..."
          autoComplete="off"
        />
      </div>

      <button
        type="button"
        className="bg-green-500 text-white p-2 rounded-md my-3 cursor-pointer w-full"
        onClick={() => setRefresh((prev) => !prev)}
      >
        Refresh Data
      </button>

      <ul className="text-white w-full flex flex-col mx-auto mt-4">
        {data.length > 0 ? (
          data.reduce((acc, item) => {
            let categoryIndex = acc.findIndex((c) => c.category === item.category);

            if (categoryIndex === -1) {
              acc.push({ category: item.category, types: [{ type: item.types, quantity: item.quantity }] });
            } else {
              acc[categoryIndex].types.push({ type: item.types, quantity: item.quantity });
            }

            return acc;
          }, []).map((categoryData, index) => (
            <li key={index} className="bg-blue-700 p-4 rounded-md my-4 shadow-lg">
              <h3 className="font-bold text-lg pb-2 border-b border-white mb-2">{categoryData.category}</h3>
              <div className="flex flex-col gap-2 text-sm">
                {categoryData.types.map((typeData, subIndex) => (
                  <div key={subIndex} className="grid grid-cols-2 border-b border-gray-300 pb-1">
                    <p className="font-semibold">{typeData.type}</p>
                    <p>{typeData.quantity}</p>
                  </div>
                ))}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-300">Loading data...</p>
        )}
      </ul>

      <button
        onClick={() => setAddPage(true)}
        className="bg-blue-500 text-white p-3 mt-4 w-full rounded-md cursor-pointer"
      >
        Add Item
      </button>

      {addPage && (
        <div ref={addItemRef} className="fixed bottom-0 left-0 right-0 bg-gray-900 p-6 w-full h-[90vh] rounded-t-xl shadow-2xl">
          <button
            onClick={() => setAddPage(false)}
            className="absolute top-2 right-4 text-white text-lg"
          >
            ✖
          </button>
          <h2 className="text-white text-lg mb-4 text-center">Add New Item</h2>

          <select
            className="w-full p-3 rounded-md bg-gray-700 text-white"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">Select Category</option>
            {Array.from(new Set(data.map((item) => item.category))).map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
            <option value="new">Add New Category</option>
          </select>

          {selectedCategory === "new" && (
            <input
              type="text"
              placeholder="Enter New Category"
              className="w-full mt-3 p-3 rounded-md bg-gray-700 text-white"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          )}

          <input
            type="text"
            placeholder="Enter Type"
            className="w-full mt-3 p-3 rounded-md bg-gray-700 text-white"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter Quantity"
            className="w-full mt-3 p-3 rounded-md bg-gray-700 text-white"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />

          <button
            onClick={addNewItem}
            className="bg-blue-500 text-white p-3 mt-4 w-full rounded-md cursor-pointer"
          >
            Add Item
          </button>
        </div>
      )}
    </section>
  );
}

export default DashBoard;
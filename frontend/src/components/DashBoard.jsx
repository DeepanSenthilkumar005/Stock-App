import { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { SlClose } from "react-icons/sl";
import { CgSandClock } from "react-icons/cg";
function DashBoard() {
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editedValues, setEditedValues] = useState({ type: "", quantity: "" });
  const [addPage, setAddPage] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategorySelected, setNewCategorySelected] = useState("");
  const [dropDownCategory, setDropDownCategory] = useState([]);
  const [newType, setNewType] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [checkSubmit,setCheckSubmit]= useState(false)
  // const backendUrl = "http://localhost:8000/api/";
  const backendUrl = "https://stock-app-f3z4.onrender.com/api/";

  useEffect(() => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [refresh]);

  function handleSearch(e) {
    setSearchText(e.target.value.toLowerCase());
  }

  async function addNewItem() {
    if (!newCategory || !newType || !newQuantity || (newCategory==="new" && !newCategorySelected)) {
      alert("Please fill in all fields!");
      return;
    }


    try {
      // if(newCategory==="new")
      // {
      //   setNewCategory(newCategorySelected);
      //   // console.log(newCategorySelected);
      //   console.log(newCategory);
        
      //   setNewCategorySelected("");
      // }
      setCheckSubmit(true);
      await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: (newCategory==="new"?newCategorySelected:newCategory),
          types: newType,
          quantity: parseInt(newQuantity),
        }),
      });
      
      setRefresh((prev) => !prev);
      setNewCategory("");
      setNewCategorySelected("");
      setNewType("");
      setNewQuantity("");
      setAddPage(false);
    } catch (error) {
      console.error("Error adding new item:", error);
    }
    finally
    {
      setCheckSubmit(false);

    }
  }

  async function deleteItem(id, name, category) {
    if(window.confirm(`Click ok to Delete "${name}" from "${category}"`))
    {

        try {
          await fetch(`${backendUrl}${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          
          setRefresh((prev) => !prev);
        } catch (error) {
          console.error("Error deleting item:", error);
        }
    }
  }

  function toggleEdit(id, category, type, quantity) {
    setEditing({ id, category, type });
    setEditedValues({ type, quantity });
  }
  

  async function saveChanges() {
    if (!editing || !editing.id) return; // Ensure there is a valid id
  
    try {
      await fetch(`${backendUrl}${editing.id}/`, { // Include ID in the URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: editing.category,
          types: editedValues.type,
          quantity: parseInt(editedValues.quantity),
        }),
      });
  
      setRefresh((prev) => !prev);
      setEditing(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }
  

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});




  useEffect(() => {
    const uniqueCategories = Array.from(new Set(data.map(item => item.category)))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  
    setDropDownCategory(uniqueCategories);
  }, [data]);
  
  
  function handleCategory(category) {
    setNewCategory(category);
    setAddPage(true); // Ensure the add page opens when a category is selected
  }
  

  return (
    <section className="DashBoard_Page bg-gray-900 min-h-screen flex justify-center mx-auto w-full p-4 text-white">
      <div className="w-lg">
        <div className="sticky top-0 bg-gray-900 -m-1 p-2">
        <div className="header w-full flex items-center mx-auto">
          <input
            type="text"
            onChange={handleSearch}
            value={searchText}
            className="mx-auto rounded-md text-gray-400 p-2 shadow-md w-full border border-gray-400"
            placeholder="Search..."
            autoComplete="off"
          />
        </div>

        <button
          className="bg-blue-500 text-white p-2 rounded-md my-3 cursor-pointer w-full hover:bg-blue-600"
          onClick={() => setAddPage(()=>!addPage)}
        >
          { !addPage ? "Add New Item" : (<p>Close The Add Page</p>)}
        </button>

        {addPage && (
          <div className="p-4 bg-gray-800 rounded-md">
            <select
              onChange={(e) => setNewCategory(e.target.value)}
              value={newCategory}
              className="p-2 rounded-md bg-gray-600 text-white w-full mb-2"
            >
              <option value="">Select Category</option>
              {dropDownCategory.map((d, index) => (
                <option value={d} key={index}>
                  {d}
                </option>
              ))}
              <option className="" value="new">New Category</option>
            </select>

            {/* Show input field only if "New" is selected */}
            {newCategory === "new" && (
              <input
                type="text"
                placeholder="Enter new category"
                value={newCategorySelected} // Reset input field
                onChange={(e) => setNewCategorySelected(e.target.value)}
                className="p-2 rounded-md bg-gray-600 text-white w-full mb-2"
              />
            )}

            <input
              type="text"
              placeholder="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="p-2 rounded-md bg-gray-600 text-white w-full mb-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="p-2 rounded-md bg-gray-600 text-white w-full mb-2"
            />
            <button onClick={addNewItem} className="bg-green-500 p-2 rounded-md w-full">
              {!checkSubmit ? ("Add Item")
              :
              (<div className="flex justify-center gap-2">
                  <i className="animate-spin">⌛</i>
                  {/* <i className="animate-spin"><CgSandClock /></i> */}
                  <p >Submiting..</p>
                </div>)
              }
            </button>
          </div>
        )}
      </div>

      <ul className="text-white w-full flex flex-col mx-auto mt-4">
        {Object.entries(groupedData).map(([category, items]) => (
          <li key={category} className="bg-gray-800 p-4 rounded-lg my-4 shadow shadow-gray-200 border border-gray-700">
            <div className="CategoryHeader flex justify-between items-center bg-gray-700 p-3 rounded-md shadow-md">
              <h3 className="font-bold text-lg text-yellow-400 uppercase">
                {category}
              </h3>
              <button
                type="button"
                onClick={() => handleCategory(category)}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all"
              >
                + Add
              </button>
            </div>
          

            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded-md shadow-md my-2">
                {editing && editing.category === item.category && editing.type === item.types ? (
                  <>
                    <input
                      type="text"
                      value={editedValues.type}
                      onChange={(e) => setEditedValues({ ...editedValues, type: e.target.value })}
                      className="w-24 p-1 rounded-md bg-gray-600 text-white"
                    />
                    <input
                      type="number"
                      value={editedValues.quantity}
                      onChange={(e) => setEditedValues({ ...editedValues, quantity: e.target.value })}
                      className="w-16 p-1 rounded-md bg-gray-600 text-white"
                    />
                    <button className="bg-green-500 p-2 rounded-full" onClick={saveChanges}>✔</button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-200 flex-1 text-center">{item.types}</p>
                    <p className="text-gray-200 flex-1 text-center">{item.quantity}</p>
                    <button className="bg-blue-500 p-3 rounded-full cursor-pointer" onClick={() => toggleEdit(item._id, item.category, item.types, item.quantity)}>
                      <FaEdit className="text-white" />
                    </button>
                  </>
                )}
                <button className="bg-red-500 ms-3 p-3 rounded-full cursor-pointer" onClick={() => deleteItem(item._id,item.types,category)}>
                  <FaTrash className="text-white" />
                </button>
              </div>
            ))}
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}

export default DashBoard;

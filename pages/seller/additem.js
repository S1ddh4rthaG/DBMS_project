import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddItem() {
  const session = useSession();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "",
    stock_quantity: 0,
    price: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/items/additem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 p-2 border rounded shadow-sm">
          <h4 className="text-center">Add Item</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Image URL:</label>
              <input
                type="text"
                className="form-control"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Product Type:</label>
              <input
                type="text"
                className="form-control"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock_quantity">Stock Quantity:</label>
              <input
                type="number"
                className="form-control"
                name="stock_quantity"
                value={formData.stock_quantity}
                min={0}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2 text-center">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

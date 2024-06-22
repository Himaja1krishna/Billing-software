import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [stock, setStock] = useState('');
  const [salesPrice, setSalesPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/products', {
        name,
        type,
        stock,
        sales_price: salesPrice,
      });
      alert('Product added successfully');
      setName('');
      setType('');
      setStock('');
      setSalesPrice('');
    } catch (error) {
      console.error('Error adding product', error);
      alert('Error adding product');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <input
            type="text"
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="salesPrice" className="form-label">Sales Price</label>
          <input
            type="number"
            className="form-control"
            id="salesPrice"
            value={salesPrice}
            onChange={(e) => setSalesPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;

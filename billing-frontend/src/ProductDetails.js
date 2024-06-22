import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetails = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1>Product Details</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for a product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="table">
  <thead className="table-light">
    <tr>
      <th>Product Name</th>
      <th>Type</th>
      <th>Stock</th>
      <th>Sales Price</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredProducts.map((product, index) => (
      <tr key={index}>
        <td>{product.name}</td>
        <td>{product.type}</td>
        <td>{product.stock}</td>
        <td>{product.sales_price}</td>
        <td>
          <button className="btn btn-warning btn-sm">Edit</button>
          <button className="btn btn-danger btn-sm ms-2">Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default ProductDetails;

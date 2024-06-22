import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Order = () => {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

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

  const handleAddToOrder = () => {
    const product = products.find(p => p.name === productName);
    if (!product) {
      alert('Product not found');
      return;
    }

    if (quantity > product.stock) {
      alert('Out of stock');
      return;
    }

    const orderItem = {
      ...product,
      quantity,
      totalCost: quantity * product.sales_price
    };

    setOrder([...order, orderItem]);
    setTotalCost(totalCost + orderItem.totalCost);
    setProductName('');
    setQuantity(1);
  };

  const handlePlaceOrder = async () => {
    try {
      for (const item of order) {
        await axios.post('http://localhost:5000/orders', {
          product_name: item.name,
          quantity: item.quantity,
          total_cost: item.totalCost
        });

        // Update product stock
        await axios.put(`http://localhost:5000/products/${item.id}`, {
          stock: item.stock - item.quantity
        });
      }
      alert('Order placed successfully');
      setOrder([]);
      setTotalCost(0);
      fetchProducts();
    } catch (error) {
      console.error('Error placing order', error);
      alert('Error placing order');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Order Products</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          min="1"
        />
      </div>
      <button onClick={handleAddToOrder} className="btn btn-success mb-3">
        Add to Order
      </button>
      <h2>Order Summary</h2>
      <table className="table">
  <thead className="table-light">
    <tr>
      <th>Product Name</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Total Cost</th>
    </tr>
  </thead>
  <tbody>
    {order.map((item, index) => (
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.quantity}</td>
        <td>{item.sales_price}</td>
        <td>{item.totalCost}</td>
      </tr>
    ))}
  </tbody>
</table>

      <h3>Total Cost: {totalCost.toFixed(2)}</h3>
      <button onClick={handlePlaceOrder} className="btn btn-primary">Place Order</button>
    </div>
  );
};

export default Order;

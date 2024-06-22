import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{ backgroundColor: 'blue', padding: '10px' }}>
      <Link to="/" style={{ color: 'white', marginRight: '10px' }}>Home</Link>
      <Link to="/add-product" style={{ color: 'white', marginRight: '10px' }}>Add Product</Link>
      <Link to="/product-details" style={{ color: 'white', marginRight: '10px' }}>Product Details</Link>
      <Link to="/order" style={{ color: 'white' }}>Order</Link>
    </nav>
  );
};

export default NavBar;

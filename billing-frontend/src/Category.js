import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleAddCategory = async () => {
    if (editId === null) {
      await axios.post('http://localhost:5000/categories', { name });
    } else {
      await axios.put(`http://localhost:5000/categories/${editId}`, { name });
      setEditId(null);
    }
    setName('');
    fetchCategories();
  };

  const handleEditCategory = (category) => {
    setName(category.name);
    setEditId(category.id);
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(`http://localhost:5000/categories/${id}`);
    fetchCategories();
  };

  return (
    <div>
      <h1>Category</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
      />
      <button onClick={handleAddCategory} style={{ backgroundColor: 'green', color: 'white' }}>
        {editId ? 'Update Category' : 'Create Category'}
      </button>
     
      <table class="table table-success table-striped-columns">
        <thead>
          <tr style={{ backgroundColor: 'blue', color: 'white' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <button onClick={() => handleEditCategory(category)} class="btn btn-info">Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteCategory(category.id)} class="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;

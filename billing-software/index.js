const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Billing',
  password: 'Himaja@123',
  port: 5432,
});

// Get all categories
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a new category
app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query('INSERT INTO category (name) VALUES($1) RETURNING *', [name]);
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a category
app.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await pool.query('UPDATE category SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    res.json(updatedCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a category
app.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM category WHERE id = $1', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const { name, type, stock, sales_price } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO products (name, type, stock, sales_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, stock, sales_price]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, stock, sales_price } = req.body;
    const updatedProduct = await pool.query(
      'UPDATE products SET name = $1, type = $2, stock = $3, sales_price = $4 WHERE id = $5 RETURNING *',
      [name, type, stock, sales_price, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/orders', async (req, res) => {
  const { product_name, quantity, total_cost } = req.body;
  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    const productResult = await client.query('SELECT * FROM products WHERE name = $1', [product_name]);
    if (productResult.rows.length === 0) {
      res.status(400).send('Product not found');
      await client.query('ROLLBACK');
      return;
    }
    const product = productResult.rows[0];
    if (product.stock < quantity) {
      res.status(400).send('Out of stock');
      await client.query('ROLLBACK');
      return;
    }
    await client.query(
      'INSERT INTO orders (product_id, quantity, total_cost) VALUES ($1, $2, $3)',
      [product.id, quantity, total_cost]
    );
    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [quantity, product.id]
    );
    await client.query('COMMIT');
    res.send('Order placed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

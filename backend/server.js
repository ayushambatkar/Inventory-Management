const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const items = [];

function getStatus(quantity) {
  if (quantity === 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  return 'In Stock';
}

function formatItem(item) {
  return {
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    status: getStatus(item.quantity)
  };
}

app.get('/api/items', (req, res) => {
  res.json(items.map(formatItem));
});

app.post('/api/items', (req, res) => {
  const { name, sku, quantity } = req.body;

  if (name == null || sku == null || quantity == null || name === '' || sku === '') {
    return res.status(400).json({ error: 'name, sku, and quantity are required' });
  }

  if (typeof quantity !== 'number' || Number.isNaN(quantity)) {
    return res.status(400).json({ error: 'quantity must be a number' });
  }

  if (quantity < 0) {
    return res.status(400).json({ error: 'quantity must be greater than or equal to 0' });
  }

  const newItem = {
    name: String(name).trim(),
    sku: String(sku).trim(),
    quantity
  };

  if (newItem.name === '' || newItem.sku === '') {
    return res.status(400).json({ error: 'name and sku cannot be empty' });
  }

  items.push(newItem);
  res.status(201).json(formatItem(newItem));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

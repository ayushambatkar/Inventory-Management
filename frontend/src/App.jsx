import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/items';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', quantity: 0 });

  async function fetchItems() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to add item');
      }

      setForm({ name: '', sku: '', quantity: 0 });
      await fetchItems();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <h1>Inventory Items Manager</h1>

      <form onSubmit={handleSubmit} className="card form">
        <h2>Add Item</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Item name"
          required
        />
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          required
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          min="0"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      {loading && <p>Loading items...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <section className="card">
          <h2>Items</h2>
          {items.length === 0 ? (
            <p>No items yet.</p>
          ) : (
            <ul className="item-list">
              {items.map((item) => (
                <li key={item.sku} className="item-row">
                  <span>{item.name}</span>
                  <span>{item.sku}</span>
                  <span>{item.quantity}</span>
                  <span>{item.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

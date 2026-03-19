import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function createCategory(body) {
    const cat = await api.createCategory(body);
    setCategories((prev) => [...prev, cat]);
    return cat;
  }

  async function updateCategory(id, body) {
    const cat = await api.updateCategory(id, body);
    setCategories((prev) => prev.map((c) => (c.id === id ? cat : c)));
    return cat;
  }

  async function deleteCategory(id) {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return { categories, loading, createCategory, updateCategory, deleteCategory };
}

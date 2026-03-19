const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/db');

const getCategories = (req, res) => {
  try {
    const data = readData();
    res.json({ data: data.categories ?? [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCategory = (req, res) => {
  try {
    const { label, colorId } = req.body;
    if (!label?.trim()) {
      return res.status(400).json({ error: 'label is required' });
    }
    const data = readData();
    const category = {
      id: `cat-${uuidv4()}`,
      label: label.trim(),
      colorId: colorId || 'blue',
    };
    data.categories.push(category);
    writeData(data);
    res.status(201).json({ data: category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = (req, res) => {
  try {
    const data = readData();
    const idx = data.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    const { label, colorId } = req.body;
    if (label     !== undefined) data.categories[idx].label   = label.trim();
    if (colorId   !== undefined) data.categories[idx].colorId = colorId;
    writeData(data);
    res.json({ data: data.categories[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = (req, res) => {
  try {
    const data = readData();
    const idx = data.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    data.categories.splice(idx, 1);
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

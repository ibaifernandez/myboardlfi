const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/db');

const getColumns = (req, res) => {
  try {
    const data = readData();
    const columns = data.columns
      .filter((c) => c.boardId === req.params.boardId)
      .sort((a, b) => a.order - b.order);
    res.json({ data: columns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createColumn = (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

    const data = readData();
    const board = data.boards.find((b) => b.id === req.params.boardId);
    if (!board) return res.status(404).json({ error: 'Board not found' });

    const existing = data.columns.filter((c) => c.boardId === req.params.boardId);
    const maxOrder = existing.reduce((max, c) => Math.max(max, c.order), 0);

    const column = {
      id: `col-${uuidv4()}`,
      boardId: req.params.boardId,
      title: title.trim(),
      order: maxOrder + 1,
    };
    data.columns.push(column);
    writeData(data);
    res.status(201).json({ data: column });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateColumn = (req, res) => {
  try {
    const { title, order, defaultSort } = req.body;
    const data = readData();
    const idx = data.columns.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Column not found' });

    if (title?.trim()) data.columns[idx].title = title.trim();
    if (order !== undefined) data.columns[idx].order = order;
    if (defaultSort !== undefined) data.columns[idx].defaultSort = defaultSort;
    writeData(data);
    res.json({ data: data.columns[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteColumn = (req, res) => {
  try {
    const data = readData();
    const idx = data.columns.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Column not found' });

    data.columns.splice(idx, 1);
    data.cards = data.cards.filter((c) => c.columnId !== req.params.id);
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getColumns, createColumn, updateColumn, deleteColumn };

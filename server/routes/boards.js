const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/db');

const DEFAULT_COLUMNS = [
  { title: '🗂 Backlog',     order: 1 },
  { title: '🎯 Prioridades', order: 2 },
  { title: '🔄 En curso',    order: 3 },
  { title: '⏸ Bloqueado',   order: 4 },
  { title: '✅ Hecho',       order: 5 },
];

const getBoards = (req, res) => {
  try {
    const data = readData();
    res.json({ data: data.boards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBoard = (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

    const data = readData();
    const board = {
      id: `board-${uuidv4()}`,
      title: title.trim(),
      createdAt: new Date().toISOString(),
    };
    data.boards.push(board);

    // Seed default columns
    const now = new Date().toISOString();
    DEFAULT_COLUMNS.forEach((col) => {
      data.columns.push({
        id:        `col-${uuidv4()}`,
        boardId:   board.id,
        title:     col.title,
        order:     col.order,
        createdAt: now,
      });
    });

    writeData(data);
    res.status(201).json({ data: board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBoard = (req, res) => {
  try {
    const { title } = req.body;
    const data = readData();
    const idx = data.boards.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Board not found' });

    if (title?.trim()) data.boards[idx].title = title.trim();
    writeData(data);
    res.json({ data: data.boards[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBoard = (req, res) => {
  try {
    const data = readData();
    const idx = data.boards.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Board not found' });

    data.boards.splice(idx, 1);
    data.columns = data.columns.filter((c) => c.boardId !== req.params.id);
    data.cards = data.cards.filter((c) => c.boardId !== req.params.id);
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reorderBoards = (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' });

    const data = readData();
    const idxMap = Object.fromEntries(ids.map((id, i) => [id, i]));
    data.boards.sort((a, b) => (idxMap[a.id] ?? 999) - (idxMap[b.id] ?? 999));
    writeData(data);
    res.json({ data: data.boards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBoards, createBoard, updateBoard, deleteBoard, reorderBoards };

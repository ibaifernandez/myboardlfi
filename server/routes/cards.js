const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/db');

const getCardsByBoard = (req, res) => {
  try {
    const data = readData();
    const cards = data.cards
      .filter((c) => c.boardId === req.params.boardId)
      .sort((a, b) => a.order - b.order);
    res.json({ data: cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCardsByColumn = (req, res) => {
  try {
    const data = readData();
    const cards = data.cards
      .filter((c) => c.columnId === req.params.columnId)
      .sort((a, b) => a.order - b.order);
    res.json({ data: cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCard = (req, res) => {
  try {
    const { columnId, boardId, title, description, category, priority, dueDate, tags, checklist, checklistTitle } = req.body;
    if (!columnId || !boardId || !title?.trim()) {
      return res.status(400).json({ error: 'columnId, boardId and title are required' });
    }

    const data = readData();
    if (!data.columns.find((c) => c.id === columnId)) {
      return res.status(404).json({ error: 'Column not found' });
    }

    const colCards = data.cards.filter((c) => c.columnId === columnId);
    const maxOrder = colCards.reduce((max, c) => Math.max(max, c.order), 0);

    const now = new Date().toISOString();
    const card = {
      id: `card-${uuidv4()}`,
      columnId,
      boardId,
      title: title.trim(),
      description: description || '',
      category: category || 'personal',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
      checklist:      Array.isArray(checklist) ? checklist : [],
      checklistTitle: checklistTitle || '',
      createdAt: now,
      updatedAt: now,
      order: maxOrder + 1,
    };
    data.cards.push(card);
    writeData(data);
    res.status(201).json({ data: card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCard = (req, res) => {
  try {
    const data = readData();
    const idx = data.cards.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Card not found' });

    const allowed = ['title', 'description', 'category', 'priority', 'dueDate', 'tags', 'checklist', 'checklistTitle'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) data.cards[idx][field] = req.body[field];
    });
    data.cards[idx].updatedAt = new Date().toISOString();
    writeData(data);
    res.json({ data: data.cards[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const moveCard = (req, res) => {
  try {
    const { columnId, order } = req.body;
    if (!columnId || order === undefined) {
      return res.status(400).json({ error: 'columnId and order are required' });
    }

    const data = readData();
    const cardIdx = data.cards.findIndex((c) => c.id === req.params.id);
    if (cardIdx === -1) return res.status(404).json({ error: 'Card not found' });

    const destColumn = data.columns.find((c) => c.id === columnId);
    if (!destColumn) return res.status(404).json({ error: 'Column not found' });

    const card = data.cards[cardIdx];
    const srcColumnId = card.columnId;
    const srcOrder = card.order;
    const destOrder = order;

    if (srcColumnId === columnId) {
      // Reorder within same column
      data.cards
        .filter((c) => c.columnId === columnId && c.id !== card.id)
        .forEach((c) => {
          if (srcOrder < destOrder && c.order > srcOrder && c.order <= destOrder) c.order -= 1;
          if (srcOrder > destOrder && c.order >= destOrder && c.order < srcOrder) c.order += 1;
        });
    } else {
      // Close gap in source column
      data.cards
        .filter((c) => c.columnId === srcColumnId)
        .forEach((c) => {
          if (c.order > srcOrder) c.order -= 1;
        });
      // Make room in destination column
      data.cards
        .filter((c) => c.columnId === columnId)
        .forEach((c) => {
          if (c.order >= destOrder) c.order += 1;
        });
    }

    card.columnId = columnId;
    card.boardId = destColumn.boardId;
    card.order = destOrder;
    card.updatedAt = new Date().toISOString();
    writeData(data);
    res.json({ data: card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCard = (req, res) => {
  try {
    const data = readData();
    const idx = data.cards.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Card not found' });

    data.cards.splice(idx, 1);
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchCards = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ data: [] });
    const data  = readData();
    const query = q.toLowerCase().trim();
    const results = data.cards
      .filter((c) =>
        c.title.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      )
      .map((c) => ({
        ...c,
        columnTitle: data.columns.find((col) => col.id === c.columnId)?.title ?? '?',
        boardTitle:  data.boards.find((b)   => b.id   === c.boardId)?.title  ?? '?',
      }))
      .slice(0, 15);
    res.json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCardsByBoard,
  getCardsByColumn,
  createCard,
  updateCard,
  moveCard,
  deleteCard,
  searchCards,
};

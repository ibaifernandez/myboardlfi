const express = require('express');
const cors    = require('cors');
const path    = require('path');
const helmet  = require('helmet');
require('dotenv').config();

const { getBoards, createBoard, updateBoard, deleteBoard, reorderBoards } = require('./routes/boards');
const { getColumns, createColumn, updateColumn, deleteColumn } = require('./routes/columns');
const {
  getCardsByBoard,
  getCardsByColumn,
  createCard,
  updateCard,
  moveCard,
  deleteCard,
  searchCards,
} = require('./routes/cards');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./routes/categories');
const { uploadImage, deleteImage } = require('./routes/uploads');
const authRouter   = require('./routes/auth');
const digestRouter = require('./routes/digestRoute');

const app = express();
const PORT = process.env.PORT || 3003;

// ── Security headers ───────────────────────────────────────
app.use(helmet({
  // Allow Vite dev server to load resources in development
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({ origin: ['http://localhost:5175', 'http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Auth ──────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ── Digest ────────────────────────────────────────────────
app.use('/api/digest', digestRouter);

// ── Boards ────────────────────────────────────────────────
app.get('/api/boards', getBoards);
app.post('/api/boards', createBoard);
app.put('/api/boards/reorder', reorderBoards);   // must come before /:id
app.put('/api/boards/:id', updateBoard);
app.delete('/api/boards/:id', deleteBoard);

// ── Columns ───────────────────────────────────────────────
app.get('/api/boards/:boardId/columns', getColumns);
app.post('/api/boards/:boardId/columns', createColumn);
app.put('/api/columns/:id', updateColumn);
app.delete('/api/columns/:id', deleteColumn);

// ── Cards ─────────────────────────────────────────────────
app.get('/api/cards/search', searchCards);          // must come before /:id routes
app.get('/api/boards/:boardId/cards', getCardsByBoard);
app.get('/api/columns/:columnId/cards', getCardsByColumn);
app.post('/api/cards', createCard);
app.put('/api/cards/:id/move', moveCard);           // must come before /:id
app.put('/api/cards/:id', updateCard);
app.delete('/api/cards/:id', deleteCard);

// ── Uploads ───────────────────────────────────────────────
app.post('/api/uploads',           uploadImage);
app.delete('/api/uploads/:filename', deleteImage);

// ── Categories ────────────────────────────────────────────
app.get('/api/categories',     getCategories);
app.post('/api/categories',    createCategory);
app.put('/api/categories/:id', updateCategory);
app.delete('/api/categories/:id', deleteCategory);

// ── Health ────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.listen(PORT, () => {
  console.log(`MyBoardLFi server → http://localhost:${PORT}`);
  require('./digest').startDigestScheduler();
});

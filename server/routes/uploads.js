const path = require('path');
const fs   = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uuidv4() + ext);
  },
});

// Acepta cualquier tipo de archivo (imágenes, PDF, CSV, etc.)
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// POST /api/uploads  →  { data: { url, name, type } }
const uploadFile = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
    res.json({
      data: {
        url:  `/uploads/${req.file.filename}`,
        name: req.file.originalname,
        type: req.file.mimetype,
      },
    });
  },
];

// DELETE /api/uploads/:filename
const deleteFile = (req, res) => {
  const { filename } = req.params;
  if (!filename || filename.includes('/') || filename.includes('..') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Nombre de archivo inválido' });
  }
  const filepath = path.join(UPLOAD_DIR, filename);
  try {
    fs.unlinkSync(filepath);
    res.json({ data: { ok: true } });
  } catch {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
};

// Mantener alias para compatibilidad con index.js
module.exports = { uploadImage: uploadFile, deleteImage: deleteFile, uploadFile, deleteFile };

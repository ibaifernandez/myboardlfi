const express = require('express');
const { sendDigest } = require('../digest');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/digest/send-me
// Sends the task digest to the authenticated user's email
router.post('/send-me', requireAuth, async (req, res) => {
  const { email, name } = req.user;

  if (!email) {
    return res.status(400).json({ error: 'No se pudo determinar el email del usuario.' });
  }

  try {
    const result = await sendDigest(email);

    if (result.cardCount === 0) {
      return res.json({ ok: true, message: '¡No tienes tareas pendientes urgentes ni con fecha límite próxima! 🎉' });
    }

    return res.json({
      ok: true,
      message: `Digest enviado a ${email} con ${result.cardCount} tarea${result.cardCount !== 1 ? 's' : ''}.`,
      cardCount: result.cardCount,
    });
  } catch (err) {
    console.error('[digest/send-me]', err.message);
    return res.status(500).json({ error: err.message || 'Error al enviar el digest.' });
  }
});

module.exports = router;

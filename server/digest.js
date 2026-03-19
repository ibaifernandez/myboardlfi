/**
 * digest.js — Daily task digest email for MyBoard
 *
 * Read-only: never writes to tasks.json.
 * Loaded once from server/index.js at startup.
 */

'use strict';

const cron       = require('node-cron');
const nodemailer = require('nodemailer');
const { readData } = require('./utils/db');

// ── Config ────────────────────────────────────────────────────────────────────

const DIGEST_HOUR = parseInt(process.env.DIGEST_HOUR ?? '6', 10);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns 'YYYY-MM-DD' for today in local time */
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Normalise a dueDate value to 'YYYY-MM-DD' or null */
function normDate(dueDate) {
  if (!dueDate) return null;
  return dueDate.slice(0, 10); // handles ISO strings and plain dates
}

/** Returns true when dueDate is today or in the past */
function isOverdue(dueDate) {
  const d = normDate(dueDate);
  if (!d) return false;
  return d <= todayStr();
}

/** Returns true when dueDate is strictly past (before today) */
function isPastDue(dueDate) {
  const d = normDate(dueDate);
  if (!d) return false;
  return d < todayStr();
}

/**
 * Sort rank (lower = first):
 *   0 — urgent + overdue
 *   1 — urgent, no date
 *   2 — urgent, future date
 *   3 — high   + overdue
 *   4 — high,   no date
 *   5 — high,   future date
 *   6 — rest,   overdue
 *   7 — rest,   no date
 *   8 — rest,   future date
 */
function sortRank(card) {
  const p = card.priority;
  const d = normDate(card.dueDate);
  const today = todayStr();

  if (p === 'urgent') {
    if (d && d <= today) return 0;
    if (!d)             return 1;
    return 2;
  }
  if (p === 'high') {
    if (d && d <= today) return 3;
    if (!d)             return 4;
    return 5;
  }
  // rest
  if (d && d <= today) return 6;
  if (!d)             return 7;
  return 8;
}

// ── Card selection ────────────────────────────────────────────────────────────

function selectCards(data) {
  const { boards = [], columns = [], cards = [] } = data;
  const today = todayStr();

  // Column IDs that belong to a "✅ Hecho" column (title contains the emoji)
  const doneColumnIds = new Set(
    columns
      .filter(c => c.title && c.title.includes('✅'))
      .map(c => c.id)
  );

  // Board ID of "📍 Hoy" (exclude it entirely)
  const hoyBoardId = boards.find(b => b.title && b.title.includes('📍'))?.id;

  const selected = new Map(); // id → card (dedup)

  for (const card of cards) {
    // Skip "✅ Hecho" columns
    if (doneColumnIds.has(card.columnId)) continue;
    // Skip "📍 Hoy" board
    if (card.boardId === hoyBoardId) continue;

    const p = card.priority;
    const d = normDate(card.dueDate);

    const includeByPriority = p === 'urgent' || p === 'high';
    const includeByDate     = d !== null && d <= today;

    if (includeByPriority || includeByDate) {
      selected.set(card.id, card);
    }
  }

  // Sort
  return [...selected.values()].sort((a, b) => {
    const rankDiff = sortRank(a) - sortRank(b);
    if (rankDiff !== 0) return rankDiff;
    // Within same rank, sort by dueDate ascending (nulls last)
    const da = normDate(a.dueDate) ?? '9999-99-99';
    const db = normDate(b.dueDate) ?? '9999-99-99';
    return da.localeCompare(db);
  });
}

// ── HTML builder ──────────────────────────────────────────────────────────────

const PRIORITY_BADGE = {
  urgent: { label: 'URGENTE', bg: '#ef4444', color: '#fff' },
  high:   { label: 'ALTA',    bg: '#f97316', color: '#fff' },
  medium: { label: 'MEDIA',   bg: '#eab308', color: '#1a1a1a' },
  low:    { label: 'BAJA',    bg: '#6b7280', color: '#fff' },
};

function priorityBadgeHtml(priority) {
  const b = PRIORITY_BADGE[priority];
  if (!b) return '';
  return `<span style="
    display:inline-block;
    padding:2px 7px;
    border-radius:4px;
    font-size:11px;
    font-weight:700;
    letter-spacing:.5px;
    background:${b.bg};
    color:${b.color};
    vertical-align:middle;
  ">${b.label}</span>`;
}

function dueDateHtml(dueDate) {
  const d = normDate(dueDate);
  if (!d) return '';
  const overdue = isPastDue(dueDate);
  const color = overdue ? '#ef4444' : '#94a3b8';
  const label = overdue ? `⚠ ${d}` : `📅 ${d}`;
  return `<span style="font-size:12px;color:${color};margin-left:8px;">${label}</span>`;
}

function checklistHtml(checklist) {
  if (!Array.isArray(checklist) || checklist.length === 0) return '';
  const done  = checklist.filter(i => i.checked).length;
  const total = checklist.length;
  const color = done === total ? '#22c55e' : '#94a3b8';
  return `<span style="font-size:12px;color:${color};margin-left:8px;">☑ ${done}/${total}</span>`;
}

function cardRowHtml(card) {
  return `
    <tr>
      <td style="
        padding:10px 14px;
        border-bottom:1px solid #1e293b;
        vertical-align:top;
      ">
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
          <span style="
            font-size:14px;
            color:#e2e8f0;
            font-weight:500;
          ">${escHtml(card.title)}</span>
          ${priorityBadgeHtml(card.priority)}
          ${dueDateHtml(card.dueDate)}
          ${checklistHtml(card.checklist)}
        </div>
      </td>
    </tr>`;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(cards, data) {
  const { boards = [] } = data;
  const boardMap = Object.fromEntries(boards.map(b => [b.id, b.title]));

  // Group cards by boardId preserving sort order
  const groups = new Map();
  for (const card of cards) {
    if (!groups.has(card.boardId)) groups.set(card.boardId, []);
    groups.get(card.boardId).push(card);
  }

  let sectionsHtml = '';
  for (const [boardId, boardCards] of groups) {
    const boardTitle = boardMap[boardId] ?? boardId;
    sectionsHtml += `
      <tr>
        <td style="padding:20px 14px 6px;">
          <span style="
            font-size:13px;
            font-weight:700;
            color:#64748b;
            text-transform:uppercase;
            letter-spacing:.8px;
          ">${escHtml(boardTitle)}</span>
        </td>
      </tr>
      ${boardCards.map(cardRowHtml).join('')}
    `;
  }

  const n = cards.length;
  const now = new Date();
  const dateLabel = now.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>MyBoard · Digest</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#1e40af 0%,#7c3aed 100%);
              padding:28px 28px 24px;
            ">
              <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.3px;">
                📍 MyBoardLFi
              </div>
              <div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:4px;">
                ${escHtml(dateLabel)}
              </div>
              <div style="
                display:inline-block;
                margin-top:12px;
                background:rgba(255,255,255,.15);
                border-radius:20px;
                padding:4px 14px;
                font-size:13px;
                font-weight:600;
                color:#fff;
              ">
                ${n} tarea${n !== 1 ? 's' : ''} pendiente${n !== 1 ? 's' : ''}
              </div>
            </td>
          </tr>

          <!-- Cards -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionsHtml}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding:16px 24px;
              border-top:1px solid #0f172a;
              text-align:center;
              font-size:11px;
              color:#475569;
            ">
              MyBoardLFi · © 2026 Ibai Fernández — generado automáticamente.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Mailer ────────────────────────────────────────────────────────────────────

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildSubject(cardCount) {
  const now = new Date();
  const weekday = now.toLocaleDateString('es-ES', { weekday: 'long' });
  const fecha   = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `📍 MyBoard · ${capitalized}, ${fecha} — ${cardCount} tarea${cardCount !== 1 ? 's' : ''} pendiente${cardCount !== 1 ? 's' : ''}`;
}

// ── Main send function ────────────────────────────────────────────────────────

/**
 * Sends the digest to `to`. Returns { cardCount } on success, throws on error.
 * If `to` is omitted, falls back to DIGEST_TO env var.
 */
async function sendDigest(to) {
  const recipient = to ?? process.env.DIGEST_TO;
  if (!recipient) {
    console.warn('[digest] No recipient — skipping.');
    return;
  }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('SMTP no configurado en el servidor.');
  }

  const data  = readData();
  const cards = selectCards(data);

  if (cards.length === 0) {
    return { cardCount: 0 };
  }

  const html      = buildHtml(cards, data);
  const subject   = buildSubject(cards.length);
  const transport = createTransport();

  const info = await transport.sendMail({
    from:    process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to:      recipient,
    subject,
    html,
  });

  console.log(`[digest] Email sent → ${recipient} (${cards.length} cards) [${info.messageId}]`);
  return { cardCount: cards.length };
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

function startDigestScheduler() {
  const hour = Number.isFinite(DIGEST_HOUR) ? DIGEST_HOUR : 6;
  const expr  = `0 ${hour} * * *`;

  cron.schedule(expr, () => {
    console.log(`[digest] Running scheduled digest (${new Date().toISOString()})`);
    sendDigest();
  });

  console.log(`[digest] Scheduler started — daily at ${String(hour).padStart(2, '0')}:00 local time`);
}

module.exports = { startDigestScheduler, sendDigest };

// Parse "YYYY-MM-DD" as local noon to avoid UTC-offset day shifts
function parseLocalDate(dueDate) {
  return new Date(dueDate.slice(0, 10) + 'T12:00:00');
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const due   = parseLocalDate(dueDate);
  const today = new Date(new Date().toDateString());
  return due < today;
}

export function formatDate(dueDate) {
  if (!dueDate) return null;
  return parseLocalDate(dueDate).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short',
  });
}

/**
 * Normaliza datetime-local (YYYY-MM-DDTHH:mm) para armazenamento consistente no SQLite.
 */
function normalizeDatetime(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  const iso = trimmed.replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(iso)) {
    return iso;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(iso)) {
    return iso.slice(0, 16);
  }
  return null;
}

module.exports = { normalizeDatetime };

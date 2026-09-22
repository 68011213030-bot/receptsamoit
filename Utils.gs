const Utils = {
  now() { return new Date(); },
  iso(d) { return Utilities.formatDate(new Date(d), CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"); },
  date(d) { return Utilities.formatDate(new Date(d), CONFIG.TIMEZONE, 'yyyy-MM-dd'); },
  year() { return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy'); },
  clean(v) { return v === null || v === undefined ? '' : String(v).trim(); },
  safeError(err) {
    return err && err.message ? err.message : 'เกิดข้อผิดพลาดในการประมวลผล';
  },
  uuid(prefix) {
    return (prefix ? prefix + '-' : '') + Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();
  },
  hash(text) {
    const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8);
    return bytes.map(b => ('0'+(b & 0xff).toString(16)).slice(-2)).join('');
  },
  json(v) { return JSON.stringify(v || {}); },
  parseJson(v, fallback) { try { return JSON.parse(v); } catch(e) { return fallback; } },
  isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Utils.clean(v)); },
  escape(v) {
    return Utils.clean(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
  isOverdue(dateValue) {
    return dateValue && new Date(dateValue).getTime() < new Date().setHours(0,0,0,0);
  },
  daysFromToday(dateValue) {
    if (!dateValue) return null;
    const a = new Date(); a.setHours(0,0,0,0);
    const b = new Date(dateValue); b.setHours(0,0,0,0);
    return Math.round((b-a)/86400000);
  },
  withLock(fn) {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try { return fn(); } finally { lock.releaseLock(); }
  }
};

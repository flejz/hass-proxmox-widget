export function formatPercent(v) {
  if (v == null) return '—';
  return parseFloat(v).toFixed(1) + '%';
}

// Input: GB (integration reports memory/disk in GB already)
export function formatGiB(gb) {
  if (gb == null) return '—';
  const n = parseFloat(gb);
  if (isNaN(n)) return '—';
  if (n >= 1) return n.toFixed(1) + ' GiB';
  return (n * 1024).toFixed(0) + ' MiB';
}

// Input: hours (integration reports uptime in hours)
export function formatUptime(hours) {
  if (hours == null) return '—';
  const n = parseFloat(hours);
  if (isNaN(n)) return '—';
  const d = Math.floor(n / 24);
  const h = Math.floor(n % 24);
  const m = Math.floor((n % 1) * 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Input: MB/s (integration reports network in MB/s)
export function formatNetMbs(mbs) {
  if (mbs == null) return '—';
  const n = parseFloat(mbs);
  if (isNaN(n)) return '—';
  if (n >= 1) return n.toFixed(1) + ' MB/s';
  if (n >= 0.001) return (n * 1024).toFixed(1) + ' KB/s';
  return (n * 1024 * 1024).toFixed(0) + ' B/s';
}

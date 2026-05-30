export function formatPercent(v) {
  if (v == null) return '—';
  return parseFloat(v).toFixed(1) + '%';
}

export function formatBytes(bytes) {
  if (bytes == null) return '—';
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + ' GiB';
  return Math.round(bytes / 1_048_576) + ' MiB';
}

export function formatUptime(seconds) {
  if (seconds == null) return '—';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatNet(bps) {
  if (bps == null) return '—';
  if (bps >= 1_000_000) return (bps / 1_000_000).toFixed(1) + ' MB/s';
  if (bps >= 1_000) return (bps / 1_000).toFixed(1) + ' KB/s';
  return Math.round(bps) + ' B/s';
}

const TRANSLATION_KEY_TO_ROLE = {
  cpu_used_percentage: 'cpu',
  memory_used_percentage: 'memory_pct',
  memory_used: 'memory',
  disk_used: 'disk',
  disk_used_percentage: 'disk_pct',
  network_in: 'net_in',
  network_out: 'net_out',
  uptime: 'uptime',
  running: 'running',
  backup_status: 'backup',
};

const NODE_ENTITY_KEYS = ['cpu', 'memory_pct', 'memory', 'disk', 'disk_pct', 'net_in', 'net_out', 'uptime'];
const VM_ENTITY_KEYS = ['running', 'cpu', 'memory_pct', 'memory'];

function roleFromEntityId(entity_id) {
  const id = entity_id.toLowerCase();

  if (id.includes('cpu')) return 'cpu';
  if (id.includes('memory_used_percentage') || (id.includes('memory') && id.includes('percent'))) return 'memory_pct';
  if (id.includes('memory_used') || (id.includes('memory') && !id.includes('max') && !id.includes('percent'))) return 'memory';
  if (id.includes('disk_used_percentage') || (id.includes('disk') && id.includes('percent'))) return 'disk_pct';
  if (id.includes('disk_used') || (id.includes('disk') && !id.includes('max') && !id.includes('percent'))) return 'disk';
  if (id.includes('network_in') || id.includes('net_in')) return 'net_in';
  if (id.includes('network_out') || id.includes('net_out')) return 'net_out';
  if (id.includes('uptime')) return 'uptime';
  if (id.includes('running')) return 'running';
  if (id.includes('backup')) return 'backup';

  return null;
}

/**
 * discoverProxmoxEntities(hass, config)
 * Returns { nodes: NodeGroup[], vms: VmGroup[] } discovered from the HA entity/device registry.
 */
export function discoverProxmoxEntities(hass, config) {
  if (!hass?.entities) return { nodes: [], vms: [] };

  const exclude = config?.exclude ?? [];

  // Collect all proxmoxve entities grouped by device_id
  const deviceGroups = {};

  for (const [entity_id, entry] of Object.entries(hass.entities)) {
    if (entry.platform !== 'proxmoxve') continue;
    if (exclude.includes(entity_id)) continue;
    if (!entry.device_id) continue;

    const { device_id, translation_key } = entry;
    if (!deviceGroups[device_id]) deviceGroups[device_id] = [];
    deviceGroups[device_id].push({ entity_id, translation_key });
  }

  const nodes = [];
  const vms = [];

  for (const [device_id, entries] of Object.entries(deviceGroups)) {
    // Build role map: translation_key takes precedence; entity_id pattern is fallback
    const roleMap = {};

    for (const { entity_id, translation_key } of entries) {
      const role = (translation_key && TRANSLATION_KEY_TO_ROLE[translation_key]) ?? roleFromEntityId(entity_id);
      if (!role) continue;
      // Prefer translation_key-derived roles over fallback-derived ones
      const existing = roleMap[role];
      if (!existing) {
        roleMap[role] = { entity_id, fromTranslation: !!(translation_key && TRANSLATION_KEY_TO_ROLE[translation_key]) };
      } else if (!existing.fromTranslation && translation_key && TRANSLATION_KEY_TO_ROLE[translation_key]) {
        roleMap[role] = { entity_id, fromTranslation: true };
      }
    }

    const device = hass.devices?.[device_id];
    const name = device?.name_by_user || device?.name || device_id;

    const toEntry = (role) => {
      const mapped = roleMap[role];
      if (!mapped) return undefined;
      const state = hass.states?.[mapped.entity_id] ?? null;
      return { entity_id: mapped.entity_id, state };
    };

    const isVm = !!roleMap['running'];

    if (isVm) {
      const model = device?.model?.toLowerCase();
      const type = model === 'lxc' ? 'lxc' : 'vm';
      const node_device_id = device?.via_device_id;

      const entities = {};
      for (const key of VM_ENTITY_KEYS) {
        const entry = toEntry(key);
        if (entry !== undefined) entities[key] = entry;
      }

      vms.push({ type, name, device_id, node_device_id, entities });
    } else {
      const entities = {};
      for (const key of NODE_ENTITY_KEYS) {
        const entry = toEntry(key);
        if (entry !== undefined) entities[key] = entry;
      }

      nodes.push({ type: 'node', name, device_id, entities });
    }
  }

  nodes.sort((a, b) => a.name.localeCompare(b.name));
  vms.sort((a, b) => a.name.localeCompare(b.name));

  return { nodes, vms };
}

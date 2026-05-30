// Translation keys from the official proxmoxve integration
const NODE_KEY_MAP = {
  node_cpu: 'cpu',
  node_memory_percentage: 'memory_pct',
  node_memory: 'memory_gb',
  node_disk: 'disk_gb',
  node_max_disk: 'disk_max_gb',
  node_uptime: 'uptime_h',
};

const CONTAINER_KEY_MAP = {
  container_cpu: 'cpu',
  container_memory_percentage: 'memory_pct',
  container_memory: 'memory_gb',
  container_disk: 'disk_gb',
  container_max_disk: 'disk_max_gb',
  container_uptime: 'uptime_h',
  container_netin: 'net_in_mbs',
  container_netout: 'net_out_mbs',
  status: 'running', // binary_sensor, state 'on'/'off'
};

// device.model values from the integration
const MODEL_TO_TYPE = {
  Node: 'node',
  Container: 'lxc',
  QEMU: 'vm',
};

function keyMapForType(type) {
  return type === 'node' ? NODE_KEY_MAP : CONTAINER_KEY_MAP;
}

export function discoverProxmoxEntities(hass, config) {
  if (!hass?.entities) return { nodes: [], vms: [] };

  const exclude = new Set(config?.exclude ?? []);

  // Group entities by device_id
  const byDevice = new Map();
  for (const [entity_id, entry] of Object.entries(hass.entities)) {
    if (entry.platform !== 'proxmoxve') continue;
    if (exclude.has(entity_id)) continue;
    if (!entry.device_id) continue;
    if (!byDevice.has(entry.device_id)) byDevice.set(entry.device_id, []);
    byDevice.get(entry.device_id).push({ entity_id, translation_key: entry.translation_key });
  }

  const nodes = [];
  const vms = [];

  for (const [device_id, entries] of byDevice) {
    const device = hass.devices?.[device_id];
    const type = MODEL_TO_TYPE[device?.model];
    if (!type) continue; // skip Storage and unknown device types

    const name = device?.name_by_user || device?.name || device_id;
    const keyMap = keyMapForType(type);

    // Build entity map using translation_key
    const entityMap = {};
    for (const { entity_id, translation_key } of entries) {
      const role = keyMap[translation_key];
      if (!role || role in entityMap) continue;
      const state = hass.states?.[entity_id] ?? null;
      entityMap[role] = { entity_id, state };
    }

    const group = { type, name, device_id, node_device_id: device?.via_device_id, entities: entityMap };

    if (type === 'node') nodes.push(group);
    else vms.push(group);
  }

  nodes.sort((a, b) => a.name.localeCompare(b.name));
  vms.sort((a, b) => a.name.localeCompare(b.name));

  return { nodes, vms };
}

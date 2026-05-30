import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/proxmox-card.js',
  output: {
    file: 'dist/proxmox-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [resolve(), terser()],
};

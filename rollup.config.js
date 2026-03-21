import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/shabbat-card.js',
  output: {
    file: 'dist/shabbat-card.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    terser(),
  ],
};

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

export default {
  input: 'src/laundry-status-card.ts',
  output: {
    file: 'dist/laundry-status-card.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    string({ include: '**/*.svg' }),
    typescript(),
    terser(),
  ],
};

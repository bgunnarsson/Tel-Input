import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.mjs', // Your input file
  output: [
    {
      file: 'dist/tel-input.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/tel-input.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/tel-input.min.js',
      format: 'iife',
      name: 'TelInput',
      sourcemap: true,
      plugins: [terser()], // Apply Terser only for this output
    },
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.mjs'],
    }),
    commonjs(),
    json(),
    copy({
      targets: [
        { src: 'src/flags.mjs', dest: 'dist' }, // Copy flags.mjs without transformation
        { src: 'src/countries.mjs', dest: 'dist' },
      ],
    }),
  ],
}

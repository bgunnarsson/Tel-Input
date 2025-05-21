import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import virtual from '@rollup/plugin-virtual'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'
import fs from 'node:fs'

// Load the content of flags.mjs as a raw string
// const flagsContent = fs.readFileSync('src/flags.mjs', 'utf-8')

export default {
  input: 'src/index.mjs', // Your input file
  output: [
    {
      file: 'dist/tel-input.esm.js',
      format: 'esm',
      sourcemap: true,
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
        { src: 'src/countries.mjs', dest: 'dist' }, // Copy countries.mjs as-is
        { src: 'src/flags.mjs', dest: 'dist' }, // Copy countries.mjs as-is
        { src: 'src/flags-optimized', dest: 'dist' }, // Copy countries.mjs as-is
      ],
    }),
  ],
  external: ['./countries.mjs', './flags.mjs'], // Mark countries.mjs as an external dependency
}

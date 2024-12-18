import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import virtual from '@rollup/plugin-virtual'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'
import fs from 'node:fs'

// Load the content of flags.mjs as a raw string
const flagsContent = fs.readFileSync('src/flags.mjs', 'utf-8')

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
      plugins: [terser()],
    },
  ],
  plugins: [
    virtual({
      'flags.mjs': flagsContent, // Use virtual module for flags.mjs
    }),
    resolve({
      extensions: ['.js', '.mjs'],
    }),
    commonjs(),
    json(),
    copy({
      targets: [
        { src: 'src/countries.mjs', dest: 'dist' }, // Copy countries.mjs as-is
      ],
    }),
  ],
  external: ['./countries.mjs'], // Mark countries.mjs as an external dependency
}

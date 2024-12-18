import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import virtual from '@rollup/plugin-virtual'
import { terser } from 'rollup-plugin-terser'

import fs from 'node:fs'

const flagsContent = fs.readFileSync('src/flags.mjs', 'utf-8') // Read the raw content of flags.mjs

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
      'flags.mjs': flagsContent, // Embed the raw content of flags.mjs
    }),
    resolve({
      extensions: ['.js', '.mjs'],
    }),
    commonjs(),
    json(),
  ],
}

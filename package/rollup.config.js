import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/TelInput.js', // Entry point
  output: [
    {
      file: 'dist/tel-input.esm.js',
      format: 'esm', // ES module format
      sourcemap: true,
    },
    {
      file: 'dist/tel-input.cjs.js',
      format: 'cjs', // CommonJS format
      sourcemap: true,
    },
    {
      file: 'dist/tel-input.min.js',
      format: 'iife', // Browser-ready format
      name: 'TelInput',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.mjs'], // Ensure Rollup resolves .mjs files
    }),
    commonjs(), // Convert CommonJS to ESM
    json(), // Handle JSON imports
    copy({
      targets: [
        { src: 'src/countries.mjs', dest: 'dist' }, // Copy countries.mjs
        { src: 'src/flags.mjs', dest: 'dist' }, // Copy flags.mjs
      ],
    }),
  ],
  external: [], // Leave this empty to bundle everything
})

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/index.mjs', // Entry file
  output: [
    {
      file: 'dist/tel-input.cjs.js',
      format: 'cjs', // CommonJS
      sourcemap: true,
    },
    {
      file: 'dist/tel-input.esm.js',
      format: 'esm', // ES Module
      sourcemap: true,
    },
    {
      file: 'dist/tel-input.min.js',
      format: 'iife', // Browser-ready IIFE
      name: 'TelInput',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.mjs'], // Resolve .mjs and .js files
    }),
    commonjs(), // Convert CommonJS to ESM
    json(), // Handle JSON imports
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ],
  external: [], // Specify external dependencies if needed
})

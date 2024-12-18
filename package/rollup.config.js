import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
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
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.mjs'],
    }),
    commonjs(),
    json(),
    replace({
      preventAssignment: true,
      delimiters: ['', ''],
      values: {
        '&quot;': '"', // Replace escaped double quotes
        '&apos;': "'", // Replace escaped single quotes
        '&lt;': '<', // Replace escaped less-than
        '&gt;': '>', // Replace escaped greater-than
        '&amp;': '&', // Replace escaped ampersands
      },
    }),
    copy({
      targets: [
        { src: 'src/flags.mjs', dest: 'dist' },
        { src: 'src/countries.mjs', dest: 'dist' },
      ],
    }),
  ],
}

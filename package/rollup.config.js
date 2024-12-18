import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/TelInput.js',
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
      plugins: [
        terser({
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
          // Exclude flags.mjs from minification
          exclude: [/flags\.mjs$/],
        }),
      ],
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
        { src: 'src/flags.mjs', dest: 'dist' }, // Ensure flags.mjs is copied as-is
      ],
    }),
  ],
}

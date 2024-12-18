import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import url from '@rollup/plugin-url'
import alias from '@rollup/plugin-alias'
import copy from 'rollup-plugin-copy'

const isProduction = process.env.NODE_ENV === 'production'

const commonPlugins = [
  resolve(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**', // Exclude dependencies from being transpiled
    presets: ['@babel/preset-react'], // Transpile JSX and React code
  }),
  commonjs(), // Must come after Babel for CJS modules
  url({
    include: '**/*.svg', // Include all SVG files
    limit: 0, // Force all files to be treated as URLs
  }),
]

const productionPlugins = [
  terser(), // Minifies output in production
]

export default [
  // Build for flags
  {
    input: 'src/flags.mjs',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
        exports: 'auto',
      },
      // {
      //   file: 'dist/flags.cjs.js',
      //   format: 'cjs',
      //   exports: 'auto',
      // },
    ],
    plugins: [...commonPlugins, ...(isProduction ? productionPlugins : [])],
  },

  // Build for countries
  {
    input: 'src/countries.mjs',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
        exports: 'auto',
      },
      // {
      //   file: 'dist/countries.cjs.js',
      //   format: 'cjs',
      //   exports: 'auto',
      // },
    ],
    plugins: [...commonPlugins, ...(isProduction ? productionPlugins : [])],
  },

  // Main build (CJS and ESM)
  {
    input: 'src/index.mjs', // Core input
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
        exports: 'auto',
      },
    ],
    external: (id) => {
      return [
        './runtime-loader.js',
        // './countries.cjs.js',
        './countries.esm.js',
        // './flags.cjs.js',
        './flags.esm.js',
      ].includes(id)
    },
    plugins: [
      ...commonPlugins,
      alias({
        entries: [
          {
            find: './countries.mjs',
            replacement: './dist/countries.esm.js',
          },
          {
            find: './flags.mjs',
            replacement: './dist/flags.esm.js',
          },
        ],
        customResolver: resolve(),
      }),
      copy({
        targets: [
          { src: 'src/runtime-loader.js', dest: 'dist' }, // Move runtime-loader.js to dist
        ],
      }),
      ...(isProduction ? productionPlugins : []),
    ],
  },

  // React wrapper build (ESM only)
  // {
  //   input: 'src/react/index.js', // Input for the React wrapper
  //   external: ['react', 'react-dom'], // Mark React and React-DOM as external
  //   output: {
  //     file: 'dist/react/index.js', // Output as dist/react/index.js (ESM)
  //     format: 'esm',
  //   },
  //   plugins: [
  //     ...commonPlugins, // Reuse common plugins
  //     ...(isProduction ? productionPlugins : []),
  //   ],
  // },
]

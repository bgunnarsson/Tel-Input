// svgo.config.js
// Enhanced SVGO configuration for flag SVGs
module.exports = {
  multipass: true, // iterate optimizations until no further gains
  plugins: [
    // Default preset as a baseline
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // keep viewBox for scaling
          cleanupIds: false, // preserve IDs for symbols/use
        },
      },
    },
    // Remove unused or default attributes early
    'removeUnknownsAndDefaults',
    'cleanupAttrs',
    'removeUselessDefs',
    'removeUselessStrokeAndFill',
    'cleanupListOfValues',

    // Merge and collapse groups & paths
    'collapseGroups',
    'mergePaths',

    // Optimize path data (after merges)
    'convertPathData',

    // Convert shapes to paths when beneficial
    {
      name: 'convertShapeToPath',
      params: {
        convertArcs: true,
      },
    },

    // Strip dimensions in favor of viewBox
    'removeDimensions',

    // Strip comments and metadata
    'removeComments',
    'removeMetadata',

    // ID prefixing to avoid collisions in sprites
    {
      name: 'prefixIds',
      params: {
        prefix: 'flag', // static prefix
        delim: '-', // delimiter
        prefixIds: true,
        prefixClassNames: false,
      },
    },
  ],
}

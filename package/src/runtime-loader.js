export default async function loadModules() {
  if (typeof require === 'function') {
    // CommonJS environment
    return {
      countries: require('./countries.esm.js'),
      flags: require('./flags.esm.js'),
    }
  }

  throw new Error('Unsupported environment: Cannot load countries and flags')
}

export default async function loadModules() {
  if (typeof require === 'function') {
    // CommonJS environment
    return {
      countries: require('./countries.cjs.js'),
      flags: require('./flags.cjs.js'),
    }
  } else if (typeof import.meta !== 'undefined') {
    // ESM environment
    const countries = (await import('./countries.esm.js')).default
    const flags = (await import('./flags.esm.js')).default
    return { countries, flags }
  } else {
    throw new Error('Unsupported environment: Cannot load countries and flags')
  }
}

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const svgDir = path.join(__dirname, 'flags-optimized-svg')
const outDir = path.join(__dirname, 'flags-optimized')
const flagsMap = []

// ensure output dir exists
fs.mkdirSync(outDir, { recursive: true })

for (const file of fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'))) {
  const iso = path.basename(file, '.svg')
  const svgSrc = fs.readFileSync(path.join(svgDir, file), 'utf8')
  const jsModule = `export default ${JSON.stringify(svgSrc)};\n`

  // write us.js, ca.js, etc.
  fs.writeFileSync(path.join(outDir, `${iso}.js`), jsModule, 'utf8')

  // collect for flags.mjs
  flagsMap.push(`  "${iso}": () => import("./flags-optimized/${iso}.js")`)
}

// emit flags.mjs
const flagsMjs = `// auto-generated\nexport default {\n${flagsMap.join(',\n')}\n}\n`
fs.writeFileSync(path.join(__dirname, 'flags.mjs'), flagsMjs, 'utf8')

console.log('✅ flags.js modules generated')

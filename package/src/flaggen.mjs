import fs from 'node:fs'
import path from 'node:path'

import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const flagsDir = path.join(__dirname, 'flags-optimized') // Adjust path to the flags folder
const outputFilePath = path.join(__dirname, 'flags.mjs')

const flagFiles = fs.readdirSync(flagsDir)

const flagsMap = {}

flagFiles.forEach((file) => {
  const iso2 = path.basename(file, '.svg')
  const svgContent = fs.readFileSync(path.join(flagsDir, file), 'utf8') // Read SVG content
  flagsMap[iso2] = svgContent // Store the raw SVG content in the map
})

// Write the map to a JavaScript file
fs.writeFileSync(outputFilePath, `export default ${JSON.stringify(flagsMap, null, 2)};`)

console.log(`flags.mjs generated at ${outputFilePath}`)

import fs from 'node:fs'
import path from 'node:path'

/**
 * Recursively deletes all node_modules folders starting from the current directory.
 * @param {string} dir The directory to start from. Defaults to the current working directory.
 */
async function removeNodeModules(dir = process.cwd()) {
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') {
          console.log(`Removing: ${fullPath}`)
          await fs.promises.rm(fullPath, { recursive: true, force: true })
          console.log(`Removed: ${fullPath}`)
        } else {
          await removeNodeModules(fullPath) // Recurse into subdirectories
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${dir}: ${error.message}`)
  }
}

// Run the function
removeNodeModules()
  .then(() => {
    console.log('Finished removing all node_modules folders.')
  })
  .catch((err) => {
    console.error(`Error during execution: ${err.message}`)
  })

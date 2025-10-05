import fs from 'fs'

const threshold = parseInt(process.env.BUNDLE_MAX_INITIAL_KB || '130', 10)
const logPath = process.env.BUNDLE_LOG_PATH || 'build.out'

if (!fs.existsSync(logPath)) {
  console.error(`Bundle log not found at ${logPath}. Ensure you pipe build output to this file.`)
  process.exit(1)
}

const content = fs.readFileSync(logPath, 'utf8')
const match = content.match(/First Load JS shared by all\s+(\d+)\s*kB/i)

if (!match) {
  console.error('Could not find "First Load JS shared by all" in build output')
  process.exit(1)
}

const sizeKb = parseInt(match[1], 10)
console.log(`Detected First Load JS: ${sizeKb} kB (threshold: ${threshold} kB)`) 

if (sizeKb > threshold) {
  console.error(`Bundle size exceeded threshold: ${sizeKb} kB > ${threshold} kB`)
  process.exit(1)
}

console.log('Bundle size within threshold')



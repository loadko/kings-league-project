import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'db')

async function readDbFile(fileName) {
  const filePath = path.join(DB_PATH, `${fileName}.json`)
  return readFile(filePath, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDbFile('teams')
export const PRESIDENTS = await readDbFile('presidents')

export async function writeDbFile(fileName, content) {
  const filePath = path.join(DB_PATH, `${fileName}.json`)
  return writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
}

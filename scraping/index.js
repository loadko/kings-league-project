import { scrapeAndSave, SCRAPINGS } from './utils.js'

const scrapingsKeys = Object.keys(SCRAPINGS)
for (const scrapingKey of scrapingsKeys) {
  await scrapeAndSave(scrapingKey)
}

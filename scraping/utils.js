import * as cheerio from 'cheerio'
import { PRESIDENTS, TEAMS, writeDbFile } from '../db/index.js'
import { getAssists } from './assists.js'
import { getLeaderboard } from './leaderboard.js'
import { logError, logInfo, logSuccess } from './log.js'
import { getMvp } from './mvp.js'
import { getTopScorers } from './top-scorer.js'

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderboard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvp
  },
  'top-scorer': {
    url: 'https://kingsleague.pro/estadisticas/goles/',
    scraper: getTopScorers
  },
  assists: {
    url: 'https://kingsleague.pro/estadisticas/asistencias/',
    scraper: getAssists
  }
}

export const clearText = (text) =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, '')
    .trim()

export function getElementValue($, selector, typeOf) {
  const rawValue = $.find(selector).text()
  const valueCleaned = clearText(rawValue)
  const value = typeOf === 'number' ? Number(valueCleaned) : valueCleaned

  return value
}

export async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export async function scrapeAndSave(name) {
  const start = performance.now()

  try {
    const { url, scraper } = SCRAPINGS[name]

    logInfo(`Scraping [${name}]...`)
    const $ = await scrape(url)
    const content = await scraper($)
    logSuccess(`[${name}] scraped successfully`)

    logInfo(`Writting [${name}] to database...`)
    await writeDbFile(name, content)
    logSuccess(`[${name}] written successfully`)
  } catch (e) {
    logError(`Error scraping [${name}]...`)
    logError(e)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    logInfo(`[${name}] scrape in ${time} seconds`)
  }
}

export function getTeamFromName({ name }) {
  const { presidentId, ...restOfTeam } = TEAMS.find((team) => team.name === name)
  const president = PRESIDENTS.find((president) => president.id === presidentId)
  return {
    ...restOfTeam,
    president
  }
}

export function getTeamImageFromTeamName({ name }) {
  const { image } = TEAMS.find((team) => team.name === name)
  return image
}

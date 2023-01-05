import * as cheerio from 'cheerio'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// import TEAMS from '../db/teams.json' assert { type: 'json' }
const DB_PATH = path.join(process.cwd(), 'db')
const DB_TEAMS_PATH = path.join(DB_PATH, 'teams.json')
const TEAMS = await readFile(DB_TEAMS_PATH, 'utf-8').then(JSON.parse)

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getLeaderBoard() {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
    goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
    cardsYellow: { selector: '.fs-table-text_8', typeOf: 'number' },
    cardsRed: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const getTeamFromName = ({ name }) => TEAMS.find((team) => team.name === name)

  const clearText = (text) =>
    text
      .replace(/\t|\n|\s:/g, '')
      .replace(/.*:/g, '')
      .trim()

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)
  const leaderBoard = []

  $rows.each((index, row) => {
    const $el = $(row)
    const leaderBoardEntries = leaderBoardSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text()
        const valueCleaned = clearText(rawValue)
        const value = typeOf === 'number' ? Number(valueCleaned) : valueCleaned

        return [key, value]
      }
    )

    const { team: teamName, ...leaderBoardTeam } =
      Object.fromEntries(leaderBoardEntries)
    const team = getTeamFromName({ name: teamName })

    leaderBoard.push({
      team,
      ...leaderBoardTeam
    })
  })

  return leaderBoard
}
const leaderBoard = await getLeaderBoard()
const filePath = path.join(DB_PATH, 'leaderboard.json')
await writeFile(filePath, JSON.stringify(leaderBoard, null, 2), 'utf-8')

import { getElementValue, getTeamFromName } from './utils.js'

export async function getLeaderboard($) {
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    losses: { selector: '.fs-table-text_5', typeOf: 'number' },
    goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
    goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
    cardsYellow: { selector: '.fs-table-text_8', typeOf: 'number' },
    cardsRed: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const leaderboardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)
  const leaderboard = []

  $rows.each((index, row) => {
    const $row = $(row)
    const leaderBoardEntries = leaderboardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const value = getElementValue($row, selector, typeOf)

      return [key, value]
    })

    const { team: teamName, ...leaderboardTeam } = Object.fromEntries(leaderBoardEntries)
    const team = getTeamFromName({ name: teamName })

    leaderboard.push({
      team,
      ...leaderboardTeam
    })
  })

  return leaderboard
}

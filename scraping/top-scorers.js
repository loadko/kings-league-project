import { getElementValue, getTeamImageFromTeamName } from './utils.js'

export async function getTopScorers($) {
  const $rows = $('table tbody tr')

  const TOP_SCORERS_SELECTORS = {
    teamName: { selector: '.fs-table-text_3', typeOf: 'string' },
    playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
    gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
    goals: { selector: '.fs-table-text_6', typeOf: 'number' }
  }

  const topScorersSelectorsEntries = Object.entries(TOP_SCORERS_SELECTORS)
  const topScorers = []

  $rows.each((index, row) => {
    const $row = $(row)
    const topScorerEntries = topScorersSelectorsEntries.map(([key, { selector, typeOf }]) => {
      const value = getElementValue($row, selector, typeOf)

      return [key, value]
    })

    const { teamName, ...topScorerData } = Object.fromEntries(topScorerEntries)
    const teamImage = getTeamImageFromTeamName({ name: teamName })

    topScorers.push({
      rank: index + 1,
      teamName,
      teamImage,
      ...topScorerData
    })
  })

  return topScorers
}

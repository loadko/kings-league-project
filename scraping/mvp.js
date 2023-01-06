import { TEAMS } from '../db/index.js'
import { clearText, getElementValue, getTeamImageFromTeamName } from './utils.js'

export async function getMvp($) {
  const $rows = $('table tbody tr')

  const MVP_SELECTORS = {
    teamName: { selector: '.fs-table-text_3', typeOf: 'string' },
    playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
    gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
    mvps: { selector: '.fs-table-text_6', typeOf: 'number' }
  }

  const mvpSelectorsEntries = Object.entries(MVP_SELECTORS)
  const mvp = []

  $rows.each((index, row) => {
    const $row = $(row)

    const mvpEntries = mvpSelectorsEntries.map(([key, { selector, typeOf }]) => {
      const value = getElementValue($row, selector, typeOf)

      return [key, value]
    })

    const { teamName, ...mvpData } = Object.fromEntries(mvpEntries)
    const teamImage = getTeamImageFromTeamName({ name: teamName })

    mvp.push({
      rank: index + 1,
      teamName,
      teamImage,
      ...mvpData
    })
  })

  return mvp
}

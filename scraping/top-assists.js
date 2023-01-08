import { getElementValue, getTeamImageFromTeamName } from './utils.js'

export async function getTopAssists($) {
  const $rows = $('table tbody tr')

  const TOP_ASSISTS_SELECTORS = {
    teamName: { selector: '.fs-table-text_3', typeOf: 'string' },
    playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
    gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
    assists: { selector: '.fs-table-text_6', typeOf: 'number' }
  }

  const topAssistsSelectorsEntries = Object.entries(TOP_ASSISTS_SELECTORS)
  const topAssists = []

  $rows.each((index, row) => {
    const $row = $(row)
    const topAssistsEntries = topAssistsSelectorsEntries.map(([key, { selector, typeOf }]) => {
      const value = getElementValue($row, selector, typeOf)

      return [key, value]
    })

    const { teamName, ...playerData } = Object.fromEntries(topAssistsEntries)
    const teamImage = getTeamImageFromTeamName({ name: teamName })

    topAssists.push({
      rank: index + 1,
      teamName,
      teamImage,
      ...playerData
    })
  })

  return topAssists
}

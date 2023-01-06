import { getElementValue, getTeamImageFromTeamName } from './utils.js'

export async function getAssists($) {
  const $rows = $('table tbody tr')

  const ASSISTS_SELECTORS = {
    teamName: { selector: '.fs-table-text_3', typeOf: 'string' },
    playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
    gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
    assists: { selector: '.fs-table-text_6', typeOf: 'number' }
  }

  const assistsSelectorsEntries = Object.entries(ASSISTS_SELECTORS)
  const assists = []

  $rows.each((index, row) => {
    const $row = $(row)
    const assistsEntries = assistsSelectorsEntries.map(([key, { selector, typeOf }]) => {
      const value = getElementValue($row, selector, typeOf)

      return [key, value]
    })

    const { teamName, ...playerData } = Object.fromEntries(assistsEntries)
    const teamImage = getTeamImageFromTeamName({ name: teamName })

    assists.push({
      rank: index + 1,
      teamName,
      teamImage,
      ...playerData
    })
  })

  return assists
}

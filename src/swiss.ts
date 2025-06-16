import cheerio from 'cheerio'
import he from 'he'
import { CONFIG, getPageBody, USER_AGENT } from './config'

function hasFilledBracket($: cheerio.Root): boolean {
  const logg = (input: string): void => console.log(`  [swiss] ${input}`)
  const selector = '.slotted-bracket-placeholder'

  const item = $(selector)
  if (!item || item.length <= 0) {
    return false
  }

  const jsonString = $(selector).attr('data-slotted-bracket-json')
  if (!jsonString) {
    return false
  }

  try {
    const decoded = he.decode(jsonString)
    if (!decoded) {
      logg('could not decode')

      return false
    }

    const json = JSON.parse(decoded)

    if (!json) {
      logg('no json after parse')

      return false
    }

    if (!('rounds' in json)) {
      logg('no rounds in json')

      return false
    }

    if (json.rounds.length !== 3) {
      logg('no 3 rounds')

      return false
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < json.rounds.length; i++) {
      const round = json.rounds[i]

      if (round.slots.length !== 4) {
        // eslint-disable-next-line no-continue
        continue
      }

      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < round.slots.length; j++) {
        const slot = round.slots[j]

        if (!('matchup' in slot)) {
          logg(`no matchup for round.slot (${i}.${j})`)

          return false
        }

        if (!slot.matchup.team1) {
          logg(`no team1 for round.slot (${i}.${j})`)

          return false
        }

        if (!slot.matchup.team2) {
          logg(`no team2 for round.slot (${i}.${j})`)

          return false
        }

        const team1id = slot.matchup.team1.team?.id ?? null
        const team2id = slot.matchup.team2.team?.id ?? null

        if (!team1id || !Number.isInteger(team1id) || team1id <= 0) {
          logg(`team1id falsy (${i}.${j}) (${team1id})`)

          return false
        }

        if (!team2id || !Number.isInteger(team2id) || team2id <= 0) {
          logg(`team2id falsy (${i}.${j}) (${team2id})`)

          return false
        }
      }
    }

    return true
  } catch (e) {
    console.error('Error in bracket parsing: ', e)

    return false
  }
}

export async function getSwiss(eventId: number, bodyHtml?: string) {
  const url = `${CONFIG.BASE}/events/${eventId}/major`
  try {
    const body = bodyHtml ?? (await getPageBody(url))

    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
    })

    const selector = '#GroupPlay'

    const swissHtml = $(selector).html()

    const hasBracket = hasFilledBracket($)

    const response = {
      hasBracket,
      swissHtml: btoa(swissHtml ?? ''),
    }

    if (!swissHtml) {
      const errors = [`userAgent: ${USER_AGENT}`, `body?.length: ${body?.length}`]
      console.log(`[matches] !matches.length. ${errors.join(', ')}`)
      if (body && body.length < 20000) {
        console.log(`body: ${body.toString()}`)
      }
    }

    return response
  } catch (error) {
    throw new Error(error as any)
  }
}

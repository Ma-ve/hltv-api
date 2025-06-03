import cheerio from 'cheerio'
import { CONFIG, getPageBody, MAPS, USER_AGENT } from './config'

interface IEvent {
  name: string
  logo: string
}

interface ITeam {
  name: string
  logo: string
}

interface IMatch {
  id: number
  time: string
  event: IEvent
  stars: number
  maps: string
  teams: ITeam[]
  isLive: boolean
}

export async function getMatches(
  eventId?: number,
  includeLiveMatches?: boolean,
  bodyHtml?: string
) {
  const url =
    eventId !== undefined
      ? `${CONFIG.BASE}/events/${eventId}/${CONFIG.MATCHES}`
      : `${CONFIG.BASE}/${CONFIG.MATCHES}`

  try {
    const body = bodyHtml ?? (await getPageBody(url))

    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
    })

    const selectors = ['.matches-list-wrapper .match']
    if (includeLiveMatches) {
      selectors.push('.liveMatches .liveMatch')
    }
    const allContent = $(selectors.join(','))
    const matches: IMatch[] = []

    allContent.map((_i, element) => {
      const el = $(element)

      const isLive = el.hasClass('liveMatch')
      const link = el.children('a').attr('href') as string
      const id = Number(link.split('/')[2])

      let time
      try {
        time = new Date(parseInt(el.find('.match-time').attr('data-unix')!, 10)).toISOString()
      } catch (err) {
        time = new Date().toISOString()
      }
      const event: IEvent = {
        name: el.find('.matchEventName')?.text(),
        logo: el.find('.matchEventLogo')?.attr('src') as string,
      }
      const stars = Number(
        el.find('.match-rating .fa-star:not(.faded)')?.length ??
          el.find('[data-stars]')?.attr('data-stars')
      )
      const map: keyof typeof MAPS = el.find('.match-meta').text() as any

      const teamsEl = el.find('.match-teams')

      // return just valid matches
      if (!teamsEl.html()) {
        return
      }

      let team1El
      let team2El

      if (isLive) {
        team1El = teamsEl.find('.match-team:first-child')
        team2El = teamsEl.find('.match-team:last-child')
      } else {
        team1El = teamsEl.find('.match-team.team1')
        team2El = teamsEl.find('.match-team.team2')
      }

      const team1 = {
        id: Number(isLive ? el.parent().attr('team1') : el.attr('team1')),
        name: team1El.find('.match-teamname').text() || /* istanbul ignore next */ 'n/a',
        logo: team1El.find('.match-team-logo').attr('src') as string,
      }

      const team2 = {
        id: Number(isLive ? el.parent().attr('team2') : el.attr('team2')),
        name: team2El.find('.match-teamname').text() || 'n/a',
        logo: team2El.find('.match-team-logo').attr('src') as string,
      }
      team1.id = Number.isNaN(team1.id) ? -1 : team1.id
      team2.id = Number.isNaN(team2.id) ? -1 : team2.id

      const response: IMatch = {
        id,
        time,
        event,
        stars,
        maps: MAPS[map] || map,
        teams: [team1, team2],
        isLive,
      }

      matches[matches.length] = response
    })

    if (!matches.length) {
      const errors = [
        `userAgent: ${USER_AGENT}`,
        `body?.length: ${body?.length}`,
        `allContent.html()?.length: ${allContent.html()?.length}`,
      ]
      console.log(`[matches] !matches.length. ${errors.join(', ')}`)
      if (body && body.length < 20000) {
        console.log(`body: ${body.toString()}`)
      }
    }

    return matches
  } catch (error) {
    throw new Error(error as any)
  }
}

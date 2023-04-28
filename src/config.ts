import UserAgent from 'user-agents'
import playwright from 'playwright'

export const CONFIG = {
  BASE: 'https://www.hltv.org',
  CDN: 'https://img-cdn.hltv.org',
  RSS: 'rss',
  RESULTS: 'results',
  MATCHES: 'matches',
  PLAYERS: 'stats/players',
  TEAMS: 'ranking/teams',
  TEAM: 'team',
}

export const MAPS = {
  trn: 'Train',
  mrg: 'Mirage',
  d2: 'Dust 2',
  inf: 'Inferno',
  vtg: 'Vertigo',
  ovp: 'Overpass',
  nuke: 'Nuke',
  anc: 'Ancient',
}

export const USER_AGENT = new UserAgent().toString()

export async function getPageBody(url: string): Promise<string> {
  const browser = await playwright.chromium.launch({
    headless: true,
  })
  const context = await browser.newContext({
    bypassCSP: true,
    userAgent: USER_AGENT,
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()
  await page.goto(url)

  const content = await page.content()

  await browser.close()

  return content
}

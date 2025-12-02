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

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0' // new UserAgent({ deviceCategory: 'mobile' }).toString()

export async function getPageBody(url: string): Promise<string> {
  const browser = await playwright.chromium.launch({
    headless: true,
  })
  const context = await browser.newContext({
    bypassCSP: true,
    userAgent: USER_AGENT,
    extraHTTPHeaders: {
      Referer: 'https://www.hltv.org/',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language':
        'Accept-Language: en-GB,en-US;q=0.9,en;q=0.7,nl-NL;q=0.6,nl;q=0.4,en-GB;q=0.3,en-US;q=0.1',
      DNT: '1',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      Pragma: 'nocache',
      'Cache-Control': 'no-cache',
      Cookie:
        'CookieConsent={stamp:%27Xw4C1MnpiCB2xXc/e6bmjEQYoYU3SAlj+s09Gnd4B435RuINjWXPDg==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:false%2Cmarketing:false%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1763021253920%2Cregion:%27nl%27}; MatchFilter={%22active%22:false%2C%22live%22:false%2C%22stars%22:1%2C%22lan%22:false%2C%22teams%22:[]}; _cfuvid=.4Mch7kNwSj3oLr.Zm9_TKrSU5HwbdyQ40VU.E58DQg-1764166115979-0.0.1.1-604800000; __cflb=02DiuJA2sEFmcj1ss4diFx2uKMeBKSYtUvA7FMzq8knwE; __cf_bm=Q09AlAnunyWdAXMA0ni.3pTT.zLsKiaRrqNG7CMWICg-1764684873-1.0.1.1-ZpDDliwQkPaC.JcWBgxIXoLW0Eo1Z4iPHpYNvvcmetA2xKnWHjr7OgpBOtdhqYQ8epzhkLePpRaAU_39TQEd3RskvKjFESFCBlzRoQ6FUjE',
    },
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()
  await page.goto(url, { timeout: 60 * 1000 })

  const content = await page.content()

  await browser.close()

  return content
}

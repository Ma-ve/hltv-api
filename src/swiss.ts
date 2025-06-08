import cheerio from 'cheerio'
import { CONFIG, getPageBody, USER_AGENT } from './config'

export async function getSwiss(eventId: number, bodyHtml?: string) {
  const url = `${CONFIG.BASE}/events/${eventId}/major`
  try {
    const body = bodyHtml ?? (await getPageBody(url))

    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
    })

    const selector = '#GroupPlay'

    const swissHtml = $(selector).html()

    const response = {
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

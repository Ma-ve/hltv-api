const line = (input) => {
  const date = new Date()

  console.log(`[${date.toISOString()}] ${input}`)
}

function makeEndpoints(app, HLTV) {
  app.get('/', async (_req, res) => {
    const news = await HLTV.getNews()
    res.json(news)
  })

  app.get('/results/:eventId', async (_req, res) => {
    const { eventId } = _req.params
    line(`Calling /results/${eventId}`)
    const results = await HLTV.getResults(eventId)
    line(`Called /results`)
    res.json(results)
  })

  app.get('/matches', async (_req, res) => {
    line(`Calling /matches`)
    const matches = await HLTV.getMatches()
    line(`Called /matches`)
    res.json(matches)
  })

  app.get('/matches/:eventId/:includeLiveMatches', async (req, res) => {
    const { eventId, includeLiveMatches } = req.params
    line(`Calling /matches/${eventId}/${includeLiveMatches}`)
    const matches = await HLTV.getMatches(eventId, !!includeLiveMatches)
    line(`Called /matches/${eventId}/${includeLiveMatches}`)
    res.json(matches)
  })

  app.get('/results/:matchId/stats', async (req, res) => {
    const { matchId } = req.params
    line(`Calling /results/${matchId}/stats`)
    const match = await HLTV.getMatchById(matchId)
    line(`Called /results/${matchId}/stats`)
    res.json(match)
  })

  app.get('/liveMatch/:matchId', async (req, res) => {
    const { matchId } = req.params
    line(`Calling /liveMatch/${matchId}`)
    const match = await HLTV.getLiveMatchById(matchId)
    line(`Called /liveMatch/${matchId}`)
    res.json(match)
  })

  app.get('/players', async (_req, res) => {
    const players = await HLTV.getTopPlayers()
    res.json(players)
  })

  app.get('/players/:playerId', async (req, res) => {
    const { playerId } = req.params
    const player = await HLTV.getPlayerById(playerId)
    res.json(player)
  })

  app.get('/teams', async (_req, res) => {
    const teams = await HLTV.getTopTeams()
    res.json(teams)
  })

  app.get('/teams/:teamId', async (req, res) => {
    const { teamId } = req.params
    const team = await HLTV.getTeamById(Number(teamId))
    res.json(team)
  })

  app.get('/swiss/:eventId', async (req, res) => {
    const { eventId } = req.params
    line(`Calling /swiss/${eventId}`)
    const swiss = await HLTV.getSwiss(eventId)
    line(`Called /swiss/${eventId}`)
    res.json(swiss)
  })
}

module.exports = makeEndpoints

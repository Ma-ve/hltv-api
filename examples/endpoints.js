function makeEndpoints(app, HLTV) {
  app.get('/', async (_req, res) => {
    const news = await HLTV.getNews()
    res.json(news)
  })

  app.get('/results', async (_req, res) => {
    console.log(`Calling /results`)
    const results = await HLTV.getResults()
    console.log(`Called /results`)
    res.json(results)
  })

  app.get('/matches', async (_req, res) => {
    console.log(`Calling /matches`)
    const matches = await HLTV.getMatches()
    console.log(`Called /matches`)
    res.json(matches)
  })

  app.get('/matches/:eventId/:includeLiveMatches', async (req, res) => {
    const { eventId, includeLiveMatches } = req.params
    console.log(`Calling /matches/${eventId}/${includeLiveMatches}`)
    const matches = await HLTV.getMatches(eventId, !!includeLiveMatches)
    console.log(`Called /matches/${eventId}/${includeLiveMatches}`)
    res.json(matches)
  })

  app.get('/results/:matchId/stats', async (req, res) => {
    const { matchId } = req.params
    console.log(`Calling /results/${matchId}/stats`)
    const match = await HLTV.getMatchById(matchId)
    console.log(`Called /results/${matchId}/stats`)
    res.json(match)
  })

  app.get('/liveMatch/:matchId', async (req, res) => {
    const { matchId } = req.params
    console.log(`Calling /liveMatch/${matchId}`)
    const match = await HLTV.getLiveMatchById(matchId)
    console.log(`Called /liveMatch/${matchId}`)
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
    console.log(`Calling /swiss/${eventId}`)
    const swiss = await HLTV.getSwiss(eventId)
    console.log(`Called /matches/${eventId}`)
    res.json(swiss)
  })
}

module.exports = makeEndpoints

import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'
import topScorers from '../db/top-scorers.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns the teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents'
    },
    {
      endpoint: '/top-scorers',
      description: 'Returns Kings League top scorers'
    }
  ])
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
  const id = ctx.req.param('id')
  const team = teams.find((team) => team.id === id)
  return team ? ctx.json(team) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const president = presidents.find((president) => president.id === id)
  return president ? ctx.json(president) : ctx.json({ message: 'President not found' }, 404)
})

app.get('/top-scorers', (ctx) => ctx.json(topScorers))

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((ctx) => {
  const url = ctx.req.url
  const { pathname } = new URL(url)

  if (pathname.at(-1) === '/') {
    return ctx.redirect(pathname.slice(0, -1))
  }

  return ctx.json({ message: 'Not found' }, 404)
})

export default app

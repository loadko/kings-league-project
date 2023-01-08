import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'
import topScorers from '../db/top-scorers.json'
import topAssists from '../db/top-assists.json'
import mvp from '../db/mvp.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns Kings League leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns Kings League teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns Kings League presidents'
    },
    {
      endpoint: '/top-scorers',
      description: 'Returns Kings League top scorers'
    },
    {
      endpoint: '/top-assists',
      description: 'Returns Kings League top assists'
    },
    {
      endpoint: '/mvp',
      description: 'Returns Kings League Most Valuable Players'
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

app.get('/mvp', (ctx) => ctx.json(mvp))

app.get('/top-scorers', (ctx) => ctx.json(topScorers))

app.get('/top-assists', (ctx) => ctx.json(topAssists))

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

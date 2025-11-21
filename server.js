// server.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import process from 'node:process'
import { generateSitemap } from './generateSitemap.js'
dotenv.config()

const DISABLE_SSR =
  process.env.DISABLE_SSR === '1' || process.env.DISABLE_SSR === 'true'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createDevServer() {
  const app = express()
  const vite = await (
    await import('vite')
  ).createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    if (req.originalUrl === '/sitemap.xml') {
      const sitemap = await generateSitemap()
      return res
        .status(200)
        .set({ 'Content-Type': 'application/xml' })
        .end(sitemap)
    }
    try {
      const templateHtml = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )

      const template = await vite.transformIndexHtml(
        req.originalUrl,
        templateHtml,
      )

      if (DISABLE_SSR) {
        const html = template.replace(`<!--ssr-outlet-->`, '')
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      }

      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      const appHtml = await render(req)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  return app
}

async function createProdServer() {
  const app = express()

  app.use((await import('compression')).default())
  app.use(
    (await import('serve-static')).default(
      path.resolve(__dirname, 'dist/client'),
      { index: false },
    ),
  ),
    app.use('*', async (req, res, next) => {
      if (req.originalUrl === '/sitemap.xml') {
        const sitemap = await generateSitemap()
        return res
          .status(200)
          .set({ 'Content-Type': 'application/xml' })
          .end(sitemap)
      }
      try {
        const templateHtml = fs.readFileSync(
          path.resolve(__dirname, 'dist/client/index.html'),
          'utf-8',
        )
        const render = (await import('./dist/server/entry-server.js')).render
        const appHtml = await render(req)
        const html = templateHtml.replace(`<!--ssr-outlet-->`, appHtml)
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e) {
        next(e)
      }
    })

  return app
}

const port = process.env.PORT || 5173

if (process.env.NODE_ENV === 'production') {
  const app = await createProdServer()
  app.listen(port, () => {
    console.log(`SSR production server running: http://localhost:${port}`)
  })
} else {
  const app = await createDevServer()
  app.listen(port, () => {
    console.log(`SSR dev server running: http://localhost:${port}`)
  })
}

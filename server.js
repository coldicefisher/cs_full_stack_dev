// server.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
import process from 'node:process'
dotenv.config()

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
    try {
      const templateHtml = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )

      const template = await vite.transformIndexHtml(
        req.originalUrl,
        templateHtml,
      )

      // NOTE: .jsx here
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

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5173
  const app = await createDevServer()
  app.listen(port, () => {
    console.log(`SSR dev server running: http://localhost:${port}`)
  })
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

if (process.env.NODE_ENV === 'production') {
  const app = await createProdServer()
  app.listen(process.env.PORT, () => {
    console.log(
      `SSR production server running on http://
    localhost:${process.env.PORT}`,
    )
  })
} else {
  console.log('Running outside production mode')
  const app = await createDevServer()
  app.listen(process.env.PORT, () => {
    console.log(
      `SSR development server running on http://localhost:${process.env.PORT}`,
    )
  })
}

export { createDevServer, createProdServer }

// import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import express from 'express'
// import dotenv from 'dotenv'
// dotenv.config()
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// async function createDevServer() {
//   const app = express()
//   const vite = await (
//     await import('vite')
//   ).createServer({
//     server: { middlewareMode: true },
//     appType: 'custom',
//   })
//   app.use(vite.middlewares)
//   app.use('*', async (req, res, next) => {
//     try {
//       const templateHtml = fs.readFileSync(
//         path.resolve(__dirname, 'index.html'),
//         'utf-8',
//       )
//       const { render } = await vite.ssrLoadModule('/src/entry-server.js')
//       const appHtml = await render(req)
//       const html = templateHtml.replace(`<!--ssr-outlet-->`, appHtml)
//     } catch (e) {
//       vite.ssrFixStacktrace(e)
//       next(e)
//     }
//   })
// }

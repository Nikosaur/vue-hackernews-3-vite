import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express, { Request, Response, NextFunction } from 'express'
import compression from 'compression'
import serveStatic from 'serve-static'
import type { ViteDevServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 5173)
const base = process.env.BASE || '/'

const resolve = (p: string) => path.resolve(__dirname, p)

// Type untuk render function
type RenderFunction = (url: string) => Promise<{ html: string; state: any }>

async function createServer() {
  const app = express()

  let vite: ViteDevServer | undefined
  let render: RenderFunction

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { port: 24678 }
      },
      appType: 'custom',
      base
    })

    app.use(vite.middlewares)

    render = async (url: string) => {
      try {
        let template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite!.transformIndexHtml(url, template)
        const { render: ssrRender } = await vite!.ssrLoadModule('/src/entry-server.ts')
        return await ssrRender(url)
      } catch (e) {
        vite!.ssrFixStacktrace(e as Error)
        throw e
      }
    }
  } else {
    app.use(compression())
    app.use(
      base,
      serveStatic(resolve('dist/client'), {
        index: false,
        maxAge: '1y'
      })
    )

    // Import the production build
    const serverModule = await import(resolve('dist/server/entry-server.js'))
    render = serverModule.render as RenderFunction
  }

  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl.replace(base, '')

    try {
      const template = isProduction
        ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : fs.readFileSync(resolve('index.html'), 'utf-8')

      const { html: appHtml, state } = await render(url)

      const html = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(
          `<!--app-state-->`,
          `<script>window.__INITIAL_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')}</script>`
        )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
      if (!isProduction && vite) vite.ssrFixStacktrace(e)
      console.error(e.stack)

      if (e?.code === 404) {
        res.status(404).end('404 | Page Not Found')
      } else if (e?.url) {
        res.redirect(e.url)
      } else {
        res.status(500).end(
          isProduction ? '500 | Internal Server Error' : `<pre>${e.stack}</pre>`
        )
      }
    }
  })

  return { app, vite }
}

createServer().then(({ app }) => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
})
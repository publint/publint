import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

/**
 * Serve /analysis.json in dev (Handled as Cloudflare worker in prod)
 * @returns {import('vite').Plugin}
 */
export function publintAppInput() {
  return {
    name: 'publint-app-input',
    apply: 'build',
    config(opts) {
      if (opts.build.ssr === false) {
        return {
          build: {
            rollupOptions: {
              input: {
                'publint-app': r('../src/app/app.js'),
              },
            },
          },
        }
      }
    },
  }
}

export async function updateBuildIndexHtml() {
  // Replace __APP_URL__ in dist/index.html with dist/assets/publint-app.[hash].js
  const indexHtml = await fs.readFile(r('../dist/index.html'), 'utf-8')
  const assetsDir = await fs.readdir(r('../dist/assets'))
  const appJs = assetsDir.find(
    (f) => f.startsWith('publint-app.') && f.endsWith('.js'),
  )
  if (!appJs) throw new Error('Cannot find dist/assets/publint-app.[hash].js')
  await fs.writeFile(
    r('../dist/index.html'),
    indexHtml
      .replace('__APP_URL__', '/assets/' + appJs)
      // Also remove the vitepress app that's messing with navigation
      .replace(
        /<script type="module" src="\/assets\/app\..+\.js"><\/script>/,
        '',
      ),
  )
}

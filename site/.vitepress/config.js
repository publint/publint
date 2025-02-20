import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import unocss from '@unocss/vite'
import corePackageJson from '../../packages/publint/package.json' with { type: 'json' }
import { serveAnalysisJson } from '../scripts/vitePluginAnalysisJson.js'
import { publintApi } from '../scripts/vitePluginPublintApi.js'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

const ogTitle = 'publint'
const ogDescription =
  'Lint npm packages to ensure the widest compatibility across environments'
const version = corePackageJson.version

export default defineConfig({
  srcDir: r('../src/pages'),
  outDir: r('../dist'),
  cacheDir: r('../node_modules/.vitepress'),
  cleanUrls: true,

  title: ogTitle,
  description: ogDescription,
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'description', content: ogDescription }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      { property: 'og:image', content: 'https://publint.dev/og-image.png' },
    ],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  themeConfig: {
    logo: '/favicon.png',
    search: {
      provider: 'local',
    },
    editLink: {
      pattern:
        'https://github.com/publint/publint/edit/master/site/src/pages/:path',
      text: 'Suggest changes to this page',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/publint/publint' },
    ],
    sidebar: [
      { text: 'Getting started', link: '/docs/' },
      { text: 'CLI', link: '/docs/cli' },
      { text: 'JavaScript API', link: '/docs/javascript-api' },
      { text: 'Comparisons', link: '/docs/comparisons' },
    ],
    nav: [
      { text: 'Docs', link: '/docs/', activeMatch: '/docs/' },
      { text: 'Lint rules', link: '/rules' },
      {
        text: `v${version}`,
        items: [
          {
            items: [
              {
                text: `v${version}`,
                link: `https://github.com/publint/publint/releases/tag/v${version}`,
              },
              {
                text: 'Releases notes',
                link: 'https://github.com/publint/publint',
              },
              {
                text: 'Contributing',
                link: 'https://github.com/publint/publint/blob/master/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
    ],
    outline: {
      level: [2, 3],
    },
  },

  vite: {
    envDir: r('../'),
    publicDir: r('../public'),
    optimizeDeps: {
      // Vite's scanner doesn't scan references via `new URL(...)`.
      // In this app, we import the worker with the syntax, so manually add the worker for now.
      // TODO: Fix this in Vite
      entries: ['../app/**/*.{vue,svelte}', '../app/utils/worker.js'],
    },
    esbuild: {
      legalComments: 'none',
    },
    plugins: [
      unocss({ inspector: false }),
      svelte(),
      serveAnalysisJson(),
      publintApi(),
    ],
  },

  async buildEnd() {
    // Delete the 404 page as we want the index.html to be an SPA
    await fs.rm(r('../dist/404.html'))

    // Delete the temp folder inherited from the public folder
    await fs.rm(r('../dist/temp'), { recursive: true, force: true })
  },
})

import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import unocss from '@unocss/vite'
import { serveAnalysisJson } from '../scripts/vitePluginAnalysisJson.js'
import { spaFallback } from '../scripts/vitePluginSpaFallback.js'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

const ogTitle = 'publint'
const ogDescription =
  'Lint npm packages to ensure the widest compatibility across environments'

export default defineConfig({
  srcDir: './src/pages',
  outDir: '../dist',
  cacheDir: '../node_modules/.vitepress',
  sidebar: {
    '/guide/': [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Getting Started',
            link: '/guide/',
          },
          {
            text: 'Philosophy',
            link: '/guide/philosophy',
          },
          {
            text: 'Why Vite',
            link: '/guide/why',
          },
        ],
      },
      {
        text: 'Guide',
        items: [
          {
            text: 'Features',
            link: '/guide/features',
          },
          {
            text: 'CLI',
            link: '/guide/cli',
          },
          {
            text: 'Using Plugins',
            link: '/guide/using-plugins',
          },
          {
            text: 'Dependency Pre-Bundling',
            link: '/guide/dep-pre-bundling',
          },
          {
            text: 'Static Asset Handling',
            link: '/guide/assets',
          },
          {
            text: 'Building for Production',
            link: '/guide/build',
          },
          {
            text: 'Deploying a Static Site',
            link: '/guide/static-deploy',
          },
          {
            text: 'Env Variables and Modes',
            link: '/guide/env-and-mode',
          },
          {
            text: 'Server-Side Rendering (SSR)',
            link: '/guide/ssr',
          },
          {
            text: 'Backend Integration',
            link: '/guide/backend-integration',
          },
          {
            text: 'Troubleshooting',
            link: '/guide/troubleshooting',
          },
          {
            text: 'Performance',
            link: '/guide/performance',
          },
          {
            text: 'Migration from v5',
            link: '/guide/migration',
          },
          {
            text: 'Breaking Changes',
            link: '/changes/',
          },
        ],
      },
      {
        text: 'APIs',
        items: [
          {
            text: 'Plugin API',
            link: '/guide/api-plugin',
          },
          {
            text: 'HMR API',
            link: '/guide/api-hmr',
          },
          {
            text: 'JavaScript API',
            link: '/guide/api-javascript',
          },
          {
            text: 'Config Reference',
            link: '/config/',
          },
        ],
      },
      {
        text: 'Environment API',
        items: [
          {
            text: 'Introduction',
            link: '/guide/api-environment',
          },
          {
            text: 'Environment Instances',
            link: '/guide/api-environment-instances',
          },
          {
            text: 'Plugins',
            link: '/guide/api-environment-plugins',
          },
          {
            text: 'Frameworks',
            link: '/guide/api-environment-frameworks',
          },
          {
            text: 'Runtimes',
            link: '/guide/api-environment-runtimes',
          },
        ],
      },
    ],
  },

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
    editLink: {
      pattern:
        'https://github.com/publint/publint/edit/master/site/src/pages/docs/:path',
      text: 'Suggest changes to this page',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/publint/publint' },
    ],
  },

  vite: {
    publicDir: r('../public'),
    optimizeDeps: {
      // Vite's scanner doesn't scan references via `new URL(...)`.
      // In this app, we import the worker with the syntax, so manually add the worker for now.
      // TODO: Fix this in Vite
      entries: ['./src/app/**/*.svelte', './src/app/utils/worker.js'],
    },
    plugins: [
      unocss({ inspector: false }),
      svelte(),
      // spaFallback(),
      serveAnalysisJson(),
    ],
    esbuild: {
      legalComments: 'none',
    },
  },
})

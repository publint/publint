import { preview } from 'vite'
import { serveAnalysisJson } from './vitePluginAnalysisJson.js'

// Use Vite's preview server instead of VitePress as it requires a 404.html, and we don't want that
const server = await preview({
  configFile: false,
  plugins: [serveAnalysisJson()],
})
server.printUrls()
server.bindCLIShortcuts({ print: true })

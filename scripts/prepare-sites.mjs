import { copyFile, mkdir, rename, writeFile } from 'node:fs/promises'

await mkdir('dist/client', { recursive: true })
await rename('dist/index.html', 'dist/client/index.html')
await rename('dist/assets', 'dist/client/assets')
await mkdir('dist/server', { recursive: true })
await mkdir('dist/.openai', { recursive: true })
await copyFile('.openai/hosting.json', 'dist/.openai/hosting.json')
await writeFile(
  'dist/server/index.js',
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) return response
    const url = new URL(request.url)
    if (url.pathname.includes('.')) return response
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
  }
}
`,
)

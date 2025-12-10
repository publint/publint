import { publint } from 'publint'
import getNpmTarballUrl from 'get-npm-tarball-url'
import { isLocalPkg } from './common'
import { VITE_NPM_REGISTRY } from './constants'

self.addEventListener('message', async (e) => {
  const { npmPkgName, npmPkgVersion, isPkgPrNew, pkgPrNewScope } = e.data

  let tarballUrl
  if (isLocalPkg(npmPkgName)) {
    tarballUrl = new URL(`/temp/${npmPkgName}-${npmPkgVersion}.tgz`, self.location.href).href
  } else if (isPkgPrNew) {
    const scope = pkgPrNewScope ? `${pkgPrNewScope}/` : ''
    tarballUrl = `https://pkg.pr.new/${scope}${npmPkgName}@${npmPkgVersion}`
  } else {
    tarballUrl = getNpmTarballUrl(npmPkgName, npmPkgVersion, {
      registry: VITE_NPM_REGISTRY,
    })
  }

  postMessage({ type: 'status', data: 'Fetching package...' })
  /** @type {Response} */
  let response
  try {
    response = await fetch(tarballUrl)
  } catch (e) {
    postMessage({ type: 'error', data: 'Package not found' })
    console.error(e)
    return
  }

  if (response.body == null) {
    postMessage({ type: 'error', data: 'Package response has no body' })
    return
  }

  postMessage({ type: 'status', data: 'Linting package...' })
  /** @type {import('publint').Message[]} */
  let messages
  /** @type {Record<string, any>} */
  let pkgJson
  try {
    const result = await publint({ pack: { tarball: response.body } })
    messages = result.messages
    pkgJson = result.pkg
  } catch (e) {
    postMessage({ type: 'error', data: 'Failed to lint package' })
    console.error(e)
    return
  }

  postMessage({
    type: 'result',
    data: {
      messages,
      pkgJson,
    },
  })
})

self.addEventListener('unhandledrejection', () => {
  postMessage({ type: 'error' })
})

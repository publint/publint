/**
 * @param {string} link
 */
export function isNpmUrl(link) {
  try {
    const url = new URL(link)
    return url.hostname === 'www.npmjs.com' && url.pathname.startsWith('/package/')
  } catch {
    return false
  }
}

/**
 * @param {string} link
 */
export function isPkgPrNewUrl(link) {
  try {
    const url = new URL(link)
    return url.hostname === 'pkg.pr.new'
  } catch {
    return false
  }
}

/**
 * @param {string} url
 */
export function normalizeGitUrl(url) {
  url = url
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/(^|\/)[^/]+?@/, '$1') // remove "user@" from "ssh://user@host.com:..."
    .replace(/(\.[^.]+?):/, '$1/') // change ".com:" to ".com/" from "ssh://user@host.com:..."
    .replace(/^git:\/\//, 'https://')
    .replace(/^ssh:\/\//, 'https://')
  if (url.startsWith('github:')) {
    return `https://github.com/${url.slice(7)}`
  } else if (url.startsWith('gitlab:')) {
    return `https://gitlab.com/${url.slice(7)}`
  } else if (url.startsWith('bitbucket:')) {
    return `https://bitbucket.org/${url.slice(10)}`
  } else if (!url.includes(':') && url.split('/').length === 2) {
    return `https://github.com/${url}`
  } else {
    return url.includes('://') ? url : `https://${url}`
  }
}

/**
 * @param {import("../index.d.ts").PackFile[]} files
 * @return {import("./core.js").Vfs}
 * */
export function createTarballVfs(files) {
  /** @type {TextDecoder | undefined} */
  let decoder

  return {
    getDirName: (path) => path.replace(/\/[^/]*$/, ''),
    getExtName: (path) => path.replace(/^.*\./, '.'),
    isPathDir: async (path) => {
      path = path.endsWith('/') ? path : path + '/'
      return files.some((file) => file.name.startsWith(path))
    },
    isPathExist: async (path) => {
      const pathDirVariant = path.endsWith('/') ? path : path + '/'
      return files.some((file) => file.name === path || file.name.startsWith(pathDirVariant))
    },
    pathJoin: (...parts) => parts.join('/').replace(/\/(\.?\/){1,}/g, '/'),
    pathRelative: (from, to) => to.replace(from, '').slice(1),
    readDir: async (path) => {
      path = path.endsWith('/') ? path : path + '/'
      /** @type {string[]} */
      const items = []
      for (const file of files) {
        if (file.name.startsWith(path) && file.name !== path) {
          const item = file.name.slice(path.length).replace(/\/.*$/, '')
          if (!items.includes(item)) {
            items.push(item)
          }
        }
      }
      return items
    },
    readFile: async (path) => {
      const file = files.find((file) => file.name === path)
      if (!file) throw new Error(`Unable to read file at path: ${path}`)
      if (typeof file.data === 'string') {
        return file.data
      } else {
        decoder ??= new TextDecoder()
        return decoder.decode(file.data)
      }
    },
  }
}

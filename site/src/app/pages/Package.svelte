<script>
  import { onDestroy, onMount } from 'svelte'
  import githubLogo from '../../assets/github.svg?url'
  import gitlabLogo from '../../assets/gitlab.svg?url'
  import gitLogo from '../../assets/git.svg?url'
  import npmLogo from '../../assets/npm.svg?url'
  import pkgPrNewLogo from '../../assets/stackblitz.svg?url'
  import jsdelivrLogo from '../../assets/jsdelivr.svg?url'
  import Header from '../components/Header.svelte'
  import Label from '../components/Label.svelte'
  import Loading from '../components/Loading.svelte'
  import NpmSearchInput from '../components/NpmSearchInput.svelte'
  import PackageVersion from '../components/PackageVersion.svelte'
  import PkgNode from '../components/PkgNode.svelte'
  import { isLocalPkg } from '../utils/common'
  import { url } from '../utils/url'
  import { VITE_NPM_REGISTRY } from '../utils/constants'
  import { normalizeGitUrl } from '../utils/registry'

  let npmPkgName = $state()
  let npmPkgVersion = $state()

  // Fetch latest version if not specified
  let versionFetched = $state(false)

  /** @type {Worker} */
  let worker

  /** @type {{pkgJson: Record<string, any>, messages: import('publint').Message[]} | undefined} */
  let result = $state()
  let error = $state('')
  let status = $state('')

  onMount(() => {
    // Always scroll to the top when first navigating to this page
    window.scrollTo({ top: 0, behavior: 'instant' })
  })

  onDestroy(() => {
    if (worker) {
      worker.terminate()
    }
  })

  function createWorker() {
    const worker = new Worker(new URL('../utils/worker.js', import.meta.url), {
      type: 'module',
    })

    worker.addEventListener('message', (e) => {
      const message = e.data
      if (message.type === 'status') {
        status = message.data
      } else if (message.type === 'result') {
        result = message.data
      } else if (message.type === 'error') {
        error = message.data
      }
    })
    worker.addEventListener('error', () => {
      error = 'Error processing package'
    })
    return worker
  }

  /**
   * @param {string | Record<string, string> | undefined} repository
   */
  function extractRepoUrl(repository) {
    if (!repository) return

    const gitUrl = typeof repository === 'string' ? repository : repository.url
    const repoUrl = normalizeGitUrl(gitUrl)

    if (repoUrl.includes('github.com')) {
      return { logo: githubLogo, url: repoUrl }
    } else if (repoUrl.includes('gitlab.com')) {
      return { logo: gitlabLogo, url: repoUrl }
    } else if (repoUrl) {
      return { logo: gitLogo, url: repoUrl }
    }
  }

  let isPkgPrNew = $state(false)
  let pkgPrNewScope = $state('') // 'org/repo' if have

  $effect(() => {
    // $url.pathname possible values:
    // /foo
    // /foo@1.0.0
    // /@foo/bar@1.0.0
    // /pkg.pr.new/foo@1.0.0
    // /pkg.pr.new/@foo/bar@1.0.0
    // /pkg.pr.new/org/repo/foo@1.0.0
    // /pkg.pr.new/org/repo/@foo/bar@1.0.0
    const pathname = $url.pathname

    isPkgPrNew = pathname.startsWith('/pkg.pr.new/')

    // e.g. `foo@1.0.0` or `@foo/bar@1.0.0`
    let packageSpecifier
    if (isPkgPrNew) {
      const parts = pathname.slice(12).split('/')
      // handle `org/repo/@foo/bar@1.0.0` and `@foo/bar@1.0.0`
      if (parts[parts.length - 2]?.startsWith('@')) {
        packageSpecifier = parts.slice(-2).join('/')
        pkgPrNewScope = parts.slice(0, -2).join('/')
      }
      // handle `org/repo/foo@1.0.0`
      else if (parts.length >= 3) {
        packageSpecifier = parts[parts.length - 1]
        pkgPrNewScope = parts.slice(0, -1).join('/')
      }
      // handle `foo@1.0.0`
      else {
        packageSpecifier = parts[parts.length - 1]
        pkgPrNewScope = ''
      }
    } else {
      packageSpecifier = pathname.slice(1)
      pkgPrNewScope = ''
    }
    const parts = packageSpecifier.split('@')
    if (parts[0] === '') {
      parts.shift()
      parts[0] = '@' + parts[0]
    }
    npmPkgName = parts[0]
    npmPkgVersion = isLocalPkg(npmPkgName) ? '0.0.1' : parts[1]

    // when pkg updates, reset results
    versionFetched = false
    result = undefined
    status = ''
  })

  $effect(() => {
    if (npmPkgVersion) {
      versionFetched = true
    } else if (isPkgPrNew) {
      error = 'pkg.pr.new links require a version explicitly set in the url'
    } else {
      fetch(`${VITE_NPM_REGISTRY}/${encodeURIComponent(npmPkgName)}/latest`)
        .then(async (res) => {
          const result = await res.json()
          if (typeof result === 'string') {
            error = result
            return
          }
          if (result?.version) {
            url.replace(`/${npmPkgName}@${result.version}`)
          }
        })
        .finally(() => {
          versionFetched = true
        })
    }
  })

  $effect(() => {
    if (npmPkgName && npmPkgVersion) {
      if (!worker) worker = createWorker()
      error = ''
      status = ''
      worker.postMessage({
        npmPkgName,
        npmPkgVersion,
        isPkgPrNew,
        pkgPrNewScope,
      })
    }
  })

  let suggestionCount = $derived(result?.messages.filter((v) => v.type === 'suggestion').length)
  let warningCount = $derived(result?.messages.filter((v) => v.type === 'warning').length)
  let errorCount = $derived(result?.messages.filter((v) => v.type === 'error').length)

  // Add debug logs for future self
  $effect(() => {
    if (result?.messages) {
      console.debug('publint messages:', $state.snapshot(result).messages)
    }
  })

  let repo = $derived(
    result?.pkgJson?.repository ? extractRepoUrl(result?.pkgJson?.repository) : undefined,
  )
  let npmUrl = $derived(
    `https://www.npmjs.com/package/${npmPkgName}${npmPkgVersion ? `/v/${npmPkgVersion}` : ''}`,
  )
  let jsdelivrUrl = $derived(`https://www.jsdelivr.com/package/npm/${npmPkgName}`)
</script>

<svelte:head>
  <!-- prettier-ignore -->
  <title>{npmPkgName} - {npmPkgVersion ? npmPkgVersion + ' - ' : ''} publint</title>
</svelte:head>

<main class="flex flex-col items-center min-h-screen p-4">
  <Header />
  {#if npmPkgName}
    <h1 class="text-8 mt-10 mb-0 font-600">
      {npmPkgName}
      {#if !error}
        <PackageVersion version={npmPkgVersion} pkgName={npmPkgName} {isPkgPrNew} />
      {/if}
    </h1>

    <p class="flex flex-row justify-center items-end gap-4 mt-4 mb-10">
      {#if repo}
        <a class="inline-block rounded @light:filter-invert" href={repo.url}>
          <img class="block h-[20px]" src={repo.logo} alt="repo logo" height="20" />
        </a>
      {:else}
        <span class="w-5 h-5"></span>
      {/if}

      {#if !isPkgPrNew}
        <a class="inline-block rounded" href={npmUrl}>
          <img class="block h-[18px]" src={npmLogo} alt="npm logo" height="18" />
        </a>

        <a class="inline-block rounded bg-gray" href={jsdelivrUrl}>
          <img class="block h-[20px]" src={jsdelivrLogo} alt="jsdelivr logo" height="20" />
        </a>
      {:else}
        {@const scope = pkgPrNewScope ? `${pkgPrNewScope}/` : ''}
        <a
          class="inline-block rounded"
          href={`https://pkg.pr.new/${scope}${npmPkgName}@${npmPkgVersion}`}
        >
          <img class="block h-[18px]" src={pkgPrNewLogo} alt="pkg.pr.new logo" height="18" />
        </a>
      {/if}
    </p>

    <NpmSearchInput {npmPkgName} />
    {#if result}
      <section class="mt-4 flex justify-center items-center gap-4">
        {#if result.messages.length <= 0}
          <Label type="success">All good 🎉</Label>
        {:else}
          {#if suggestionCount}
            <Label type="suggestion">
              {suggestionCount} suggestion{suggestionCount === 1 ? '' : 's'}
            </Label>
          {/if}
          {#if warningCount}
            <Label type="warning">
              {warningCount} warning{warningCount === 1 ? '' : 's'}
            </Label>
          {/if}
          {#if errorCount}
            <Label type="error">
              {errorCount} error{errorCount === 1 ? '' : 's'}
            </Label>
          {/if}
        {/if}
      </section>
      <section class="w-full max-w-3xl my-4 bg-gray-200 dark:bg-gray-900 rounded-md">
        <p class="px-4 py-2 m-0 bg-gray-300 dark:bg-gray-800 font-mono text-sm font-bold">
          package.json
        </p>
        <pre
          class="relative w-full px-4 py-3 m-0 whitespace-normal text-sm md:text-base overflow-x-auto overflow-y-hidden">
          <ul class="m-0 p-0 list-none">
            <PkgNode value={result.pkgJson} messages={result.messages} pkg={result.pkgJson} />
          </ul>
        </pre>
      </section>
    {:else}
      <section class="text-center py-8 opacity-70">
        {#if error}
          <p>{error}</p>
        {:else}
          <Loading />
          <p>{status}</p>
        {/if}
      </section>
    {/if}
  {:else if versionFetched}
    <h1>Package not found</h1>
    <NpmSearchInput {npmPkgName} />
  {/if}
</main>

<script>
  import Analysis from '../components/Analysis.svelte'
  import Logo from '../components/Logo.svelte'
  import NpmSearchInput from '../components/NpmSearchInput.svelte'
  import HomeBackground from '../components/HomeBackground.svelte'

  /** @type {Record<string, number> | undefined} */
  let analysis = $state()

  fetch('/analysis.json')
    .then(async (res) => {
      analysis = await res.json()
    })
    .catch((e) => {
      // best effort. simply log if fail
      console.log(e)
    })

  const links = [
    {
      href: '/docs/',
      text: 'Docs',
    },
    {
      href: '/rules',
      text: 'Lint rules',
    },
    {
      href: 'https://github.com/publint/publint',
      text: 'GitHub',
    },
  ]
</script>

<svelte:head>
  <title>publint</title>
</svelte:head>

<main class="flex flex-col items-center {analysis ? '' : 'min-h-screen'}">
  <HomeBackground />
  <section class="main-section flex flex-col items-center w-full px-8 mb-10">
    <Logo />
    <NpmSearchInput autofocus />
    <p class="vp-doc flex my-8">
      {#each links as { href, text }, i}
        <a class="not-hover:text-inherit! decoration-none!" {href}>
          {text}
        </a>
        {#if i !== links.length - 1}
          <strong class="mx-2">·</strong>
        {/if}
      {/each}
    </p>
  </section>
  {#if analysis}
    <Analysis results={analysis} />
  {/if}
</main>

<style>
  /*
    try to center the main section with a margin. not using flex center trick since we want the
    Analysis component to also flow naturally pass the page.

    the main section is 280px average (or 17.5rem), but increase to 19rem so the search input is
    slightly higher.
  */
  .main-section {
    margin-top: max(calc((100vh - 19rem) / 2), 2rem);
  }
</style>

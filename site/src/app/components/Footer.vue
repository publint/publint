<template>
  <footer
    id="app-footer"
    class="vp-doc bg-gray-300 text-dark dark:bg-gray-800 dark:text-white py-8"
  >
    <div class="mb-2 px-8 flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-8">
      <section class="md:w-1/2 mb-2">
        <h2 class="mt-4! pt-0!">What is publint</h2>
        <p>
          <code>publint</code> lints npm packages to ensure the widest compatibility across
          environments, such as Vite, Webpack, Rollup, Node.js, etc.
        </p>

        <ul>
          <li><a href="/docs/">Docs</a></li>
          <li><a href="/rules">Lint rules</a></li>
          <li>
            <a href="https://github.com/publint/publint"> GitHub </a>
          </li>
        </ul>
      </section>
      <section class="md:w-1/2 mb-2">
        <h2 class="mt-4! pt-0!">How it works</h2>
        <p>
          Given an npm package, the site downloads the tarball and runs
          <code>publint</code> against it in a web worker. For larger packages, it may take a while
          to download and lint.
        </p>
        <p>
          You can also directly paste
          <a href="https://www.npmjs.com">www.npmjs.com</a> or
          <a href="https://pkg.pr.new">pkg.pr.new</a>
          links in the search input to easily lint them!
        </p>
      </section>
    </div>
  </footer>
</template>

<style>
/* Remove top border added by VitePress */
#app-footer h2 {
  border-top: none;
}
</style>

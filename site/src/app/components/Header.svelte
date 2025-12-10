<script>
  import homeIcon from '../../assets/home.svg?url'
  import docsIcon from '../../assets/docs.svg?url'
  import githubIcon from '../../assets/github.svg?url'
</script>

<header class="absolute top-0 left-0 w-full z-10 px-4 pointer-events-none">
  <nav class="bookmark-nav flex gap-3 justify-end max-w-3xl mx-auto">
    <a class="bookmark decoration-none pointer-events-auto" href="/" title="Go to main page">
      <img src={homeIcon} alt="home icon" width="20" height="20" />
    </a>
    <a class="bookmark decoration-none pointer-events-auto" href="/docs/" title="Go to docs">
      <img class="-mb-0.5" src={docsIcon} alt="docs icon" width="20" height="20" />
    </a>
    <a
      class="bookmark decoration-none pointer-events-auto"
      href="https://github.com/publint/publint"
      title="Go to GitHub repo"
    >
      <img src={githubIcon} alt="github logo" width="20" height="20" />
    </a>
  </nav>
</header>

<style>
  /* slight glow so there's layers */
  .bookmark-nav {
    position: relative;
  }

  .bookmark-nav::before {
    content: '';
    position: absolute;
    top: -2rem;
    right: 1.4rem;
    width: 5rem;
    height: 5rem;
    /* bg-gray-800 */
    background-image: linear-gradient(-45deg, rgb(31, 41, 55) 100%, rgb(31, 41, 55) 100%);
    filter: blur(50px);
    /* clip top by 0.2rem (-0.02rem to negate border) so it appears that the bookmark wraps around the glow */
    clip-path: polygon(-100rem 2.18rem, 100rem 2.18rem, 100rem 100rem, -100rem 100rem);
  }

  .bookmark {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: end;
    background-image:
      url('../../assets/bookmark.svg'),
      linear-gradient(
        to bottom,
        #cf7522,
        #cf7522 calc(100% - 0.25rem),
        transparent calc(100% - 0.25rem),
        transparent
      );
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 0 100%;
    width: 2rem;
    height: 4rem;
    padding-bottom: 0.75rem;
    border-top-right-radius: 0.2rem;
    transition: height 0.2s;
  }

  .bookmark::before {
    content: '';
    position: absolute;
    top: 0;
    right: calc(100% - 0.5px);
    width: 0.3rem;
    height: 0.2rem;
    background-color: #cf7522;
    border-top-left-radius: 0.2rem;
  }

  .bookmark::after {
    content: '';
    position: absolute;
    top: 0;
    right: calc(100% - 0px);
    width: 0.3rem;
    height: 0.2rem;
    background-color: hsl(29, 72%, 40%);
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
  }

  .bookmark:hover,
  .bookmark:focus {
    height: 5.5rem;
  }

  .bookmark:active {
    height: 6rem;
  }

  :global(.dark) {
    .bookmark-nav::before {
      /* bg-gray-300 */
      background-image: linear-gradient(-45deg, rgb(209, 213, 219) 100%, rgb(209, 213, 219) 100%);
    }
  }

  @media (min-width: 52rem) {
    .bookmark {
      width: 2.2rem;
      height: 4.6rem;
    }
  }
</style>

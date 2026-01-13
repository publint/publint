import { onMounted, onUnmounted } from 'vue'

export function useHeadingHighlight() {
  // Highlights the heading when the hash matches so it's easier to find
  // what it's pointing to
  onMounted(() => {
    highlightHeading(window.location.hash, true)
    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', handleHashChange)
  })

  function handleHashChange(e) {
    highlightHeading(e.oldURL, false)
    highlightHeading(e.newURL, true)
  }

  function highlightHeading(hash, active) {
    hash = hash.replace(/^.*?#/, '')
    if (!hash) return
    const heading = document.getElementById(hash)
    if (!heading) return
    if (active) {
      heading.classList.add('active')
    } else {
      heading.classList.remove('active')
    }
  }
}

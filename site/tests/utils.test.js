import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeGitUrl } from '../src/app/utils/registry.js'

test('normalizeGitUrl', () => {
  const n = normalizeGitUrl

  // Plain HTTPS URLs should remain unchanged
  assert.equal(
    n('https://github.com/user/repo'),
    'https://github.com/user/repo',
  )

  // git+ prefix should be removed
  assert.equal(
    n('git+https://github.com/user/repo'),
    'https://github.com/user/repo',
  )
  assert.equal(
    n('git+https://github.com/user/repo.git'),
    'https://github.com/user/repo',
  )
  assert.equal(
    n('git+ssh://git@github.com/user/repo.git'),
    'https://github.com/user/repo',
  )

  // .git suffix should be removed
  assert.equal(
    n('https://github.com/user/repo.git'),
    'https://github.com/user/repo',
  )
  assert.equal(
    n('https://gitlab.com/user/repo.git'),
    'https://gitlab.com/user/repo',
  )
  assert.equal(
    n('https://bitbucket.org/user/repo.git'),
    'https://bitbucket.org/user/repo',
  )

  // git:// protocol should be converted to https://
  assert.equal(n('git://github.com/user/repo'), 'https://github.com/user/repo')
  assert.equal(
    n('git://github.com/user/repo.git'),
    'https://github.com/user/repo',
  )

  // ssh:// protocol should be converted to https://
  assert.equal(
    n('ssh://git@github.com/user/repo'),
    'https://github.com/user/repo',
  )
  assert.equal(
    n('ssh://git@github.com/user/repo.git'),
    'https://github.com/user/repo',
  )

  // git@github.com: SSH format should be converted
  assert.equal(n('git@github.com:user/repo'), 'https://github.com/user/repo')
  assert.equal(
    n('git@github.com:user/repo.git'),
    'https://github.com/user/repo',
  )

  // Shorthand formats should be expanded
  assert.equal(n('github:user/repo'), 'https://github.com/user/repo')
  assert.equal(n('gitlab:user/repo'), 'https://gitlab.com/user/repo')
  assert.equal(n('bitbucket:user/repo'), 'https://bitbucket.org/user/repo')

  // Plain user/repo format should default to GitHub
  assert.equal(n('user/repo'), 'https://github.com/user/repo')

  // Combined permutations
  assert.equal(
    n('git+git://github.com/user/repo.git'),
    'https://github.com/user/repo',
  )
  assert.equal(
    n('git+ssh://git@gitlab.com/user/repo.git'),
    'https://gitlab.com/user/repo',
  )

  // Edge cases - URLs that don't match patterns should remain unchanged
  assert.equal(
    n('https://example.com/some/path'),
    'https://example.com/some/path',
  )
  assert.equal(
    n('https://custom-git-host.com/user/repo.git'),
    'https://custom-git-host.com/user/repo',
  )
})

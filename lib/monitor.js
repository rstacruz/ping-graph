/* @flow */

/*::
  export type Options = {
    maxPoints?: number
  }
*/

const Transform = require('stream').Transform

/**
 * Logs stuff.
 *
 * Takes an input like:
 *
 *     m = Monitor()
 *     m.write({ value: 23 })
 *     m.write({ value: null })
 *
 * And outputs these:
 *
 *     m.on('data', ({ value, state }) => {
 *       value  // 23 || null
 *       state  // [23, ...]
 *     })
 *
 * @example
 * pinger()
 *   .pipe(monitor())
 *   .pipe(renderer())
 */

function Monitor (options /*: Options */ = {}) {
  const maxPoints = options.maxPoints || 512

  let state = []

  function push ({ value }, _, done) {
    state = [value].concat(state.slice(0, maxPoints - 1))
    done(null, { value, state })
  }

  return new Transform({
    objectMode: true,
    transform: push
  })
}

/*
 * Export
 */

module.exports = Monitor

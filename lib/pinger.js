/* @flow */

/*::
  export type Options = {
    target?: string,
    interval?: number
  }
*/

const ping = require('ping')
const Readable = require('stream').Readable
const exitHook = require('exit-hook')

/**
 * Pings a host continuously. Returns a Readable stream.
 *
 * @param Object options Options
 * @param String options.target The host to be pinged
 * @param Number options.interval Number of milliseconds to wait between pings
 *
 * @example
 * pinger()
 * .pipe(monitor())
 * .pipe(renderer())
 *
 * pinger()
 *   .on('data', ({ value }) => {
 *     if (value != null) {
 *       console.log('response:', value, 'ms')
 *     } else {
 *       console.log('request timed out')
 *     }
 *   })
 */

function Pinger (options /*: Options */ = {}) {
  const target = options.target || '8.8.8.8'
  const interval = options.interval || 1000

  const stream = new Readable({
    objectMode: true,
    read: () => {}
  })

  function tick () {
    ping.promise.probe(target)
      .then(({ alive, time }) => {
        // $FlowFixMe
        stream.push({ value: (alive ? +time : null) })
      })
      .catch(err => {
        stream.emit('error', err)
      })
      .then(() => {
        setTimeout(() => tick(), interval)
      })
  }

  exitHook(() => {
    stream.push(null)
  })

  // Start it
  tick()

  return stream
}

/*
 * Export
 */

module.exports = Pinger

const Readable = require('stream').Readable

/**
 * Random data source. Drop-in replacement for `Pinger()`
 */

function Randomizer (opts = {}) {
  const interval = opts.interval != null ? opts.interval : 500

  const stream = new Readable({
    objectMode: true,
    read: () => {}
  })

  function tick () {
    if (Math.random() < 0.2) {
      stream.push({ value: null })
    } else {
      let rand = Math.random()
      rand = rand * rand * rand
      stream.push({ value: rand * 300 + 70 })
    }

    setTimeout(tick, interval)
  }

  tick()

  return stream
}

/*
 * Export
 */

module.exports = Randomizer

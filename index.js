/* @flow */

/*::
  import type { Options as MonitorOptions } from './lib/monitor'
  import type { Options as RendererOptions } from './lib/renderer'

  export type Options = MonitorOptions & RendererOptions & {
    random?: boolean
  }
*/

const Pinger = require('./lib/pinger')
const Monitor = require('./lib/monitor')
const Renderer = require('./lib/renderer')
const Randomizer = require('./lib/randomizer')

/*
 * Defaults
 */

const DEFAULTS /*: Options */ = {
  target: '8.8.8.8',
  interval: 1000
}

/**
 * Run
 */

function run (options /*: Options */ = {}) {
  const opts = Object.assign({}, DEFAULTS, options)

  const source = options.random
    ? Randomizer(opts)
    : Pinger(opts)

  return source
    .pipe(Monitor())
    .pipe(Renderer(opts))
}

/*
 * Export
 */

module.exports = { run }

if (!module.parent) run()

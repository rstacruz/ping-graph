/* @flow */

/*::
  export type Options = {
    lines?: ?number,
    maxPing?: number,
    minPing?: number
  }
*/

const spark = require('./spark2')
const ansi = require('ansi-escapes')
const exitHook = require('exit-hook')
const Writable = require('stream').Writable
const chalk = require('chalk')
const { getDimensions } = require('./screen')

const MIN_PING = 70
const MAX_PING = 250

const OK = chalk.green('✓')
const BAD = chalk.red('✗')

/**
 * Renderer.
 */

function Renderer (options /*: Options */ = {}) {
  let lastData = { state: [], value: null }

  // Clear screen on exit
  exitHook(onExit)

  process.stdout.write(
    ansi.eraseScreen +
    ansi.cursorHide)

  // Re-render when resizing
  process.stdout.on('resize', () => {
    render(lastData, options)
  })

  startSpin()

  return new Writable({
    objectMode: true,
    write: (data, _, done) => {
      lastData = data
      render(data, options)
      done()
    }
  })
}

/**
 * Cleans up the display before exiting.
 */

function onExit () {
  process.stdout.write(
    '' +
    ansi.eraseScreen +
    ansi.cursorShow)
}

/**
 * Renders to screen.
 */

function render ({ state, value }, opts /*: Options */ = {}) {
  let screen /*: { width: number, height: number } */ = getDimensions()

  let newState = state.slice(0, screen.width)
  let numbers = newState.filter(n => n != null)

  const max = Math.max(Math.max.apply(Math, numbers), opts.maxPing || MAX_PING)
  const min = Math.min(Math.min.apply(Math, numbers), opts.minPing || MIN_PING)

  const lines = typeof opts.lines === 'number'
    ? opts.lines
    : screen.height - 1

  process.stdout.write(
    ansi.cursorTo(0, 1) +
    spark(newState, { lines, min, max }) +
    ansi.cursorTo(2, 0) +
    (value ? `${value | 0}ms ${OK}` : `${BAD}`) +
    '           ' +
    ansi.cursorTo(0, 0))
}

/*
 * Eh
 */

function getSpinner () {
  const frames = require('cli-spinners').dots.frames
  let i = 0
  return function () {
    return frames[(i = ++i % frames.length)]
  }
}

function startSpin () {
  const spin = getSpinner()
  let timer

  function tick () {
    process.stdout.write(
      ansi.cursorTo(0, 0) +
      chalk.blue(spin()) +
      ansi.cursorTo(0, 0))

    timer = setTimeout(tick, 125)
  }

  exitHook(() => {
    if (timer) clearTimeout(timer)
  })

  tick()
}

/*
 * Export
 */

module.exports = Renderer

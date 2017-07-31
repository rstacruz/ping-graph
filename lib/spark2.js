const range = require('lodash/range')
const chalk = require('chalk')

const CHARS = [
  '⣀',
  '⣤',
  '⣶',
  '⣿'
]

const NULL_CHAR = chalk.red('⡀')

/**
 * Renders sparklines.
 *
 * @example
 * render([ 80, 82, 120, 283, 124 ])
 */

function render (data, options) {
  if (!options) options = {}

  const min = options.min != null
    ? options.min
    : Math.min.apply(Math, data)

  const max = options.max != null
    ? options.max
    : Math.max.apply(Math, data)

  const lines = options.lines != null
    ? options.lines
    : 1

  const width = options.width != null
    ? options.width
    : data.length

  return renderChart(data, { min, max, lines, width })
}

/**
 * Renders sparklines.
 *
 * This is a delegate function of `render()`.
 * @private
 */

function renderChart (data, { min, max, lines, width }) {
  const items = data.slice(0, width)

  return range(lines - 1, -1).map(line => {
    const display = {
      min: line / lines,
      max: (line + 1) / lines
    }

    return items.map(value => {
      if (value == null) {
        return NULL_CHAR
      }

      const unit = (value - min) / (max - min)

      // 0...1, or <0
      const pixel = Math.min(1, (unit - display.min) / (display.max - display.min))

      if (pixel < 0) return ' '
      return CHARS[Math.round(pixel * (CHARS.length - 1))]
    }).join('')
  }).join('\n')
}

/*
 * Export
 */

module.exports = render

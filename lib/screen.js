/**
 * Returns the width and height of the current terminal
 */

function getDimensions () {
  return {
    width: process.stdout.columns,
    height: process.stdout.rows
  }
}

module.exports = { getDimensions }

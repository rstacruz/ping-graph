/* @flow */
/* eslint-env jest */

const Monitor = require('../lib/monitor')
const Readable = require('stream').Readable
const concat = require('concat-stream')

describe('Monitor', () => {
  it('works', () => {
    return new Promise((resolve, reject) => {
      const stream = makeStream()

      stream.pipe(Monitor()).pipe(concat(data => {
        expect(data).toMatchSnapshot()
        resolve()
      }))

      // $FlowFixMe
      stream.push({ value: 80 })
      // $FlowFixMe
      stream.push({ value: 90 })
      // $FlowFixMe
      stream.push({ value: 100 })
      stream.push(null)
    })
  })
})

function makeStream () {
  return new Readable({ objectMode: true, read () {} })
}

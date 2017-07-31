/* @flow */
/* eslint-env jest */

const Randomizer = require('../lib/randomizer')
const Readable = require('stream').Readable
const concat = require('concat-stream')

jest.useFakeTimers()

describe('Randomizer', () => {
  it('works', () => {
    return new Promise((resolve, reject) => {
      const stream = Randomizer({ interval: 10 })

      stream.pipe(concat(data => {
        expect(data.length).toEqual(201)

        data.forEach(item => {
          expect(typeof item).toEqual('object')
          expect(item.value === null || typeof item.value === 'number').toBe(true)
        })
        resolve()
      }))

      jest.runTimersToTime(200 * 10)
      stream.push(null)
    })
  })

  xit('has default interval', () => {
    return new Promise((resolve, reject) => {
      const stream = Randomizer()

      stream.pipe(concat(data => {
        expect(data.length).toEqual(201)
        resolve()
      }))

      jest.runTimersToTime(200 * 500)
      stream.push(null)
    })
  })
})

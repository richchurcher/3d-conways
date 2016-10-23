import test from 'ava'
import * as cw from '../'

function generateGrid (size, state = false, next = false) {
  return [...new Array(size)].map(row =>
    [...new Array(size)].map(cell =>
      Object.assign({}, { state, next })
    )
  )
}

test.beforeEach(t => {
  t.context.threeByThree = generateGrid(3)
})

test('createCell sets state and next', t => {
  const expected = { state: false, next: false }
  const actual = cw.createCell()
  t.deepEqual(expected, actual)
})

test('evolve spares cell when neighbours number 2', t => {
  const cell = { state: true, next: false }
  const actual = cw.evolve(cell, 2).next
  t.true(actual)
})

test('evolve kills cell when neighbours number 1', t => {
  const cell = { state: true, next: true }
  const actual = cw.evolve(cell, 1).next
  t.false(actual)
})

test('evolve spares cell when neighbours number 3', t => {
  const cell = { state: true, next: false }
  const actual = cw.evolve(cell, 3).next
  t.true(actual)
})

test('evolve kills cell when neighbours number 4', t => {
  const cell = { state: true, next: true }
  const actual = cw.evolve(cell, 4).next
  t.false(actual)
})

test('evolve resurrects cell when neighbours number 3', t => {
  const cell = { state: false, next: false }
  const actual = cw.evolve(cell, 3).next
  t.true(actual)
})

test('getNeighbours returns 8 neighbours for a central cell', t => {
  const grid = [
    [true, true, true],
    [true, false, true],
    [true, true, true]
  ]
  const expected = 8
  const actual = cw.getNeighbours(grid, 1, 1).filter(c => c).length
  t.is(expected, actual)
})

test('getNeighbours returns 3 neighbours for a corner cell', t => {
  const grid = [
    [false, true, false],
    [true, true, false],
    [false, false, false]
  ]
  const expected = 3
  const actual = cw.getNeighbours(grid, 0, 0).filter(c => c).length
  t.is(expected, actual)
})

test('getNeighbours returns 3 neighbours for a corner cell from a larger grid', t => {
  const grid = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, true, true],
    [false, false, false, true, false]
  ]
  const expected = 3
  const actual = cw.getNeighbours(grid, 4, 4).filter(c => c).length
  t.is(expected, actual)
})

test('getNeighbours returns 5 neighbours for a side cell', t => {
  const grid = [
    [false, true, false, true],
    [false, true, true, true],
    [false, false, false, false]
  ]
  const expected = 5
  const actual = cw.getNeighbours(grid, 0, 2).filter(c => c).length
  t.is(expected, actual)
})

test('countLive returns correct count', t => {
  const neighbours = [
    { state: true }, { state: false }, { state: true }
  ]
  const expected = 2
  const actual = cw.countLive(neighbours)
  t.is(expected, actual)
})

test('nextGeneration advances all states', t => {
  const grid = generateGrid(3, false, true)
  const expected = generateGrid(3, true, true)
  const actual = cw.nextGeneration(grid)
  t.deepEqual(expected, actual)
})

test('toString yields the correct string for grid', t => {
  const grid = t.context.threeByThree
  grid[1][1].state = true
  const expected = '. . .\n. x .\n. . .\n'
  const actual = cw.toString(grid)
  t.is(expected, actual)
})


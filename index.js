const clear = require('clear')

let grid = generateGrid(100)

setInterval(tick, 20)

function tick () {
  clear()
  const start = Date.now()
  grid = evolveGrid(grid)
  const evolved = Date.now() - start
  grid = nextGeneration(grid)
  const generated = Date.now() - start - evolved
  const output = toString(grid)
  const stringified = Date.now() - start - evolved - generated
  console.log(output)
  console.log('evolved: ', evolved)
  console.log('generated: ', generated)
  console.log('stringified: ', stringified)
}

function randomCell () {
  return {
    state: Math.random() > 0.5 ? false : true,
    next: false
  }
}

function generateGrid (size, state = false, next = false) {
  return [...new Array(size)].map(row =>
    [...new Array(size)].map(cell => randomCell())
  )
}

function evolveGrid (cells) {
  return cells.map((row, x) => row.map((cell, y) =>
    evolve(cell, countLive(getNeighbours(cells, x, y)))))
}

export function createCell (state = false, next = false) {
  return {
    state,
    next
  }
}

export function evolve (cell, neighbours) {
  if (cell.state) {
    return Object.assign({}, cell, { next: survives(neighbours) })
  }
  return Object.assign({}, cell, { next: dies(neighbours) })
}

function survives (neighbours) {
  return neighbours > 1 && neighbours < 4
}

function dies (neighbours) {
  return neighbours === 3
}

export function getNeighbours (grid, x, y) {
  const result = []
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (grid[i] && grid[i][j]) {
        result.push(grid[i][j])
      }
    }
  }
  return result
}

export function countLive (cells) {
  return cells.filter(c => c.state).length
}

export function nextGeneration (cells) {
  return cells.map(row => row.map(cell =>
    Object.assign({}, cell, { state: cell.next })))
}

export function toString (cells) {
  const result = cells.map(row => row
    .map(cell => cell.state ? 'x' : '.')
    .join(' ') + '\n')
  return [].concat.apply([], result).join('')
}

/*
*********************************
SAMPLE STARTER DATA
*********************************
*/

let aliens = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2]

/*
*********************************
HELPER CLASSES & VARIABLES
*********************************
*/

class Vec {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y)
  }

  times(factor) {
    return new Vec(this.x * factor, this.y * factor)
  }
}

let startPos = new Vec(
  main.offsetWidth / 2 - 205 + 25,
  window.innerHeight * 0.15 + 25
)

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let WIDTH, HEIGHT, game
let gameRunning

/*
*********************************
GAME CLASSES
*********************************
*/

class Game {
  constructor(canvas, context) {
    this.gameSize = new Vec(WIDTH, HEIGHT)
    this.canvas = canvas
    this.ctx = context
    this.bodies = [new Player(this, this.gameSize)].concat(createAliens(this))
    console.log(this.bodies)
    self = this
  }

  loop() {
    console.log('looping')
    self.draw()
    self.bodies[0].update()
    if (gameRunning) {
      requestAnimationFrame(self.loop)
    } else console.log('stop')
  }

  draw() {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT)

    this.bodies.forEach(body => {
      this.ctx.fillStyle = body.colour
      this.ctx.fillRect(
        body.center.x - body.size.x / 2,
        body.center.y - body.size.y / 2,
        body.size.x,
        body.size.y
      )
    })
  }
}

function initGame() {
  //calendar.remove()
  main.removeChild(startBtn)
  game = new Game(canvas, ctx)
  gameRunning = true
  game.loop()
}

function createAliens(game) {
  let numberOfAliens = aliens.length
  let newAliens = []
  let start = new Vec(startPos.x, startPos.y)
  let x = start.x
  let type
  let y = start.y - 60
  for (let i = 0; i < numberOfAliens; i++) {
    type = aliens[i]
    if (i % 7 === 0) {
      x = start.x
      y += 60
    } else {
      x += 60
    }
    console.log(i, x, y)
    newAliens.push(new Alien(game, new Vec(x, y), type))
  }
  return newAliens
}

class Alien {
  constructor(game, center, type) {
    this.size = { x: 50, y: 50 }
    this.center = center
    this.game = game
    this.type = type
    const typeLegend = {
      0: ['black', 0],
      1: ['green', 30],
      2: ['yellow', 50],
      3: ['magenta', 75],
      4: ['white', 100],
      5: ['pink', 200]
    }
    this.colour = typeLegend[type][0]
    this.points = typeLegend[type][1]
  }
}

class Player {
  constructor(game, gameSize) {
    this.size = { x: 50, y: 50 }
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 2 }
    this.colour = 'red'
  }

  update() {
    if (keyBoard.ArrowLeft) {
      if (this.center.x > this.size.x / 2) this.center.x -= 2
    } else if (keyBoard.ArrowRight) {
      if (this.center.x < WIDTH - this.size.x / 2) this.center.x += 2
    }
  }
}

/*
*********************************
ON CANVAS LOAD
*********************************
*/

resizeCanvas()
window.addEventListener('resize', resizeCanvas)
const keyBoard = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])

initGame()

/*
*********************************
HELPER FUNCTIONS
*********************************
*/

function trackKeys(keysArray) {
  const down = Object.create(null)
  function track(e) {
    if (keysArray.includes(e.key)) {
      down[e.key] = e.type === 'keydown'
      e.preventDefault()
    }
  }
  window.addEventListener('keydown', track)
  window.addEventListener('keyup', track)
  return down
}

function resizeCanvas() {
  gameRunning = false
  canvas.width = window.innerWidth * 0.65
  canvas.height = window.innerHeight
  WIDTH = canvas.width
  HEIGHT = canvas.height
  startPos = new Vec(
    main.offsetWidth / 2 - 205 + 25,
    window.innerHeight * 0.15 + 25
  )
  //gameRunning = true
}

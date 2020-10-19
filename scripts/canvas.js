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

let aliens = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1]
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let WIDTH
let HEIGHT
let game
let gameRunning

let startPos = new Vec(
  main.offsetWidth / 2 - 205 + 25,
  window.innerHeight * 0.15 + 25
)

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
  console.log(game)
}

window.addEventListener('resize', resizeCanvas)

resizeCanvas()

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
  console.log(numberOfAliens)
  let newAliens = []
  for (let i = 0; i < numberOfAliens; i++) {
    let x, y
    x = startPos.x + i * 60
    if (i < 7) {
      y = startPos.y
    } else if (i < 14) {
      y = startPos.y + 60
    } else if (i < 21) {
      y = startPos.y
    } else if (i < 28) {
      y = startPos.y
    } else if (i < 35) {
      y = startPos.y
    }
    newAliens.push(new Alien(game, new Vec(x, y)))
  }
  return newAliens
}

class Alien {
  constructor(game, center) {
    this.size = { x: 50, y: 50 }
    this.center = center
    this.game = game
    this.colour = 'green'
  }
}

createAliens(game)

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

function trackKeys(keysArray) {
  const down = Object.create(null)
  function track(e) {
    if (keysArray.includes(e.key)) {
      down[e.key] = e.type === 'keydown'
      console.log(down)
      e.preventDefault()
    }
  }
  window.addEventListener('keydown', track)
  window.addEventListener('keyup', track)
  return down
}

const keyBoard = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])

initGame()

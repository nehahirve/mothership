/*
*********************************
SAMPLE STARTER DATA
*********************************
*/

let aliens = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2]
let highScore = 0

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

let ticker = Date.now()
let alienPicker

function GameOver() {
  gameRunning = false
  main.remove(canvas)
}

class Game {
  constructor(canvas, context) {
    this.gameSize = new Vec(WIDTH, HEIGHT)
    this.canvas = canvas
    this.ctx = context
    this.bodies = [new Player(this, this.gameSize)].concat(createAliens(this))
    self = this
  }

  loop() {
    if (ticker % 60 === 0) {
      console.log('looping')
      if (alienPicker) alienPicker = false
      else alienPicker = true
    }
    self.draw()
    self.update()
    self.bodies.forEach(body => body.update())
    ticker++
    if (gameRunning) {
      requestAnimationFrame(self.loop)
    } else console.log('stop')
  }

  update() {
    for (let body of self.bodies) {
      body.update()
    }

    self.bodies = self.bodies.filter(body => {
      return notColliding(body)
    })

    function notColliding(b1) {
      return (
        self.bodies.filter(function (b2) {
          return colliding(b1, b2)
        }).length === 0
      )
    }

    self.bodies = self.bodies.filter(body => !(body.center.y < 0))
  }

  draw() {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT)

    this.bodies.forEach(body => {
      drawRect(ctx, body, body.colour)
    })
  }
}

function initGame() {
  main.removeChild(startBtn)
  game = new Game(canvas, ctx)
  //gameRunning = true
  canvas.style.opacity = 1
  setTimeout(function () {
    if (document.fonts.check('45px sprites')) {
      gameRunning = true
      game.loop()
    }
  }, 1000)
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
    newAliens.push(new Alien(game, new Vec(x, y), type))
  }
  newAliens = newAliens.filter(alien => alien.type !== 0)
  return newAliens
}

const typeLegend = {
  0: ['black', 0],
  1: ['rgb(253, 100, 100)', 30],
  2: ['#04a2eb', 50],
  3: ['magenta', 75],
  4: ['white', 100],
  5: ['pink', 200]
}

class Alien {
  constructor(game, center, type) {
    this.size = { x: 50, y: 50 }
    this.center = center
    this.game = game
    this.type = type

    this.colour = typeLegend[type][0]
    this.points = typeLegend[type][1]
    this.patrolX = 0
    this.speed = new Vec(0.3, 0.01)
  }

  get name() {
    return 'Alien'
  }

  update() {
    if (this.patrolX < -150 || this.patrolX > 150) {
      this.speed.x = -this.speed.x
    }
    this.center = this.center.plus(this.speed)
    this.patrolX += this.speed.x
  }
}

class Player {
  constructor(game, gameSize) {
    this.size = { x: 50, y: 50 }
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 2 }
    this.colour = 'linen'
  }

  get name() {
    return 'Player'
  }

  update() {
    if (keyBoard.ArrowLeft) {
      if (this.center.x > this.size.x / 2) this.center.x -= 2
    } else if (keyBoard.ArrowRight) {
      if (this.center.x < WIDTH - this.size.x / 2) this.center.x += 2
    }
    if (keyBoard.ArrowUp) {
      let currentBullets = game.bodies.filter(body => body.name === 'Bullet')
      console.log(ticker % 60 === 0)
      if (ticker % 1800 === 0 || currentBullets.length === 0) {
        let bullet = new Bullet(
          new Vec(this.center.x, this.center.y - this.size.y - 10)
        )
        game.bodies.push(bullet)
      }
    }
  }
}

class Bullet {
  constructor(center, game) {
    this.center = center
    this.speed = new Vec(0, -7)
    this.colour = 'blue'
    this.size = new Vec(10, 10)
  }

  get name() {
    return 'Bullet'
  }

  update() {
    this.center.y += this.speed.y
    let hit = game.bodies.filter(body => colliding(this, body))
    if (hit.length > 0) {
      let points = typeLegend[hit[0].type][1]
      highScore += points
      console.log(highScore)
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

function colliding(b1, b2) {
  return !(
    b1 === b2 ||
    b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
    b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
    b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
    b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
  )
}

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

function drawRect(ctx, body, colour) {
  if (document.fonts.check('45px sprites')) {
    calendar.style.opacity = 0
    ctx.font = '45px sprites'
    if (body.name === 'Player') {
      ctx.fillStyle = 'black'
      ctx.fillRect(
        body.center.x - body.size.x / 2,
        body.center.y - body.size.y / 2,
        body.size.x,
        body.size.y
      )
      ctx.fillStyle = colour
      ctx.font = '90px sprites'
      let text = 'w'
      ctx.fillText(text, body.center.x - body.size.x / 2, body.center.y + 18)
    }
    if (body.name === 'Bullet') {
      ctx.fillStyle = 'black'
      ctx.fillRect(
        body.center.x - body.size.x / 2,
        body.center.y - body.size.y / 2,
        body.size.x,
        body.size.y
      )
      ctx.fillStyle = 'yellow'
      ctx.font = '60px sprites'
      let text = 'y'
      ctx.fillText(text, body.center.x - body.size.x / 2, body.center.y + 18)
    }
    if (body.type) {
      ctx.fillStyle = 'black'
      ctx.fillRect(
        body.center.x - body.size.x / 2,
        body.center.y - body.size.y / 2,
        body.size.x,
        body.size.y
      )
      ctx.fillStyle = colour
      let text
      if (alienPicker) text = alienKeyCodes[body.type][0]
      else text = alienKeyCodes[body.type][1]
      let offset = 0
      if (text == 'd' || text == 'e') {
        offset = 8
      }
      ctx.fillText(
        text,
        offset + body.center.x - body.size.x / 2,
        body.center.y + 18
      )
    }
  }
}

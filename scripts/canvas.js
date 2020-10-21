/*
*********************************
DUMMY STARTER DATA
*********************************
*/

let aliens = [1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5]
let highScore = 0
const typeLegend = {
  0: ['black', 0, ['']],
  1: ['rgb(253, 100, 100)', 30, ['b', 'c']],
  2: ['#04a2eb', 50, ['d', 'e']],
  3: ['magenta', 75, ['l', 'm']],
  4: ['white', 100, ['r', 's']],
  5: ['pink', 200, ['f', 'g']],
  10: ['yellow', 0, ['z', 'z']],
  20: ['rgb(255, 241, 194)', 0, ['w', 'w']],
  30: ['yellow', 0, ['y', 'y']],
  40: ['yellow', 0, ['y', 'y']]
}

/*
*********************************
HELPER CLASSES & VARIABLES
*********************************
*/
const shootSound = document.createElement('audio')
shootSound.src = 'media/shoot.wav'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const score = document.createElement('div')

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

let WIDTH, HEIGHT, game, self, startPos
let gameRunning, alienPicker
let ticker = 0
let delta = 0

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
    self = this
  }

  loop() {
    // animations
    if (delta % 60 === 0) {
      //alienPicker = alienPicker ? false : true
    }

    self.update()
    self.draw()
    self.bodies.forEach(body => body.update())

    delta++
    ticker = ticker - delta

    if (gameRunning) {
      requestAnimationFrame(self.loop)
    } else console.log('stop')
  }

  update() {
    if (delta % 60 === 0) {
      console.log(delta)
      alienPicker = alienPicker ? false : true
      self.bodies = self.bodies.filter(body => body.type !== 10)
    }

    // update all bodies
    for (const body of self.bodies) {
      body.update()
    }
    // filter out colliding bodies
    self.bodies = self.bodies.filter(body => {
      return notColliding(body) || body.type === 10
    })

    function notColliding(b1) {
      return (
        self.bodies.filter(function (b2) {
          return colliding(b1, b2)
        }).length === 0
      )
    }
    // filter out bullets out of frame
    self.bodies = self.bodies.filter(body => !(body.center.y < 0))
  }

  draw() {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT)

    this.bodies.forEach(body => {
      drawBody(ctx, body)
      //drawRect(ctx, body)
    })
  }
}

class Alien {
  constructor(game, center, type, speed) {
    this.size = { x: 80, y: 80 }
    this.center = center
    this.game = game
    this.type = type
    this.colour = typeLegend[this.type][0]
    this.letters = typeLegend[this.type][2]
    this.points = typeLegend[this.type][1]
    this.patrolX = 0
    this.speed = speed
  }

  get name() {
    return 'Alien'
  }

  changeType(center, type, speed) {
    return new Alien(this.game, center, type, speed)
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
    this.type = 20
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 4 }
    this.colour = typeLegend[this.type][0]
    this.letters = typeLegend[this.type][2]
  }

  get name() {
    return 'Player'
  }

  update() {
    if (keyBoard.ArrowLeft) {
      // moves left and right
      if (this.center.x > this.size.x / 2) this.center.x -= 2
    } else if (keyBoard.ArrowRight) {
      if (this.center.x < WIDTH - this.size.x / 2) this.center.x += 2
    }
    if (keyBoard.ArrowUp) {
      // shoots a bullet
      if (delta % 60 === 0) {
        const bullet = new Bullet(
          new Vec(this.center.x, this.center.y - this.size.y - 10),
          new Vec(0, -7),
          new Vec(10, 10),
          30
        )
        game.bodies.push(bullet)
        shootSound.play()
      }
    }
  }
}

class Bullet {
  constructor(center, speed, size, type) {
    this.center = center
    this.type = type
    this.speed = speed
    this.colour = typeLegend[type][0]
    this.size = size
    this.letters = typeLegend[type][2]
  }

  get name() {
    return 'Bullet'
  }

  update() {
    this.center.y += this.speed.y
    let hit = game.bodies.filter(body => colliding(this, body))

    if (hit.length > 0) {
      const points = typeLegend[hit[0].type][1]
      highScore += points
      score.innerText = ` HIGH SCORE : ${highScore}`
      const speed = hit[0].speed
      const center = hit[0].center
      hit = hit[0].changeType(center, 10, speed)
      game.bodies.push(hit)
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
  let scale = window.devicePixelRatio
  //gameRunning = false
  canvas.width = Math.floor(window.innerWidth * 0.65 * scale)
  canvas.height = Math.floor(window.innerHeight * scale)
  WIDTH = canvas.width
  HEIGHT = canvas.height
  startPos = new Vec(
    (main.offsetWidth / 2 - 205 + 14) * scale,
    (window.innerHeight * 0.15 + 32) * scale
  )
  //gameRunning = true
}

function drawBody(ctx, body) {
  let bodyType = body.type
  if (body.name === 'Bullet') {
    ctx.fillStyle = 'black'
    ctx.fillStyle = body.color
    ctx.font = '100px sprites'
    let text = 'y'
    ctx.fillText(text, body.center.x - body.size.x / 2, body.center.y + 18)
  }

  ctx.font = '85px sprites'
  if (body.type === 20) ctx.font = '150px sprites'
  if (body.type === 30) ctx.font = '100px sprites'

  ctx.fillStyle = body.colour
  let text
  if (alienPicker) text = body.letters[0]
  else text = body.letters[1]
  let offset = 0
  if (bodyType === 2) {
    offset = 11
  }

  ctx.fillText(
    text,
    offset + body.center.x - body.size.x / 2,
    body.center.y + 18
  )
}

function createAliens(game) {
  let numberOfAliens = aliens.length
  let newAliens = []
  let start = new Vec(startPos.x, startPos.y)
  let x = start.x
  let type
  let y = start.y - 120
  for (let i = 0; i < numberOfAliens; i++) {
    type = aliens[i]
    if (i % 7 === 0) {
      x = start.x
      y += 120
    } else {
      x += 120
    }
    newAliens.push(new Alien(game, new Vec(x, y), type, new Vec(0.5, 0.04), 0))
  }
  newAliens = newAliens.filter(alien => alien.type !== 0)
  return newAliens
}

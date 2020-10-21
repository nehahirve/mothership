/*
*********************************
SAMPLE USER DATA
*********************************
*/

const userData = {
  name: 'Tuva',
  highScore: 2000,
  lastLogin: '20-10-05',
  habits: [
    {
      habitName: 'brush teeth',
      questLength: 31,
      longestStreak: 10,
      currentStreak: 10,
      dateStarted: '20-10-07',
      lastCompleted: '20-10-21',
      alienList: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2]
    },
    {
      habitName: 'drink vodka',
      questLength: 50,
      longestStreak: 7,
      currentStreak: 1,
      dateStarted: '20-09-25',
      lastCompleted: '20-09-30',
      alienList: [1, 1, 1, 0, 1, 1]
    },
    {
      habitName: 'code',
      questLength: 14,
      longestStreak: 14,
      currentStreak: 14,
      dateStarted: '20-10-10',
      lastCompleted: '20-10-20',
      alienList: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]
    }
  ]
}

const thisHabit = userData.habits[0]

/*
*********************************
CALENDAR CONSTANTS
*********************************
*/

const calendar = document.querySelector('#calendar')
const main = document.querySelector('main')
const playBtn = document.createElement('button')

let currentHabitDay = 0

const typeLegend = {
  0: ['black', 0, ['', '']],
  1: ['#FF32A9', 30, ['b', 'c']],
  2: ['#04a2eb', 50, ['d', 'e']],
  3: ['magenta', 75, ['l', 'm']],
  4: ['white', 100, ['r', 's']],
  5: ['pink', 200, ['f', 'g']],
  10: ['yellow', 0, ['z', 'z']],
  20: ['rgb(255, 241, 194)', 0, ['w', 'w']],
  30: ['yellow', 0, ['y', 'y']],
  40: ['red', 0, ['y', 'y']]
}

// BINARIES
let isReadyToPlay

/*
*********************************
INIT
*********************************
*/

loadCalendar(thisHabit)

/*
*********************************
MAIN FUNCTIONS
*********************************
*/
function loadCalendar(habit) {
  // UPDATE USER DATA DEPENDING ON LAST LOGIN
  loadStars()
  if (habit.alienList.length !== 0) {
    fastForwardToToday(habit)
  }

  // DRAW CALENDAR BUTTONS
  if (Array.from(calendar.children).length > 0) {
    calendar.innerHTML = ''
  }
  for (let i = 0; i < habit.questLength; i++) {
    const box = document.createElement('button')
    if (i < currentHabitDay) {
      const alienType = habit.alienList[i]
      const text = getRandom(typeLegend[alienType][2])
      box.className = `box past alien-${alienType}`
      box.innerText = text
      calendar.appendChild(box)
    } else if (i === currentHabitDay) {
      box.className = 'box current'
      box.innerText = `${i + 1}`
      calendar.appendChild(box)
      box.addEventListener('click', completeHabit.bind(box, habit))
    } else {
      box.className = 'box future'
      box.innerText = `${i + 1}`
      calendar.appendChild(box)
    }
  }
  // CHECK IF GAME IS READY TO PLAY
  checkIfQuestComplete(habit)
}

function fastForwardToToday(habit) {
  const elapsedDays = getDaysElapsedFromToday(habit.lastCompleted, getToday())
  if (elapsedDays > 1) {
    for (let i = 0; i < elapsedDays; i++) {
      habit.alienList.push(0)
    }
    habit.lastCompleted = getToday(-1)
    habit.currentStreak = 0
  }
  currentHabitDay = habit.alienList.length
}

function checkIfQuestComplete(habit) {
  const daysRemaining = habit.questLength - currentHabitDay
  if (daysRemaining === 0) isReadyToPlay = true
  playBtn.className = 'game-start-button'
  playBtn.innerText = `READY TO PLAY IN :`
  playBtn.style.marginTop = '100px'

  const count = document.createElement('div')
  count.innerText = `${daysRemaining} DAYS`
  count.className = 'countdown'
  count.setAttribute('data-text', `${daysRemaining} DAYS`)

  main.appendChild(playBtn)
  main.appendChild(count)
  if (isReadyToPlay) {
    main.removeChild(count)
    playBtn.innerText = 'PRESS TO PLAY'
    playBtn.setAttribute('data-text', 'PRESS TO PLAY')
    playBtn.classList.add('countdown')
    playBtn.addEventListener('click', initGame.bind(playBtn, habit))
  }
}

function completeHabit(habit) {
  this.removeEventListener('click', completeHabit)
  const streak = habit.currentStreak
  let alienType = 1
  if (streak > 7) {
    alienType += 1
  } else if (streak > 14) {
    alienType += 1
  } else if (streak > 21) {
    alienType += 1
  } else if (streak > 28) {
    alienType += 1
  }
  this.className = `box past alien-${alienType} clicked`
  this.innerText = getRandom(typeLegend[alienType][2])
  habit.currentStreak += 1
  if (habit.currentStreak > habit.longestStreak) {
    habit.longestStreak = habit.currentStreak
  }
  habit.lastCompleted = getToday()
  habit.alienList.push(alienType)
}

/*
*********************************
GAME CONSTANTS
*********************************
*/

const keyBoard = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])

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
}

let WIDTH, HEIGHT, game, self, startPos
let gameRunning, alienPicker, aliens, highScore
let delta = 0

/*
*********************************
MAIN GAME FUNCTIONS
*********************************
*/

function initGame(habit) {
  aliens = habit.alienList
  highScore = userData.highScore
  canvas.style.display = 'block'
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  if (document.fonts.check('85px sprites')) {
    main.removeChild(playBtn)
    game = new Game(canvas, ctx)
    main.appendChild(score)
    score.innerText = ` HIGH SCORE : ${highScore}`
    score.className = 'score'
    canvas.style.opacity = 1
    calendar.style.opacity = 0
    if (document.fonts.check('80px sprites')) {
      gameRunning = true
      game.loop()
    }
  }
}

function gameOver() {
  gameRunning = false
  canvas.style.display = 'none'
  const gameOver = document.createElement('div')
  main.appendChild(gameOver)
  gameOver.innerText = 'GAME OVER'
  gameOver.className = 'game-over'
}

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
    self.update()
    self.draw()
    self.bodies.forEach(body => body.update())
    delta++

    if (gameRunning) {
      requestAnimationFrame(self.loop)
    }
  }

  update() {
    // animations
    if (delta % 60 === 0) {
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
    })
  }

  aliensBelow(alien) {
    return this.bodies.filter(body => {
      return (
        body instanceof Alien &&
        body.center.x === alien.center.x &&
        body.center.y > alien.center.y
      )
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

  changeType(center, type, speed) {
    return new Alien(this.game, center, type, speed)
  }

  update() {
    if (this.patrolX < -150 || this.patrolX > 150) {
      this.speed.x = -this.speed.x
    }
    this.center = this.center.plus(this.speed)
    this.patrolX += this.speed.x
    if (game.aliensBelow(this) && Math.random() > 0.9996) {
      const bullet = new Bullet(
        new Vec(this.center.x, this.center.y + this.size.y + 100),
        new Vec(0, 7),
        new Vec(5, 5),
        40
      )
      game.bodies.push(bullet)
    }
  }
}

class Player {
  constructor(game, gameSize) {
    this.size = { x: 100, y: 100 }
    this.type = 20
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 4 }
    this.colour = typeLegend[this.type][0]
    this.letters = typeLegend[this.type][2]
  }

  update() {
    if (keyBoard.ArrowLeft) {
      // moves left and right
      if (this.center.x > this.size.x / 2) this.center.x -= 2
    } else if (keyBoard.ArrowRight) {
      if (this.center.x < WIDTH - this.size.x / 2) this.center.x += 2
    }
    if (keyBoard.ArrowUp) {
      const currentBullets = game.bodies.filter(body => body instanceof Bullet)
      // shoots a bullet
      if (delta % 50 === 0 || currentBullets.length === 0) {
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

  update() {
    this.center.y += this.speed.y
    let hit = game.bodies.filter(body => colliding(this, body))

    if (hit.length > 0) {
      if (hit[0] instanceof Player) {
        gameOver()
      } else if (!(hit[0] instanceof Bullet)) {
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
}

/*
*********************************
GAME HELPER FUNCTIONS
*********************************
*/

function resizeCanvas() {
  let scale = window.devicePixelRatio
  canvas.width = Math.floor(window.innerWidth * 0.65 * scale)
  canvas.height = Math.floor(window.innerHeight * scale)
  WIDTH = canvas.width
  HEIGHT = canvas.height
  startPos = new Vec(
    (main.offsetWidth / 2 - 205 + 14) * scale,
    (window.innerHeight * 0.15 + 32) * scale
  )
}

function createAliens(game) {
  let newAliens = []
  const start = new Vec(startPos.x, startPos.y)
  let x = start.x
  let type
  let y = start.y - 120
  for (let i = 0; i < aliens.length; i++) {
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

function drawBody(ctx, body) {
  let bodyType = body.type
  if (body instanceof Bullet) {
    ctx.fillStyle = 'black'
    ctx.fillStyle = body.color
    ctx.font = '100px sprites'
    let text = 'y'
    ctx.fillText(text, body.center.x - body.size.x / 2, body.center.y + 18)
  }

  ctx.font = '85px sprites'
  if (body.type === 20) ctx.font = '150px sprites'
  if (body.type === 30) ctx.font = '100px sprites'
  if (body.type === 40) ctx.font = '70px sprites'

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

function colliding(b1, b2) {
  return !(
    b1 === b2 ||
    b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
    b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
    b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
    b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
  )
}

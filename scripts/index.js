// WINDOW LOADS

// GET DOM ELEMENTS
const main = document.querySelector('main')
const nav = document.querySelector('nav')
const hiScore = document.querySelector('.hi-score')
const splash = document.querySelector('#splash')
const form = document.querySelector('form')
const plusIcon = document.getElementById('plus-icon')
const cancelButton = document.querySelector('.cancel-button')
const habitList = document.querySelector('ul')
const nameInput = document.querySelector('#input-name')
const lengthInput = document.querySelector('#input-length')
const heatMap = document.querySelector('#heatmap')
let calendar = document.querySelector('#calendar')
const calendarWrapper = document.querySelector('#calendar-wrapper')

// GET TODAY'S DATE
var today = getToday()

// ON WINDOW LOAD
let userData

// loads the correct user data
loadUserData()

function loadUserData() {
  if (localStorage.getItem('locallyStored')) {
    userData = JSON.parse(localStorage.getItem('locallyStored'))
  } else {
    userData = {
      name: '',
      highScore: 3000,
      lastLogin: getToday(),
      heatMap: [
        1,
        8,
        8,
        8,
        6,
        6,
        6,
        3,
        3,
        2,
        0,
        0,
        1,
        1,
        1,
        2,
        3,
        4,
        4,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        0,
        0
      ],
      firstWeekDay: 3,
      habits: [
        {
          habitName: 'drink vodka',
          questLength: 35,
          currentStreak: 34,
          longestStreak: 34,
          startDate: getToday(-34),
          lastCompleted: getToday(-1),
          alienList: [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            5,
            5,
            5,
            5,
            5,
            5
          ]
        },
        {
          habitName: 'code',
          questLength: 31,
          currentStreak: 34,
          longestStreak: 34,
          startDate: getToday(-10),
          lastCompleted: getToday(-2),
          alienList: [1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1]
        }
      ]
    }
  }
}

// OVERWRITE THE LOCAL STORAGE WITH THE NEW USER DATA
function saveUserData() {
  localStorage.setItem('locallyStored', JSON.stringify(userData))
}

// SET HIGH SCORE
hiScore.innerText = `HI-SCORE : < ${userData.highScore} >`
// CREATE STARFIELD
loadStars(nav)
loadStars(main)

// MAPS THE HEATMAP ARRAY VALUES TO CSS OPACITY VALUES FOR THE HEATMAP DIV
const colorMapping = {
  0: 0.1,
  1: 0.2,
  2: 0.4,
  3: 0.6,
  4: 0.8,
  5: 1
}

// LOAD THE HEAT MAP
fastForwardHeatMap()

function fastForwardHeatMap() {
  const login = userData.lastLogin
  const days = getDaysElapsedFromToday(login, today)
  if (days === 0) {
    loadHeatMap()
  } else {
    for (let i = 0; i < days; i++) {
      userData.heatMap.push(0)
    }
    loadHeatMap()
  }

  saveUserData()
  userData.lastLogin = today // RESET THE LAST LOGIN
  saveUserData()
}

// DRAW THE HEATMAP
function loadHeatMap() {
  heatMap.innerHTML = ''
  for (let i = 0; i < userData.firstWeekDay; i++) {
    const box = document.createElement('div')
    heatMap.appendChild(box)
    box.className = 'heatmap-div-placeholder heatmap-div'
    box.style.background = 'none'
  }
  userData.heatMap.forEach(dataPoint => {
    const box = document.createElement('div')
    heatMap.appendChild(box)
    box.classList.add('heatmap-div')
    if (dataPoint > 5) {
      dataPoint = 5
    }
    box.style.opacity = colorMapping[dataPoint]
  })
}

// LOAD THE PRE EXISTING HABITS
loadExistingHabits()

function loadExistingHabits() {
  for (const item of userData.habits) {
    addHabitToPage(item.habitName)
  }
}

// OPEN THE FORM WHEN PLUS ICON IS CLICKED
plusIcon.addEventListener('click', showForm)

// SHOW THE FORM
function showForm() {
  resetCal() // clearing any existing calendars
  form.classList.remove('hidden')
}

// CLOSE THE FORM WHEN CANCEL BUTTON IS CLICKED
cancelButton.addEventListener('click', cancelForm)

function cancelForm(e) {
  e.preventDefault()
  // add class of 'hidden' to the form
  form.classList.add('hidden')
  const array = Array.from(habitList.children)
  if (!array.some(item => item.classList.contains('clicked-habit'))) {
    splash.style.display = 'flex'
  } else {
    const currentHabit = array.filter(item =>
      item.classList.contains('clicked-habit')
    )[0].childNodes[0].textContent

    connectCorrectCalendar(currentHabit)
  }
}

// SAVE THE FORM INPUT WHEN SAVE IS PRESSED
form.addEventListener('submit', saveHabitData)
form.addEventListener('change', countDays)

function saveHabitData(e) {
  e.preventDefault()
  const name = nameInput.value
  const length = lengthInput.value
  // if nameInput has smth && lengthInput has smth && lenghtInput is a number
  // only then

  if (name && length) {
    addHabitToPage(name)
    addHabitToData(name, length)
    form.classList.add('hidden')
    const array = Array.from(habitList.children)
    if (!array.some(item => item.classList.contains('clicked-habit'))) {
      splash.style.display = 'flex'
      Array.from(habitList.children).forEach(item =>
        item.classList.remove('clicked-habit')
      )
    } else {
      const currentHabit = array.filter(item =>
        item.classList.contains('clicked-habit')
      )[0].childNodes[0].textContent

      connectCorrectCalendar(currentHabit)
    }
  }
}

let slider = document.querySelector('#input-length')
let output = document.querySelector('#slider-length')
output.innerHTML = `${slider.value} DAYS`

slider.addEventListener('change', countDays)
function countDays(e) {
  output.innerHTML = `${e.target.value} DAYS`
}

// ADD AND DELETE HABITS

function addHabitToPage(name) {
  const habitListItem = document.createElement('li')
  habitList.appendChild(habitListItem)
  habitListItem.innerText = name
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('delete-button')
  deleteButton.innerText = 'X'
  habitListItem.appendChild(deleteButton)
  habitListItem.classList.add('habit-list-item')
  deleteButton.addEventListener('click', prompt.bind(deleteButton, name))
  habitListItem.addEventListener(
    'click',
    connectCorrectCalendar.bind(deleteButton, name)
  )
}

function addHabitToData(name, length) {
  const newHabit = {
    habitName: name,
    questLength: length,
    longestStreak: 0,
    currentStreak: 0,
    dateStarted: getToday(),
    alienList: []
  }
  const array = userData.habits
  array.push(newHabit)
  saveUserData()
}

function prompt(name, e) {
  e.stopPropagation()
  const deleteButton = this
  const el = document.createElement('div')
  el.className = 'prompt'
  main.append(el)
  const prompt = document.createElement('h1')
  prompt.innerText = `
  
  
  ABORT MISSION ?`
  el.appendChild(prompt)
  prompt.setAttribute('id', 'prompt')
  const yes = document.createElement('button')
  const no = document.createElement('button')
  const buttons = document.createElement('div')
  buttons.setAttribute('id', 'form-buttons')
  buttons.appendChild(yes)
  buttons.appendChild(no)
  el.appendChild(buttons)
  yes.className = 'save-button'
  no.className = 'cancel-button'
  yes.innerText = 'YES'
  no.innerText = 'NO'
  yes.addEventListener(
    'click',
    deleteHabitFromPage.bind(yes, deleteButton, name)
  )
  no.addEventListener('click', cancelPrompt)
}

function cancelPrompt() {
  this.parentNode.parentNode.remove()
}

function deleteHabitFromPage(element, name, e) {
  e.stopPropagation()
  this.parentNode.parentNode.remove()
  element.parentNode.remove()
  deleteHabitFromData(name)
  if (element.parentNode.classList.contains('clicked-habit')) {
    console.log('yes')
    resetCal()
    splash.style.display = 'flex'
  }
}

function deleteHabitFromData(name) {
  const array = userData.habits
  const newArray = []
  for (const item of array) {
    if (item.habitName !== name) {
      newArray.push(item)
    }
  }
  userData.habits = newArray
  saveUserData()
}

// CONNECT THE CORRECT HABIT TO THE CALENDAR LOAD FUNCTION

function connectCorrectCalendar(name) {
  // INSTRUCIONS
  if (this.classList) {
    Array.from(habitList.children).forEach(item => {
      item.classList.remove('clicked-habit')
    })
    this.parentNode.classList.add('clicked-habit')
  }

  if (!form.classList.contains('hidden')) {
    form.classList.add('hidden')
  }
  const array = userData.habits
  // access the userData.habits array
  for (const item of array) {
    // search for the matching name
    if (name === item.habitName) {
      // take that habit object, and pass it on to loadcalendar
      loadCalendar(item)
    }
  }
}

/*
*********************************
CALENDAR
*********************************
*/

function resetCal() {
  calendarWrapper.innerHTML = ''
  calendar = document.createElement('div')
  calendarWrapper.appendChild(calendar)
  calendar.setAttribute('id', 'calendar')
}

const typeLegend = {
  // legend for the various bodies in game and calendar
  0: ['#00000', 0, ['', '']], // black space
  1: ['#fa138f', 30, ['b', 'c']], // alien level 1
  2: ['#00eeff', 50, ['d', 'e']],
  3: ['#c048ff', 75, ['l', 'm']],
  4: ['#60ffc0', 100, ['r', 's']],
  5: ['#ffb55a', 200, ['f', 'g']],
  10: ['#F9FE0E', 0, ['z', 'z']], // explosion
  20: ['#fff1c2', 0, ['w', 'w']], // player
  25: ['#fff1c2', 0, ['x', 'x']], // player dead
  30: ['#F9FE0E', 0, ['y', 'y']], // bullet from player
  40: ['#EF4423', 0, ['y', 'y']] // bullet from aliens
}

// INIT VALUES
let isReadyToPlay
let currentHabitDay = 0

function loadCalendar(habit) {
  if (document.getElementById('game-over')) {
    main.removeChild(document.getElementById('game-over'))
  }
  resetCal()
  canvas.style.display = 'none'
  calendarWrapper.style.display = 'flex'
  if (!form.classList.contains('hidden')) {
    form.classList.add('hidden')
  }
  if (splash.style.display !== 'none') {
    splash.style.display = 'none'
  }
  if (habit.gameOver) {
    main.appendChild(loadGameOverSplash(habit))
    return
  }
  if (habit.alienList.length !== 0) {
    fastForwardToToday(habit)
  } else currentHabitDay = 0

  // draw calendar
  drawCalendar(habit)
  // check if ready to play
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
  saveUserData()
}

function drawCalendar(habit) {
  for (let i = 0; i < habit.questLength; i++) {
    const box = document.createElement('button')
    if (i < currentHabitDay) {
      const alienType = habit.alienList[i]
      const text = getRandom(typeLegend[alienType][2])
      box.className = `box past alien-${alienType}`
      box.innerText = text
      calendar.appendChild(box)
    } else if (i === currentHabitDay && habit.lastCompleted !== today) {
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
}

function checkIfQuestComplete(habit) {
  const playBtn = document.createElement('button')
  const daysRemaining = habit.questLength - currentHabitDay
  if (daysRemaining === 0) isReadyToPlay = true
  else isReadyToPlay = false
  playBtn.style.display = 'flex'
  playBtn.className = 'game-start-button ready-in'
  playBtn.innerText = 'READY TO PLAY IN :'
  playBtn.style.marginTop = '100px'

  const count = document.createElement('div')
  count.innerText = `${daysRemaining} DAYS`
  count.className = 'countdown'
  count.setAttribute('data-text', `${daysRemaining} DAYS`)

  calendarWrapper.appendChild(playBtn)
  playBtn.appendChild(count)
  if (isReadyToPlay) {
    console.log('yes')
    playBtn.className = 'game-start-button'
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
  if (streak > 6) {
    alienType += 1
  }
  if (streak > 13) {
    alienType += 1
  }
  if (streak > 20) {
    alienType += 1
  }
  if (streak > 27) {
    alienType += 1
  }
  this.className = `box past alien-${alienType} clicked`
  this.innerText = getRandom(typeLegend[alienType][2])
  habit.currentStreak += 1
  if (habit.currentStreak > habit.longestStreak) {
    habit.longestStreak = habit.currentStreak
  }
  habit.lastCompleted = today
  habit.alienList.push(alienType)

  // UPDATE THE HEATMAP
  userData.heatMap[userData.heatMap.length - 1]++
  saveUserData()
  loadHeatMap()
  loadCalendar(habit)
}

function loadGameOverSplash(habit) {
  const gameOverSplash = document.createElement('div')
  gameOverSplash.setAttribute('id', 'game-over')
  const image = document.createElement('img')
  image.src = '../gameover.svg'
  const span = document.createElement('span')
  span.innerText = 'RESTART MISSION'
  span.setAttribute('data-text', 'RESTART MISSION')
  span.classList.add('countdown')
  gameOverSplash.appendChild(image)
  gameOverSplash.appendChild(span)
  span.addEventListener('click', restart.bind(span, habit))
  return gameOverSplash
}

/*
*********************************
GAME
*********************************
*/

const keyBoard = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])
const shootSound = document.createElement('audio')
shootSound.src = 'media/shoot.wav'
const deathSound = document.createElement('audio')
deathSound.src = 'media/death.wav'
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
let gameRunning, alienPicker, aliens
let delta = 0

/*
*********************************
MAIN GAME FUNCTIONS
*********************************
*/

function initGame(habit) {
  if (game) {
    game.self = null
  }
  aliens = habit.alienList
  canvas.style.display = 'block'
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  if (document.fonts.check('85px sprites')) {
    game = new Game(canvas, ctx, habit)
    main.appendChild(score)
    score.innerText = 'SCORE < 0 >'
    score.className = 'score'

    calendarWrapper.style.display = 'none'
    if (document.fonts.check('80px sprites')) {
      game.start()
    }
  }
}

function gameOver(habit, game) {
  if (document.getElementById('game-over')) {
    main.removeChild(document.getElementById('game-over'))
  }
  userData.highScore += game.score
  hiScore.innerText = `HI-SCORE : < ${userData.highScore} >`
  gameRunning = false
  canvas.style.display = 'none'
  main.appendChild(loadGameOverSplash(habit))
  habit.gameOver = true
  saveUserData()
}

function restart(habit) {
  habit.gameOver = false
  habit.alienList = []
  habit.currentStreak = 0
  habit.dateStarted = today
  habit.lastCompleted = null

  saveUserData()
  loadCalendar(habit)
}

/*
*********************************
GAME CLASSES
*********************************
*/

class Game {
  constructor(canvas, context, habit) {
    this.gameSize = new Vec(WIDTH, HEIGHT)
    this.canvas = canvas
    this.ctx = context
    this.bodies = [new Player(this, this.gameSize)].concat(createAliens(this))
    self = this
    this.habit = habit
    this.score = 0
  }

  reset(habit) {
    const resetGame = new Game(canvas, ctx, habit)
    resetGame.bodies = []
    gameRunning = false
    return resetGame
  }

  start() {
    gameRunning = true

    this.loop()
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
    if (delta % 80 === 0) {
      alienPicker = !!alienPicker
      self.bodies = self.bodies.filter(
        body => body.type !== 10 && body.type !== 25
      )
    }

    const remainingAliens = self.bodies.filter(body => body instanceof Alien)
    const player = self.bodies.filter(body => body instanceof Player)
    if (remainingAliens.length === 0 || player.length === 0) {
      gameOver(this.habit, this)
    }

    // update all bodies
    for (const body of self.bodies) {
      body.update()
    }
    // filter out colliding bodies
    self.bodies = self.bodies.filter(body => {
      return notColliding(body) || body.type === 10 || body.type === 25
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
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.bodies.forEach(body => {
      drawBody(ctx, body)
    })
  }

  aliensBelow(alien) {
    return (
      this.bodies.filter(body => {
        return (
          body instanceof Alien &&
          body.center.x === alien.center.x &&
          body.center.y > alien.center.y
        )
      }).length === 0
    )
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

  update() {
    if (game.aliensBelow(this) && Math.random() > 0.9996) {
      const bullet = new Bullet(
        new Vec(this.center.x, this.center.y + this.size.y + 100),
        new Vec(0, 7),
        new Vec(5, 5),
        40
      )
      game.bodies.push(bullet)
    }
    console.log(game.aliensBelow(this))
    if (this.patrolX < -150 || this.patrolX > 150) {
      this.speed.x = -this.speed.x
    }
    this.center = this.center.plus(this.speed)
    this.patrolX += this.speed.x
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
    const hit = game.bodies.filter(body => colliding(this, body))

    if (hit.length > 0) {
      if (hit[0] instanceof Player) {
        hit[0].type = 25
        hit[0].letters = ['x', 'x']
        deathSound.play()
      } else if (!(hit[0] instanceof Bullet)) {
        const points = typeLegend[hit[0].type][1]
        game.score += points
        saveUserData()
        score.innerText = `SCORE < ${game.score} >`
        hit[0].type = 10
        hit[0].colour = 'yellow'
        hit[0].letters = ['z', 'z']
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
  const scale = window.devicePixelRatio
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
    newAliens.push(new Alien(game, new Vec(x, y), type, new Vec(0.5, 0.05), 0))
  }
  newAliens = newAliens.filter(alien => alien.type !== 0)
  return newAliens
}

function drawBody(ctx, body) {
  // draws the bodies to the canvas
  const bodyType = body.type
  if (body instanceof Bullet) {
    ctx.fillStyle = typeLegend[0][0]
    ctx.fillStyle = body.color
    ctx.font = '100px sprites'
    const text = 'y'
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

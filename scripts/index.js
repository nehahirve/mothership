// window will load

var today = getToday()
let firstWeekDay
// var dd = String(today.getDate()).padStart(2, '0')
// var mm = String(today.getMonth() + 1).padStart(2, '0')
// var yyyy = today.getFullYear()

let userData
loadUserData()

let main = document.querySelector('main')
let nav = document.querySelector('nav')
loadStars(nav)
loadStars(main)

function loadUserData() {
  if (localStorage.getItem('locallyStored')) {
    userData = JSON.parse(localStorage.getItem('locallyStored'))
  } else {
    userData = {
      name: 'Tuva',
      highScore: 2000,
      lastLogin: '20-10-20',
      heatMap: [1, 0, 0, 4, 3, 2, 6, 5, 0, 1, 1, 1, 0, 4, 6],
      habits: [
        {
          habitName: 'brush teeth',
          questLength: 31,
          longestStreak: 10,
          currentStreak: 10,
          dateStarted: '20-10-11',
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
          questLength: 18,
          longestStreak: 13,
          currentStreak: 13,
          dateStarted: '20-10-10',
          lastCompleted: '20-10-23',
          alienList: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2]
        }
      ]
    }
    //firstWeekDay = new Date().getDay()
    firstWeekDay = 3
  }
}

function saveUserData() {
  localStorage.setItem('locallyStored', JSON.stringify(userData))
}

// GRAB THE IMPORTANT ELEMENTS FROM THE HTML PAGE
const splash = document.querySelector('#splash')
const form = document.querySelector('form')
const plusIcon = document.getElementById('plus-icon')
const cancelButton = document.querySelector('.cancel-button')
const habitList = document.querySelector('ul')
const nameInput = document.querySelector('#input-name')
const lengthInput = document.querySelector('#input-length')
const heatMap = document.querySelector('#heatmap')

const colorMapping = {
  1: 'yellow',
  2: 'purple',
  3: 'green',
  4: 'orange',
  5: 'red'
}

// LOAD THE PRE EXISTING HABITS

fastForwardHeatMap()

// let box = document.createElement('div')
// heatMap.appendChild(box)
// box.style.background = 'pink'
// box.classList.add('heatmap-div')

function fastForwardHeatMap() {
  let login = userData.lastLogin
  let days = getDaysElapsedFromToday(login, today)
  if (days === 0) {
    loadHeatMap()
  } else {
    for (let i = 0; i < days; i++) {
      userData.heatMap.push(0)
    }
    loadHeatMap()
    console.log(userData.heatMap)
  }

  userData.lastLogin = today

  saveUserData()
}

function loadHeatMap() {
  heatmap.innerHTML = ''
  for( let i = 0; i < firstWeekDay; i++) {
    let box = document.createElement('div');
    heatMap.appendChild(box);
    box.classList.add('heatmap-div');
    box.style.background = 'none';
  }
  userData.heatMap.forEach(dataPoint => {
    let box = document.createElement('div')
    heatMap.appendChild(box)
    box.classList.add('heatmap-div')
    if (dataPoint > 5) {
      dataPoint = 5
    }
    box.style.background = colorMapping[dataPoint]
  })
}

loadExistingHabits()

function loadExistingHabits() {
  for (let item of userData.habits) {
    addHabitToPage(item.habitName)
  }
}

// OPEN THE FORM WHEN PLUS ICON IS CLICKED
plusIcon.addEventListener('click', showForm)

function showForm() {
  form.classList.remove('hidden')
}

// CLOSE THE FORM WHEN CANCEL BUTTON IS CLICKED
cancelButton.addEventListener('click', cancelForm)

function cancelForm(e) {
  e.preventDefault()
  // add class of 'hidden' to the form
  form.classList.add('hidden')
}

// SAVE THE FORM INPUT WHEN SAVE IS PRESSED
form.addEventListener('submit', saveHabitData)

let name
let length

function saveHabitData(e) {
  e.preventDefault()
  name = nameInput.value
  length = lengthInput.value
  // if nameInput has smth && lengthInput has smth && lenghtInput is a number
  // only then
  if (name && +length) {
    addHabitToPage(name)
    addHabitToData(name, length)
  }
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
  deleteButton.addEventListener(
    'click',
    deleteHabitFromPage.bind(deleteButton, name)
  )
  habitListItem.addEventListener('click', showCalendar.bind(deleteButton, name))
}

function addHabitToData(name, length) {
  let newHabit = {
    habitName: name,
    questLength: length,
    longestStreak: 0,
    currentStreak: 0,
    dateStarted: getToday(),
    alienList: []
  }
  let array = userData.habits
  array.push(newHabit)
  saveUserData();
}

function deleteHabitFromPage(name, e) {
  e.stopPropagation()
  this.parentNode.remove()
  deleteHabitFromData(name)
}

function deleteHabitFromData(name) {
  let array = userData.habits
  let newArray = []
  for (let item of array) {
    if (item.habitName !== name) {
      newArray.push(item)
    }
  }
  userData.habits = newArray
  saveUserData();
}

// CONNECT THE CORRECT HABIT TO THE CALENDAR LOAD FUNCTION

function showCalendar(name) {
  // INSTRUCIONS
  if (!form.classList.contains('hidden')) {
    form.classList.add('hidden')
  }
  let array = userData.habits
  // access the userData.habits array
  for (let item of array) {
    // search for the matching name
    if (name === item.habitName) {
      // take that habit object, and pass it on to loadcalendar
      loadCalendar(item)
    }
  }
}

/*
*********************************
NEHA'S PART DON'T WRITE CODE BELOW THIS LINE
*********************************
*/

/*
*********************************
CALENDAR CONSTANTS
*********************************
*/

const calendar = document.querySelector('#calendar')

const playBtn = document.createElement('button')

let currentHabitDay = 0

const typeLegend = {
  0: ['#0b0b0b', 0, ['', '']],
  1: ['#FF32A9', 30, ['b', 'c']],
  2: ['#07E8E8', 50, ['d', 'e']],
  3: ['#FF9526', 75, ['l', 'm']],
  4: ['#6030f0', 100, ['r', 's']],
  5: ['#c048ff', 200, ['f', 'g']],
  10: ['#F9FE0E', 0, ['z', 'z']],
  20: ['#fff1c2', 0, ['w', 'w']],
  25: ['#fff1c2', 0, ['x', 'x']],
  30: ['#F9FE0E', 0, ['y', 'y']],
  40: ['#EF4423', 0, ['y', 'y']]
}

// BINARIES
let isReadyToPlay

/*
*********************************
INIT
*********************************
*/

//loadCalendar(thisHabit)

/*
*********************************
MAIN FUNCTIONS
*********************************
*/

function loadCalendar(habit) {
  if (splash.style.display !== 'none') {
    splash.style.display = 'none'
  }

  if (habit.gameOver) {
    gameOver(habit)
    return
  }

  // UPDATE USER DATA DEPENDING ON LAST LOGIN
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
  saveUserData();
}

function checkIfQuestComplete(habit) {
  const daysRemaining = habit.questLength - currentHabitDay
  if (daysRemaining === 0) isReadyToPlay = true
  playBtn.className = 'game-start-button'
  playBtn.innerText = 'READY TO PLAY IN :'
  playBtn.style.marginTop = '100px'

  const count = document.createElement('div')
  count.innerText = `${daysRemaining} DAYS`
  count.className = 'countdown'
  count.setAttribute('data-text', `${daysRemaining} DAYS`)

  main.appendChild(playBtn)
  main.appendChild(count)
  if (!isReadyToPlay) {
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
  if (streak > 6) {
    alienType += 1
    console.log(alienType)
  }
  if (streak > 13) {
    alienType += 1
    console.log(alienType)
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

  userData.heatMap[userData.heatMap.length - 1]++
  saveUserData();
  loadHeatMap();
}

/*
*********************************
GAME CONSTANTS
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
  aliens = habit.alienList
  canvas.style.display = 'block'
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  if (document.fonts.check('85px sprites')) {
    playBtn.style.display = 'none'
    game = new Game(canvas, ctx, habit)
    main.appendChild(score)
    score.innerText = ` HI-SCORE < ${userData.highScore} >`
    score.className = 'score'
    canvas.style.opacity = 1
    calendar.style.opacity = 0
    if (document.fonts.check('80px sprites')) {
      gameRunning = true
      game.loop()
    }
  }
}

function gameOver(habit) {
  gameRunning = false
  canvas.style.display = 'none'
  splash.children[0].src = '../media/gameover.svg'
  splash.children[1] = document.createElement('button')
  splash.children[1].innerText = 'REPEAT MISSION ?'
  splash.style.display = 'flex'
  habit.gameOver = true
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
      alienPicker = alienPicker ? false : true
      self.bodies = self.bodies.filter(
        body => body.type !== 10 && body.type !== 25
      )
    }

    const remainingAliens = self.bodies.filter(body => body instanceof Alien)
    const player = self.bodies.filter(body => body instanceof Player)
    if (remainingAliens.length === 0 || player.length === 0) {
      gameOver(this.habit)
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
        hit[0].type = 25
        hit[0].letters = ['x', 'x']
        deathSound.play()
      } else if (!(hit[0] instanceof Bullet)) {
        const points = typeLegend[hit[0].type][1]
        userData.highScore += points
        saveUserData();
        score.innerText = ` HI-SCORE < ${userData.highScore} >`
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
    newAliens.push(new Alien(game, new Vec(x, y), type, new Vec(0.5, 0.05), 0))
  }
  newAliens = newAliens.filter(alien => alien.type !== 0)
  return newAliens
}

function drawBody(ctx, body) {
  let bodyType = body.type
  if (body instanceof Bullet) {
    ctx.fillStyle = typeLegend[0][0]
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

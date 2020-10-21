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
      lastCompleted: '20-10-16',
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
      questLength: 31,
      longestStreak: 0,
      currentStreak: 0,
      dateStarted: '20-10-17',
      alienList: []
    }
  ]
}

const thisHabit = userData.habits[0]

/*
*********************************
CONSTANTS
*********************************
*/

const calendar = document.querySelector('#calendar')
const main = document.querySelector('main')
const startBtn = document.createElement('button')

let currentHabitDay = 0
const alienKeyCodes = {
  0: ['', ''],
  1: ['b', 'c'],
  2: ['d', 'e'],
  3: ['l', 'm'],
  4: ['r', 's'],
  5: ['f', 'g'],
  10: ['z', 'z']
}

// BINARIES
let isReadyToPlay

/*
*********************************
INIT
*********************************
*/

init()

function init() {
  loadStars()
  if (thisHabit.alienList.length !== 0) {
    fastForwardToToday()
  }
  loadCalendar()
  checkIfQuestComplete()
}

/*
*********************************
MAIN FUNCTIONS
*********************************
*/

function fastForwardToToday() {
  const elapsedDays = getDaysElapsedFromToday(
    thisHabit.lastCompleted,
    getToday()
  )
  if (elapsedDays > 1) {
    for (let i = 0; i < elapsedDays; i++) {
      thisHabit.alienList.push(0)
    }
    thisHabit.lastCompleted = getToday(-1)
    thisHabit.currentStreak = 0
  }
  currentHabitDay = thisHabit.alienList.length
}

function loadCalendar() {
  for (let i = 0; i < thisHabit.questLength; i++) {
    const box = document.createElement('button')
    if (i < currentHabitDay) {
      const alienType = thisHabit.alienList[i]
      const text = getRandom(alienKeyCodes[alienType])
      box.className = `box past alien-${alienType}`
      box.innerText = text
      calendar.appendChild(box)
    } else if (i == currentHabitDay) {
      box.className = 'box current'
      box.innerText = `${i + 1}`
      calendar.appendChild(box)
      box.addEventListener('click', completeHabit)
    } else {
      box.className = 'box future'
      box.innerText = `${i + 1}`
      calendar.appendChild(box)
    }
  }
}

function checkIfQuestComplete() {
  const daysRemaining = thisHabit.questLength - currentHabitDay
  isReadyToPlay = daysRemaining === 0 ? true : false
  startBtn.className = 'game-start-button'
  startBtn.innerText = `READY TO PLAY IN :`
  const count = document.createElement('div')

  count.innerText = `${daysRemaining} DAYS`
  count.className = 'countdown'
  count.setAttribute('data-text', `${daysRemaining} DAYS`)

  main.appendChild(startBtn)
  main.appendChild(count)
  if (true) {
    main.removeChild(count)
    startBtn.innerText = 'PRESS TO PLAY'
    startBtn.style.marginTop = '100px'
    startBtn.setAttribute('data-text', 'PRESS TO PLAY')
    startBtn.classList.add('countdown')
    startBtn.addEventListener('click', initGame)
  }
}

function completeHabit() {
  this.removeEventListener('click', completeHabit)
  const streak = thisHabit.currentStreak
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
  this.innerText = getRandom(alienKeyCodes[alienType])
  thisHabit.currentStreak += 1
  thisHabit.longestStreak =
    thisHabit.longestStreak < thisHabit.currentStreak
      ? thisHabit.currentStreak
      : thisHabit.longestStreak
  thisHabit.lastCompleted = getToday()
  thisHabit.alienList.push(alienType)
}

function loadStars() {
  for (let i = 0; i < 2; i++) {
    const star = document.createElement('div')
    star.className = `star${i + 1}`
    star.style.position = 'absolute'
    star.style.top = '0'
    main.appendChild(star)
  }
}

const keyBoard = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])

function initGame() {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  if (document.fonts.check('85px sprites')) {
    main.removeChild(startBtn)
    game = new Game(canvas, ctx)
    main.appendChild(score)
    score.innerText = ` HIGH SCORE : ${highScore}`
    score.className = 'score'
    //gameRunning = true
    canvas.style.opacity = 1
    calendar.style.opacity = 0
    if (document.fonts.check('80px sprites')) {
      gameRunning = true
      game.loop()
    }
    window.addEventListener('keydown', gameOver)
  }
}

function gameOver() {
  gameRunning = false
  canvas.remove()
  let gameOver = document.createElement('div')
  main.appendChild(gameOver)
  gameOver.innerText = 'GAME OVER '
  gameOver.className = 'game-over'

  console.log(main)
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

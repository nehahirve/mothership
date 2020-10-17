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

const thisHabit = userData.habits[2]

/*
*********************************
CONSTANTS
*********************************
*/

const calendar = document.querySelector('#calendar')
const main = document.querySelector('main')

let currentHabitDay = 0
const alienKeyCodes = {
  0: ['', ''],
  1: ['b', 'c'],
  2: ['d', 'e'],
  3: ['l', 'm']
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
  const elapsedDays = getElapsedDays(thisHabit.lastCompleted, getToday())
  if (elapsedDays > 1) {
    for (let i = 0; i < elapsedDays; i++) {
      thisHabit.alienList.push('0')
    }
    thisHabit.lastCompleted = getYesterday()
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
  const startBtn = document.createElement('button')
  startBtn.className = 'game-start-button'
  startBtn.innerText = `READY TO PLAY IN :`
  const count = document.createElement('div')

  count.innerText = `${daysRemaining} DAYS`
  count.className = 'countdown'
  count.setAttribute('data-text', `${daysRemaining} DAYS`)

  main.appendChild(startBtn)
  main.appendChild(count)
  if (isReadyToPlay) {
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
  }
  console.log(alienType)
  this.className = `box past alien-${alienType} clicked`
  this.innerText = getRandom(alienKeyCodes[alienType])
  thisHabit.currentStreak += 1
  thisHabit.longestStreak =
    thisHabit.longestStreak < thisHabit.currentStreak
      ? thisHabit.currentStreak
      : thisHabit.longestStreak
  thisHabit.lastCompleted = getToday()
}

function initGame() {
  console.log('play game')
}

/*
*********************************
HELPER FUNCTIONS
*********************************
*/

function getToday() {
  // gets and formats date
  const year = new Date().getFullYear().toString().slice(2)
  let month = new Date().getMonth() + 1
  if (month < 10) month = `0${month}`
  const date = new Date().getDate()
  if (date < 10) month = `0${date}`
  return `${year}-${month}-${date}`
}

function getYesterday() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const year = yesterday.getFullYear().toString().slice(2)
  let month = yesterday.getMonth() + 1
  if (month < 10) month = `0${month}`
  const date = yesterday.getDate()
  if (date < 10) month = `0${date}`
  return `${year}-${month}-${date}`
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getElapsedDays(date1, date2) {
  let isLeapYear
  if (date1[0] % 4 === 0) isLeapYear = true
  date1 = date1.split('-').map(number => +number)
  date2 = date2.split('-').map(number => +number)
  const yeardiff = date2[0] - date1[0]
  const monthdiff = date2[1] - date1[1]
  const daydiff = date2[2] - date1[2]
  let monthLength, yearLength
  if ([4, 6, 9, 11].includes(date1[1])) {
    monthLength = 30
  } else if ([2].includes(date1[1])) {
    if (isLeapYear) monthLength = 29
    else monthLength = 28
  } else monthLength = 31
  if (isLeapYear) yearLength = 366
  else yearLength = 365
  if (yeardiff === 0) {
    if (monthdiff === 0) {
      return daydiff
    } else {
      return monthLength + daydiff - 1
    }
  } else {
    console.log(yearLength, monthLength)
    return yeardiff + monthLength + daydiff - 1
  }
}

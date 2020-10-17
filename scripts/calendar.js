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
      longestStreak: 7,
      currentStreak: 1,
      dateStarted: '20-09-30',
      lastCompleted: '20-10-21',
      alienList: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 1]
    },
    {
      habitName: 'drink vodka',
      questLength: 50,
      longestStreak: 7,
      currentStreak: 1,
      dateStarted: '20-09-25',
      lastCompleted: '20-09-30',
      alienList: [1, 1, 1, 0, 1, 1]
    }
  ]
}

/*
*********************************
CONSTANTS
*********************************
*/

const calendar = document.querySelector('#calendar')
const main = document.querySelector('main')
const thisHabit = userData.habits[1]
let currentHabitDay
const alienKeyCodes = {
  0: ['', ''],
  1: ['b', 'c'],
  2: ['e', 'f'],
  3: ['l', 'm']
}

// BINARIES
let isReadyToPlay

/*
*********************************
ON TRIGGER
*********************************
*/

init()

/*
*********************************
MAIN
*********************************
*/

function init() {
  fastForwardToToday()
  loadCalendar()
  checkIfQuestComplete()
}

function fastForwardToToday() {
  const elapsedDays = getElapsedDays(thisHabit.lastCompleted, getToday())

  for (let i = 0; i < elapsedDays; i++) {
    thisHabit.alienList.push('0')
  }
  thisHabit.lastCompleted = getYesterday()
  thisHabit.currentStreak = 0
  currentHabitDay = thisHabit.alienList.length
}

function loadCalendar() {
  for (let i = 0; i < thisHabit.questLength; i++) {
    const box = document.createElement('button')
    if (i < currentHabitDay) {
      let alienType = thisHabit.alienList[i]
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
  startBtn.innerText = `READY TO PLAY IN : 
    `
  const span = document.createElement('span')
  span.innerText = `${daysRemaining} DAYS`
  span.className = 'game-start-button countdown'
  startBtn.insertAdjacentElement('beforeend', span)
  main.appendChild(startBtn)
  if (true) {
    startBtn.innerText = 'PRESS TO PLAY'
    startBtn.classList.add('countdown')
    startBtn.addEventListener('click', initGame)
  }
}

function completeHabit() {
  console.log(this.innerText)
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
  let date = new Date().getDate()
  if (date < 10) month = `0${date}`
  return `${year}-${month}-${date}`
}

function getYesterday() {
  const today = new Date()
  let yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const year = yesterday.getFullYear().toString().slice(2)
  let month = yesterday.getMonth() + 1
  if (month < 10) month = `0${month}`
  let date = yesterday.getDate()
  if (date < 10) month = `0${date}`
  return `${year}-${month}-${date}`
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getElapsedDays(date1, date2) {
  date1 = date1.split('-').map(number => +number)
  date2 = date2.split('-').map(number => +number)
  let yeardiff = date2[0] - date1[0]
  let monthdiff = date2[1] - date1[1]
  let daydiff = date2[2] - date1[2]
  let monthLength
  if ([4, 6, 9, 11].includes(date1[1])) {
    monthLength = 30
  } else if ([2].includes(date1[1])) {
    monthLength = 29
  }
  if (yeardiff === 0) {
    if (monthdiff === 0) {
      return daydiff
    } else {
      return monthLength + daydiff - 1
    }
  }
}

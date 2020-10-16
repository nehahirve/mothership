/*
*********************************
SAMPLE USER DATA
*********************************
*/

const userData = {
  name: 'Tuva',
  highScore: 2000,
  habits: [
    {
      habitName: 'brush teeth',
      questLength: 50,
      longestStreak: 5,
      currentStreak: 1,
      dateStarted: '201010',
      alienList: [1, 1, 1, 1, 1, 1, 1, 2, 0, 1]
    }
  ]
}

/*
*********************************
END SAMPLE USER DATA
*********************************
*/

const thisHabit = userData.habits[0]

const habitDay = habit => habit.alienList.length

getCurrentDate()

/*
*********************************
VARIABLES
*********************************
*/

const canvas = document.querySelector('canvas') // grab important DOM elements
const canvasContainer = document.querySelector('#canvas') // grab important DOM elements
const ctx = canvas.getContext('2d')

let WIDTH = canvas.width
let HEIGHT = canvas.height

const spriteFont = new FontFace('sprites', 'url(/../fonts/sprites.ttf)')
const spaceFont = new FontFace('space', 'url(/../fonts/spaceinvaders.ttf)')

let isReadyToPlay

/*
*********************************
ON LOAD
*********************************
*/
resizeCanvas()
window.addEventListener('resize', resizeCanvas)

function populateNumbers() {
  let xCoordinate = 200
  let yCoordinate = HEIGHT / 6
  ctx.font = '50px space'
  for (let i = 0; i < thisHabit.questLength; i++) {
    console.log(i)
    if (i < habitDay(thisHabit)) {
      xCoordinate += 60
      if ((i + 1) % 8 == 0) {
        yCoordinate += 60
        xCoordinate = 200
      }
      continue
    }
    if (i == habitDay(thisHabit)) {
      animateCurrentDay(xCoordinate, yCoordinate)
    } else ctx.fillStyle = 'red'

    ctx.fillText(i + 1, xCoordinate, yCoordinate)

    xCoordinate += 60
    if ((i + 1) % 8 == 0) {
      yCoordinate += 60
      xCoordinate = 200
    }
  }
}

function populateAliens() {
  let xCoordinate = 200
  let yCoordinate = HEIGHT / 6
  spriteFont.load().then(function () {
    ctx.font = '40px sprites'
    for (let i of thisHabit.alienList) {
      if (i == 1) ctx.fillStyle = 'red'
      else if (i == 0) ctx.fillStyle = 'black'
      else ctx.fillStyle = 'green'

      ctx.fillText('g', xCoordinate, yCoordinate)
      xCoordinate += 60
      if ((thisHabit.alienList.indexOf(i) + 1) % 8 == 0) {
        yCoordinate += 60
        xCoordinate = 200
      }
    }
  })
}

populateAliens()
populateNumbers()

/*
*********************************
MAIN FUNCTIONS
*********************************
*/

function resizeCanvas() {
  canvas.width = canvas.parentElement.offsetWidth
  WIDTH = canvas.width
  canvas.height = canvas.parentElement.offsetHeight
  HEIGHT = canvas.height
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

/*
*********************************
HELPER FUNCTIONS
*********************************
*/

function getCurrentDate() {
  const year = new Date().getFullYear().toString().slice(2)
  let month = new Date().getMonth()
  if (month < 10) month = `0${month}`
  let date = new Date().getDate()
  if (date < 10) month = `0${date}`
  return `${year}${month}${date}`
}

function animateCurrentDay(x, y) {
  console.log(x, y)
  const day = document.createElement('div')
  day.style.position = 'absolute'
  day.style.backgroundColor = 'yellow'
  day.innerText = `${1 + habitDay(thisHabit)}`
  day.style.left = `${x}px`
  day.style.top = `${y - 40}px`
  day.style.width = '50px'
  day.style.height = '50px'
  canvasContainer.appendChild(day)
  day.addEventListener('click', this.completeHabit.bind(day, x, y))
}

function completeHabit(x, y) {
  this.parentElement.removeChild(this)
  ctx.fillStyle = 'red'
  ctx.fillText('f', x, y)
  updateHabit()
  thisHabit.alienList.push(1)
  console.log(thisHabit)
}

function updateHabit() {}

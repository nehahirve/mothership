/*
*********************************
SAMPLE USER DATA
*********************************
*/

const userData = {
  name: 'Tuva',
  highScore: 2000,
  lastLogin: '201021',
  habits: [
    {
      habitName: 'brush teeth',
      questLength: 31,
      longestStreak: 7,
      currentStreak: 1,
      dateStarted: '201010',
      lastCompleted: '201021',
      alienList: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 1]
    }
  ]
}

/*
*********************************
END SAMPLE USER DATA
*********************************
*/
const habitDay = habit => habit.alienList.length
const calendar = document.querySelector('#calendar')
const thisHabit = userData.habits[0]

const alienKeyCodes = {
  0: ['', ''],
  1: ['b', 'c'],
  2: ['e', 'f'],
  3: ['l', 'm']
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

loadCalendar()
function loadCalendar() {
  for (let i = 0; i < thisHabit.questLength; i++) {
    const box = document.createElement('button')
    if (i < habitDay(thisHabit)) {
      let alienType = thisHabit.alienList[i]
      const text = getRandom(alienKeyCodes[alienType])
      box.className = `box past alien-${alienType}`
      box.innerText = text
      calendar.appendChild(box)
    } else if (i == habitDay(thisHabit)) {
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

function completeHabit() {
  console.log(this.innerText)
}

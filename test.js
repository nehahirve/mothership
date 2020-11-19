let userData = {
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
    }
  ]
}

class Habit {
  constructor(name, length) {
    this.habitName = name
    this.questLength = length
    this.longestStreak = 0
    this.currentStreak = 0
    this.dateStarted = getToday()
    this.alienList = []
  }

  update(name, length) {
    const updated = new Habit(name, length)
    return updated
  }
}

let habit = new Habit('code', 30)
habit = habit.update('brush teeeeth', 40)
userData.habits.push(habit)

function getToday(offset = 0) {
  const today = new Date()
  const day = new Date(today)
  day.setDate(today.getDate() + offset)
  return day.toISOString().slice(2, 10)
}

console.log(getToday())

function getHabit(name) {
  return userData.habits.filter(habit => habit.habitName === name)[0]
}

function removeHabitFromUserData(name) {
  userData = userData.habits.filter(habit => habit.habitName !== name)
}

let date = getToday()

function getDaysElapsedFromToday(date, today) {
  let counter = 0
  while (date !== today) {
    today = getToday(-counter - 1)
    counter++
  }
  return counter
}

let aliens = [1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1]

let long = 0
let current = 0

function change(array) {
  let type = 1
  current = 0
  let newArray = array.map(alien => {
    if (current > 6) type = 2
    if (current > 13) type = 3
    if (alien === 0) {
      current = 0
      type = 1
      return 0
    } else {
      current++
      return type
    }
  })
  long = long > current ? long : current
  return newArray
}

let aliens2 = change(aliens)
console.log(aliens2)

getHabit('brush teeth').questLength = 40

// find last 0 or start of Array
// calc ones in between
// calc alien type

// number needed for next streak = between + 1
// count that many steps ahead, change to alientype

// next step add alientype plus one until encounter a 0 or the end of the array
// update streaks
// redraw cal

// putting back to 0 :
// next 7, set alien type to 1 until encounter 0 or end
// next 7, set alien type to 2 until encounter 0 or end
// update streaks
// redraw cal

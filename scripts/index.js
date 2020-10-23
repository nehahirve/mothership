// window will load
var today = new Date()
var dd = String(today.getDate()).padStart(2, '0')
var mm = String(today.getMonth() + 1).padStart(2, '0')
var yyyy = today.getFullYear()

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
  }
}

function saveUserData() {
  localStorage.setItem('locallyStored', JSON.stringify(userData))
}

// unhide
const form = document.querySelector('form')

let plusIcon = document.getElementById('plus-icon')
function showForm() {
  form.classList.remove('hidden')
}
plusIcon.addEventListener('click', showForm)

// cancel button
let cancelButton = document.querySelector('.cancel-button')
cancelButton.addEventListener('click', cancelForm)

function cancelForm(e) {
  e.preventDefault()
  console.log('The string should be canceled.')
  // add class of 'hidden' to the form
  form.classList.add('hidden')
}

// DUMMY DATA TEMPORARY
let name = 'go to bed early'
let length = 30

let habitList = document.querySelector('ul')




console.log(userData.habits)



function loadExistingHabits () {
  for (let item of userData.habits) {
    console.log(item.habitName)
    addHabitToPage(item.habitName)
  }
}

loadExistingHabits()






function deleteHabitFromData(name) {
  let array = userData.habits
    let newArray = []
    for (let item of array) {
      if (item.habitName !== name) {
        newArray.push(item)
      }
    }
    userData.habits = newArray
  }




function addHabitToPage(name) {
  const habitListItem = document.createElement('li')
  habitList.appendChild(habitListItem)
  habitListItem.innerText = name
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('delete-button')
  deleteButton.innerText = 'X'
  habitListItem.appendChild(deleteButton)
  habitListItem.classList.add('habit-list-item')
  deleteButton.addEventListener('click', deleteHabitFromPage.bind(deleteButton, name))
}

function deleteHabitFromPage(name) {
  this.parentNode.remove()
  deleteHabitFromData(name)
  console.log(userData.habits)
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
}
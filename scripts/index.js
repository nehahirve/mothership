// window will load
var today = new Date()
var dd = String(today.getDate()).padStart(2, '0')
var mm = String(today.getMonth() + 1).padStart(2, '0')
var yyyy = today.getFullYear()

let userData
loadUserData()
console.log(userData)
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
      highScore: 0,
      lastLogin: getToday(),
      habits: []
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
let name = 'code'
let length = 30

let habitList = document.querySelector('ul');

function addHabit(name, length) {
  // create a habit object
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

  const habitListItem = document.createElement('li')
  habitList.appendChild(habitListItem)
  habitListItem.innerText = name
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('delete-button');
  deleteButton.innerText = 'X';
  habitListItem.appendChild(deleteButton)
  habitListItem.classList.add('habit-list-item')
}

addHabit(name, length)


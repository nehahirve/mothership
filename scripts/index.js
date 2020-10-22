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
let name = 'brush teeth'
let length = 30

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

  // save userData
  // incomplete section!!!
  // create a list element
  const habitListItem = document.createElement('li')
  // create a button element
  const deleteButton = document.createElement('button')
  // add the button element inside the list element
  // give list element a class
  // set the text of the list element to the habit name
  // give the button elememt a class
  // add the list elemen to the <ul> element
}

addHabit(name, length)

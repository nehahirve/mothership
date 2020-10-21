// window will load
var today = new Date()
var dd = String(today.getDate()).padStart(2, '0')
var mm = String(today.getMonth() + 1).padStart(2, '0')
var yyyy = today.getFullYear()

let userData, userDataJSON
loadUserData()

function loadUserData() {
  if (localStorage.getItem('userDataJSON') === null) {
    userData = {
      name: 'Tuva',
      highScore: 0,
      lastLogin: today,
      habits: []
    }
  } else {
    userData = JSON.parse(localStorage.getItem('userDataJSON'))
  }
}

window.addEventListener('beforeunload', saveUserData)

function saveUserData() {
  userDataJSON = JSON.stringify('userData')
  localStorage.setItem('userDataJSON', userDataJSON)
}

// unhide
const form = document.querySelector('form')
let plusIcon = document.getElementById('plus-icon')
function showForm() {
  form.classList.remove('hidden')
}
plusIcon.addEventListener('click', showForm)

// cancel button
let cancelButton = document.querySelector('.cancelButton')
cancelButton.addEventListener('click', cancelForm)
function cancelForm() {
  console.log('The string should be canceled.')

  // add class of 'hidden' to the form
  form.classList.add('hidden')
}

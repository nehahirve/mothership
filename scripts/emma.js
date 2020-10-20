//const savedData = document.getElementById('habit-list') {}




// unhide 
const form = document.querySelector('form');
let plusIcon = document.getElementById('plus-icon');
function showForm(){
    form.classList.remove('hidden')
}
//plusIcon = document.querySelector('form.hidden') 
plusIcon.addEventListener('click', showForm);
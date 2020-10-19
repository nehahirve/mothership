let user = document.querySelector('.user'); 
let userInput = document.querySelector('#userinput'); 

window.addEventListener('DOMContentLoaded', displayUsers); 

// U S E R
window.addEventListener('keypress', key => {
    if (key.keyCode == 13) { 
        if (userInput.value) { 
            addUser(userInput.value); 
            saveToStorage(userInput.value); 
            userInput.value = ''; 
        } else {
            alert('Create a username!')
        }
    }
});

function addUser() { 
    const div = document.createElement('div'); 
    div.classList.add('div-bg'); 
    div.innerHTML = userInput.value; 

    const btn = document.createElement('button') 
    btn.innerHTML = 'Delete'; 

    div.appendChild(btn); 
    user.appendChild(div); 

    btn.addEventListener('click', () => { div.remove(); } 

    );
}

function saveToStorage(users) { 
    let userData;
    if (localStorage.getItem('userData') === null) {
        userData = [];
    } else {
        userData = JSON.parse(localStorage.getItem('userData'));
    }

    userData.push(users);
    localStorage.setItem('userData', JSON.stringify(userData)); 

}

function displayUsers() { 
    let userData;
    if (localStorage.getItem('userData') === null) { 
        userData = [];
    } else {
        userData = JSON.parse(localStorage.getItem('userData'));
    }
    userData.forEach(function (users) {
        const div = document.createElement('div');
        div.classList.add('div-bg');
        div.innerHTML = users;

        const btn = document.createElement('button')
        btn.classList.add('btn');
        btn.innerHTML = 'Delete';

        div.appendChild(btn);
        user.appendChild(div);

        btn.addEventListener('click', () => { 
            deleteList(users);
            div.remove();
        });
    });
}

function deleteList(users) { 
    let userData;
    if (localStorage.getItem('userData') === null) {
        userData = [];
    } else {
        userData = JSON.parse(localStorage.getItem('userData'));
    }

    const listUsers = userData.indexOf(users); 
    userData.splice(listUsers, 1); 
    localStorage.setItem('userData', JSON.stringify(userData));
}
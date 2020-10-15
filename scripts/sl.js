let cart = document.querySelector('.cart'); //applies on the first class
let input = document.querySelector('#input'); //applies on the first id

window.addEventListener('DOMContentLoaded', displayList); //when the website has loaded, the function 'displayList' happens

window.addEventListener('keypress', key => {
    if (key.keyCode == 13) { //if I press the enter button,
        if (input.value) { //and if I add the value to the input field,
            addToCart(input.value); //the value is added to the list,
            saveToStorage(input.value); //and it is added to the storage too,
            input.value = ''; //empties the input field.
        } else { // OTHERWISE if the input is empty,
            alert('Please input value.') // it notifies the user.
        }
    }
});

function addToCart() { //creates a function
    const div = document.createElement('div'); //creates a div
    div.classList.add('div-bg'); //creates a background div inside the div list
    div.innerHTML = input.value; //input value is the text="text"

    const btn = document.createElement('button') //creates a button
    btn.classList.add('btn'); //
    btn.innerHTML = 'Delete'; // button 'delete'

    div.appendChild(btn); //adding to the end
    cart.appendChild(div); //adding to the end

    btn.addEventListener('click', () => { div.remove(); } //removes a div by clickling the button

    );
}

/*The localStorage object stores data with no expiration date. 
The data will not be deleted when the browser is closed, 
and will be available the next day, week, or year.*/

function saveToStorage(list) { 
    let listItem;
    if (localStorage.getItem('listItem') === null) {
        listItem = [];
    } else {
        listItem = JSON.parse(localStorage.getItem('listItem'));
    }

    /* The JSON.parse method provides an 
    optional second argument: a reviver function 
    that can be used to screen or modify the values being parsed.*/

    listItem.push(list);
    localStorage.setItem('listItem', JSON.stringify(listItem)); //saves the item in localStorage

    /*The JSON.stringify() method converts a JavaScript object or value to a JSON string.*/
}

function displayList() { //displays stored data as an array in localStorage
    let listItem;
    if (localStorage.getItem('listItem') === null) { //=== equal value
        listItem = [];
    } else {
        listItem = JSON.parse(localStorage.getItem('listItem'));
    }
    listItem.forEach(function (list) {
        const div = document.createElement('div');
        div.classList.add('div-bg');
        div.innerHTML = list;

        const btn = document.createElement('button')
        btn.classList.add('btn');
        btn.innerHTML = 'Delete';

        div.appendChild(btn);
        cart.appendChild(div);

        btn.addEventListener('click', () => { //deletes data from localStorage 
            deleteList(list);
            div.remove();
        });
    });
}

function deleteList(list) { //how is the data deleted
    let listItem;
    if (localStorage.getItem('listItem') === null) {
        listItem = [];
    } else {
        listItem = JSON.parse(localStorage.getItem('listItem'));
    }

    const listIndex = listItem.indexOf(list); //returns the first index at which a given element can be found in the array
    listItem.splice(listIndex, 1); //changes the contents of an array by removing existing elements
    localStorage.setItem('listItem', JSON.stringify(listItem));
}
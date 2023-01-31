const BASE_URL = ('https://jsonplaceholder.typicode.com/todos');
// const BASE_URL = ('https://jsonplaceholder.typicode.com/users/1/todos')
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const list = document.querySelector("#tasks");
const output = document.querySelector('#output');
const modalB = document.querySelector('#modal')
const closeModal = document.querySelector('#closeModal');
modalB.classList.add('modalhide') 
let todos = []

//  Hämtar ärend
fetch(BASE_URL + '?_limit=7') // '?_limit=7' limit är 7
.then(res => {
    return res.json();
})
.then(data =>{
    // console.log(data);
    todos = data
    todos.forEach(todo => {
        byggEttElement(todo)
    });
}) 
.catch(error => console.log(error))

// Hindrar omladdningen
form.addEventListener('submit', (e) => {
    e.preventDefault();
        const textVärdet = input.value.trim();
            const error = document.querySelector(".error");
                error.textContent = "";
//  Post 
fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
        title: textVärdet,
        completed: false,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
}) // om det inte är något textvärde så kommer felmeddelande. 
    .then((response) => response.json())
        .then((data) => {
            if (textVärdet === '') {
                    error.textContent = "Fyll i något du behöver göra";
                return;
            } else {
            // console.log(textVärdet)
            byggEttElement(data)
        }
    });
});
// fabrik
const byggEttElement = (data) => {
    const task = document.createElement('div');
	    task.classList.add('task');
    const taskChild = document.createElement('div');
	    taskChild.classList.add('content');
            task.appendChild(taskChild);
    const inputValue = document.createElement('input');
	    inputValue.classList.add('text');
        inputValue.classList.remove('active')  
	    inputValue.type = 'text';
	    inputValue.value = data.title;
	    inputValue.setAttribute('readonly', 'readonly');
            taskChild.appendChild(inputValue);
// Knappfabriken
const kroppen = document.createElement('div');
	kroppen.classList.add('actions');
const actionEdit = document.createElement('button');
	actionEdit.classList.add('edit');
	    actionEdit.innerText = 'Edit';
const actionDelete = document.createElement('button');
	actionDelete.classList.add('delete');
	    actionDelete.innerText = 'Delete'; 
const actionDone = document.createElement('button');
if (data.completed) {
        inputValue.classList.add('active');
}
	actionDone.classList.add('done');
	    actionDone.innerText = 'Done'; 

kroppen.appendChild(actionDone);
kroppen.appendChild(actionEdit);
kroppen.appendChild(actionDelete);
task.appendChild(kroppen);
list.prepend(task); // tvärtom mot append, början

input.value = '';

// redigera eller spara
actionEdit.addEventListener('click', (e) => {
	if (actionEdit.innerText.toLowerCase() == "edit") {
		actionEdit.innerText = "Save";
		inputValue.removeAttribute("readonly");
		inputValue.focus();
	} else {
		actionEdit.innerText = "Edit";
		inputValue.setAttribute("readonly", "readonly");
	}
}); 
// radera task (förälder)

actionDelete.addEventListener('click', (e) => {  
    if (inputValue.classList.contains('active')) {
        modalB.classList.add('modalhide') 
    } else {
        modalB.classList.remove('modalhide')
        return  
}  
    // fetch funktion och raderar till länken 
    fetch(BASE_URL + '/' + data.id, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.status == 200){
            todos = todos.filter(todo => todo.id !== data.id)
            list.removeChild(task);
        }
    })
});

// Markerar färdiga 
actionDone.addEventListener("click", (e) => {
    if (inputValue.classList.contains('active')) {
        actionDone.innerText = 'done'; 
        inputValue.classList.remove('active');
    } else {
        inputValue.classList.add('active');
        actionDone.innerText = 'ångra'; 
    }
});

closeModal.addEventListener('click', (e) => {
    modalB.classList.add('modalhide')
})
};
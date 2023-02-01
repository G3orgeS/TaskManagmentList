const BASE_URL = ('https://jsonplaceholder.typicode.com/todos');
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const list = document.querySelector("#tasks");
const output = document.querySelector('#output');
const modal = document.querySelector('#modal')
const closeModal = document.querySelector('#closeModal');
const error = document.querySelector(".error");
modal.classList.add('modalhide') 
let todos = []

// fetchar länken, begränsar till 7 tasks och kör taskBuilder för varje task
fetch(BASE_URL + '?_limit=7') // '?_limit=7' limit är 7
    // fetch(BASE_URL)
    .then(res => {
        return res.json();
})
    .then(data =>{
        todos = data
        todos.forEach(todo => {
            taskBuilder(todo)
    });
}) 
.catch(error => console.log(error))

// postar fetch, hindrar omladdning och kör felmeddelande om forminput är tom
form.addEventListener('submit', (e) => {
    e.preventDefault();
        const inputValue = input.value.trim();
            error.textContent = "";

fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
    title: inputValue,
    completed: false,
}),
        headers: {'Content-type': 'application/json; charset=UTF-8',},
}) 
    .then((response) => response.json())
    .then((data) => {
        if (inputValue === '') {
            error.textContent = "*Fyll i något du behöver göra";
                return;
        } else {
            taskBuilder(data)
        }
    });
});

// taskbuilder, bygger element i DOM, div med inputvärdet och btn 
const taskBuilder = (data) => {
const task = document.createElement('div');
const taskChild = document.createElement('div');
const inputValue = document.createElement('input');
    task.classList.add('task');
    taskChild.classList.add('content');
    inputValue.classList.add('text');
	inputValue.value = data.title;
    inputValue.setAttribute('readonly', 'readonly');
        task.appendChild(taskChild);
        taskChild.appendChild(inputValue);
const actionParent = document.createElement('div');
const actionEdit = document.createElement('button');
const actionDelete = document.createElement('button');
const actionDone = document.createElement('button');
    actionParent.classList.add('actions');
    actionDone.classList.add('done');
    actionEdit.classList.add('edit');
	actionDelete.classList.add('delete');
       actionEdit.innerText = 'Edit';
       actionDelete.innerText = 'Delete'; 
            if (data.completed) { // stylar om completed är true
                    inputValue.classList.add('active');
                    actionDone.innerText = 'Ångra';
            } else {
	            actionDone.innerText = 'Done';   
            }
actionParent.appendChild(actionDone);
actionParent.appendChild(actionEdit);
actionParent.appendChild(actionDelete);
task.appendChild(actionParent);
list.prepend(task); // append =/= prepend
input.value = '';

// redigera och fetchar ändraringar på title 
actionEdit.addEventListener('click', (e) => {
    if (inputValue.classList.contains('active')) {
            return;
    }
   else if (actionEdit.innerText == "EDIT") {
        actionEdit.innerText = "SAVE";
        inputValue.removeAttribute("readonly");
        inputValue.focus();
   } else if (actionEdit.innerText == "SAVE") {
    fetch(BASE_URL + '/' + data.title, {
        method: 'PATCH',
        headers: {'Content-type': 'application/json; charset=UTF-8',},
        body: JSON.stringify({title:inputValue.value})
    })
        .then(res => res.json())
        .then(todo => {
            data.title = todo.title
                actionEdit.innerText = "EDIT";
                inputValue.setAttribute("readonly", "readonly");
        })
    }
}); 

// radera, om completed är false, ta bort klass för att dölja modal
actionDelete.addEventListener('click', (e) => {  
    if (inputValue.classList.contains('active')) {
            modal.classList.add('modalhide') 
    } else {    
            modal.classList.remove('modalhide')
                return;  
}  
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

// fetchar ändring och stylar om done knappen. 
actionDone.addEventListener("click", (e) => {
    fetch(BASE_URL + '/' + data.id, {
        method: 'PATCH',
        headers: {'Content-type': 'application/json; charset=UTF-8',},
        body: JSON.stringify({completed:!data.completed})
    })
        .then(res => res.json())
        .then(todo => {
            data.completed = todo.completed
            if (data.completed) {
                actionDone.innerText = 'ångra'; 
                inputValue.classList.add('active');
            } else {
                inputValue.classList.remove('active');
                actionDone.innerText = 'done'; 
            }
    })
});

// döljer modal om man klickar på stäng.
closeModal.addEventListener('click', (e) => {
    modal.classList.add('modalhide')
})
};
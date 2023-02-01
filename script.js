const BASE_URL = ('https://jsonplaceholder.typicode.com/todos');
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const list = document.querySelector("#tasks");
const output = document.querySelector('#output');
const modal = document.querySelector('#modal')
const closeModal = document.querySelector('#closeModal');
modal.classList.add('modalhide') 
let todos = []

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

form.addEventListener('submit', (e) => {
    e.preventDefault();
        const inputValue = input.value.trim();
            const error = document.querySelector(".error");
                error.textContent = "";
fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
        title: inputValue,
        completed: false,
      }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
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
            if (data.completed) {
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
actionDelete.addEventListener('click', (e) => {  
    if (inputValue.classList.contains('active')) {
        modal.classList.add('modalhide') 
    } else {    
        modal.classList.remove('modalhide')
            return  
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
actionDone.addEventListener("click", (e) => {
    fetch(BASE_URL + '/' + data.id, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
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
closeModal.addEventListener('click', (e) => {
    modal.classList.add('modalhide')
})
};
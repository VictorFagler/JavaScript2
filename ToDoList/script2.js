
const JSON_URL = "https://jsonplaceholder.typicode.com/todos/"
const todoList = document.querySelector('#todo-list')
const form = document.querySelector('#form')
const todoItem = document.getElementsByClassName('.todo')
const addBtn = document.querySelector('#add-btn')
const deleteBtn = document.querySelector('.delete-btn')
const textInputField = document.querySelector('#text-input-field')

// Begränsa till 7, hinner ej fixa så att det endast gör vid första load.
// const JSON_URL = "https://jsonplaceholder.typicode.com/todos?_start=0&_limit=7"

//Container för todos
const todos = []

//Hämta todos från databas
const getTodos = () => {
    fetch(JSON_URL)
        .then(res => res.json())
        .then(data => {
            data.forEach(todo => {
                todos.push(todo)
            });
            listTodos()
        })
}

//Lista varje todo
const listTodos = () => {
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo)
        todoList.appendChild(todoElement)
    })
}
getTodos()

// Skapa todo i DOM
const createTodoElement = (userData) => {
    let todo = document.createElement('div')
    todo.id = userData.id
    todo.classList.add('todo')

    let task = document.createElement('p')
    task.classList.add('task_name')
    task.innerText = userData.title

    const button = document.createElement('BUTTON')
    button.classList.add('delete-btn')
    button.innerText = 'DELETE'

    // Toggla klarmarkering på todo
    function toggleComplete() {
        todo.addEventListener('click', (e) => {
            todo.classList.toggle('complete')
        })
    }
    //Delete funktion
    function deleteTodo() {
        button.addEventListener('click', removeTodo);
    }

    if (userData.completed == true) {
        todo.classList.add('complete')
    }
    todo.appendChild(task)
    todo.appendChild(button)
    toggleComplete()
    deleteTodo()

    return todo
}

//Skapa ny todo
function NewTodo() {
    var new_post_title = document.getElementById("text-input-field").value;
    console.log("Input Data: " + new_post_title);
    if (new_post_title !== '') {
        textInputField.style.background = 'white'
        fetch(JSON_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: new_post_title,
                completed: false,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log('response: ' + JSON.stringify(json));
                todos.push(json);
                listTodos();
                console.log(todos)
            })
    }
    else {
        console.log('Todo cannot be blank')
        textInputField.placeholder = 'Cannot be blank!'
        textInputField.style.background = 'yellow'
    }
}
// Submit för ny todo
form.addEventListener('submit', (e) => {
    e.preventDefault();
    NewTodo();
});

//Ta bort todo - Delete button
const removeTodo = e => {
    fetch(JSON_URL + e.target, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => {
            console.log(res)
            e.target.parentNode.remove()
            const index = todos.findIndex(todo => todo.id == e.target.id)
            todos.splice(index, 1)
            console.log(todos)
        })
}
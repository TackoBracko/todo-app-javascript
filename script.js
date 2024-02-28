const date = document.querySelector('.date')
date.innerText = new Date().toDateString()



const activeTasksList = document.querySelector('.activeTasks')
const completedTasksList = document.querySelector('.completedTasks')
const inputField = document.querySelector('.taskInput')
const submitBtn = document.querySelector('.submitBtn')
const activeCountSpan = document.querySelector('.activeCount')
const doneCountSpan = document.querySelector('.doneCount')

let todoList = []

function addTodoTask() {
    if (inputField.value.trim() !== '') {
        const todoItem = {
            title: inputField.value,
            id: todoList.length + 1,
            status: 'active'
        }
        
        todoList.push(todoItem)
        console.log(todoList)
        inputField.value = ''
        
        saveToLocalStorage()
        renderTodoList() 
    }
}

function renderTodoList() {
    activeTasksList.innerHTML = ''
    completedTasksList.innerHTML = ''

    let activeCount = 0
    let doneCount = 0

    todoList.map(task => {
        const newTask = document.createElement('li')
        newTask.innerText = task.title
        
        const checkBox = document.createElement('input')
        checkBox.type = 'checkbox'
        checkBox.classList.add('checkbox')
        checkBox.checked = task.status === 'done'
        checkBox.addEventListener('change', () => toggleTodoStatus(task.id))

        newTask.appendChild(checkBox)

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        deleteBtn.className = 'deleteBtn'
        deleteBtn.addEventListener('click', () => {
            todoList = todoList.filter(item => item.id !== task.id)
            saveToLocalStorage()
            renderTodoList()
        })

        newTask.appendChild(deleteBtn)

        if (task.status === 'done') {
            completedTasksList.appendChild(newTask)
            doneCount++
        } else {
            activeTasksList.appendChild(newTask)
            activeCount++
        }
    })
    
    activeCountSpan.textContent = activeCount
    doneCountSpan.textContent = doneCount
}

const toggleTodoStatus = (id) => {
    todoList.forEach(task => {
        if (task.id === id) {
            task.status === 'active' ? task.status='done' : task.status='active'
        }
        return task
    })
    saveToLocalStorage()
    renderTodoList()
}

submitBtn.addEventListener('click', addTodoTask)

inputField.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        addTodoTask() 
    }
})

//localStorage

const saveToLocalStorage = () => {
    localStorage.setItem('todoItem', JSON.stringify(todoList))
}

const getFromLocalStorage = () => {
    const storedTodoList = localStorage.getItem('todoItem')
    if (storedTodoList) {
        todoList = JSON.parse(storedTodoList)
    }
}

window.onload = () => {
    getFromLocalStorage()
    renderTodoList()
}

const date = document.querySelector('.date')
date.innerText = new Date().toDateString()

const activeTasksList = document.querySelector('.activeTasks')
const completedTasksList = document.querySelector('.completedTasks')
const inputField = document.querySelector('.taskInput')
const submitBtn = document.querySelector('.submitBtn')
const clearCompletedBtn = document.querySelector('.clearAll')
const activeCountSpan = document.querySelector('.activeCount')
const doneCountSpan = document.querySelector('.doneCount')

/*activeTasksList.addEventListener('click', (e) => {
    if (e.target.id && e.target.tagName === 'BUTTON') {
      const button = document.getElementById(e.target.id)
      const parent = button.parentElement
      parent.remove()
    }
})*/

let todoList = []

const addTodoTask = () => {
    if (inputField.value.trim() !== '') {
        const task = {
            title: inputField.value,
            id: todoList.length + 1,
            status: 'active'
        }
        
        todoList.push(task)
        console.log(todoList)
        inputField.value = ''
        
        const newTask = createLiElement(task)
        activeTasksList.appendChild(newTask)
        saveToLocalStorage()
    }
}

const createLiElement = (task) => {
    const newTask = document.createElement('li')
    newTask.innerText = task.title
    newTask.dataset.id = task.id

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
        todoList = todoList.filter((item) => item.id !== task.id)
        saveToLocalStorage()
    })

    newTask.appendChild(deleteBtn)

    return newTask
}

const renderTodoList = () => {
    activeTasksList.innerHTML = ''
    completedTasksList.innerHTML = ''

    let activeCount = 0
    let doneCount = 0

    todoList.map((task) => {
        const newTask = createLiElement(task)

        if (task.status === 'done') {
            completedTasksList.appendChild(newTask)
            doneCount++;
        } else {
            activeTasksList.appendChild(newTask)
            activeCount++;
        }
    })

    activeCountSpan.textContent = activeCount
    doneCountSpan.textContent = doneCount
}

const toggleTodoStatus = (id) => {
    todoList.forEach((task) => {
        if (task.id === id) {
            task.status === 'active' ? (task.status = 'done') : (task.status = 'active')
        }
    })
    saveToLocalStorage()
    renderTodoList()
}

const removeTask = (e) => {
    if (e.target.className === 'deleteBtn') {
        const parent = e.target.parentElement
        parent.remove()
        saveToLocalStorage()
    }
}

/*const deleteTask = (id) => {
    todoList = todoList.filter(item => item.id !== id)
    saveToLocalStorage()
}*/

submitBtn.addEventListener('click', addTodoTask)
activeTasksList.addEventListener('click', removeTask)
completedTasksList.addEventListener('click', removeTask)

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


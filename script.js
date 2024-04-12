const date = document.querySelector('.date')
date.innerText = new Date().toDateString()

const activeTasksList = document.querySelector('.activeTasks')
const completedTasksList = document.querySelector('.completedTasks')
const inputField = document.querySelector('.taskInput')
const submitBtn = document.querySelector('.submitBtn')
const activeCountSpan = document.querySelector('.activeCount')
const completedCountSpan = document.querySelector('.doneCount')
const clearAllActiveWrapper = document.querySelector('.clear-all-active-wrapper')
const clearAllCompletedWrapper = document.querySelector('.clear-all-completed-wrapper')

//delete task

const removeTask = (element) => {
    element.parentElement.remove()

    const locStorage = getFromLocalStorage()
    const newLocalStorage = locStorage.filter(task => task.id !== Number(element.dataset.id))

    localStorage.setItem('todoItem', JSON.stringify(newLocalStorage))
}

const hasTaskRemovel = (e, list, removeClearAllTasksBtn, countSpan) => {
    if (e.target.dataset.id && e.target.tagName === 'BUTTON') {
        removeTask(e.target)

        const isListEmpty = isTasksListEmpty(list)

        if(isListEmpty) {
            removeClearAllTasksBtn()
        }
        
        const currentCount = countSpan.textContent
        countSpan.textContent = Number(currentCount) - 1
    }
}

//clear tasks
//activetaskslist

const createClearAllTasksBtn = (clearAllTasks, parent, btnText) => {
    const clearAllTaskBtn = document.createElement('button')
    clearAllTaskBtn.innerText = btnText
    clearAllTaskBtn.className = 'clearAll'
    clearAllTaskBtn.addEventListener('click', clearAllTasks)
    parent.appendChild(clearAllTaskBtn)
}

const clearAllActiveTasks = () => {
    activeTasksList.innerHTML = ''
    activeCountSpan.textContent = 0
    clearAllActiveWrapper.innerHTML = ''

    const locStorage = getFromLocalStorage()
    const newLocalStorage = locStorage.filter(task => task.status !== 'active')
    localStorage.setItem('todoItem', JSON.stringify(newLocalStorage))
}

const removeClearAllActiveTasksBtn = () => {
    clearAllActiveWrapper.innerHTML = ''
}

//completedtaskslist

const clearAllCompletedTasks = () => {
    completedTasksList.innerHTML = ''
    completedCountSpan.textContent = 0
    clearAllCompletedWrapper.innerHTML = ''

    const locStorage = getFromLocalStorage()
    const newLocalStorage = locStorage.filter(task => task.status !== 'completed')
    localStorage.setItem('todoItem', JSON.stringify(newLocalStorage))
}

const removeClearAllCompletedTasksBtn = () => {
    clearAllCompletedWrapper.innerHTML = ''
}

//checking is task first and is list empty

const isFirstTask = (list) => {
    if (list.children.length === 1) {
        return true
    } else {
        return false
    }
}

const isTasksListEmpty = (list) => {
    if (list.children.length === 0) {
        return true
    } else {
        return false
    }
}

//toggle status

const toggleTodoStatus = (e) => {
    if (e.target.dataset.id && e.target.tagName === 'INPUT') {
        const li = e.target.parentElement
        const status = e.target.checked ? 'completed' : 'active'
        
        if (status === 'completed') {
            completedTasksList.appendChild(li)

            const completedCount = completedCountSpan.textContent
            completedCountSpan.textContent = Number(completedCount) + 1

            const activeCount = activeCountSpan.textContent
            activeCountSpan.textContent = Number(activeCount) - 1

            const isFirstDoneTask = isFirstTask(completedTasksList)

            if (isFirstDoneTask) {
                createClearAllTasksBtn (
                    clearAllCompletedTasks,
                    clearAllCompletedWrapper,
                    'Clear All Completed'
                )
            }

            const isActiveTasksListEmpty = isTasksListEmpty(activeTasksList)

            if (isActiveTasksListEmpty) {
                removeClearAllActiveTasksBtn()
            }    

            const locStorage = getFromLocalStorage()
            const updatedTasks = locStorage.map(task => {
                if (task.id === Number(e.target.dataset.id)) {
                    const updatedTask = {
                        title: task.title,
                        id: task.id,
                        status:'completed'
                    }
                    return updatedTask
                } else {
                    return task
                }
            })
            localStorage.setItem('todoItem', JSON.stringify(updatedTasks))

        } else if (status === 'active') {
            activeTasksList.appendChild(li)

            const activeCount = activeCountSpan.textContent
            activeCountSpan.textContent = Number(activeCount) + 1  

            const completedCount = completedCountSpan.textContent
            completedCountSpan.textContent = Number(completedCount) - 1

            const isFirstActiveTask = isFirstTask(activeTasksList)

            if (isFirstActiveTask) {
                createClearAllTasksBtn (
                    clearAllActiveTasks,
                    clearAllActiveWrapper,
                    'Clear All Active'
                )
            }

            const isDoneTasksListEmpty = isTasksListEmpty(completedTasksList)

            if (isDoneTasksListEmpty) {
                removeClearAllCompletedTasksBtn()
            }

            const locStorage = getFromLocalStorage()
            const updatedTasks = locStorage.map(task => {
                if (task.id === Number(e.target.dataset.id)) {
                    const updatedTask = {
                        title: task.title,
                        id: task.id,
                        status:'active'
                    }
                    return updatedTask
                } else {
                    return task
                }
            })
            localStorage.setItem('todoItem', JSON.stringify(updatedTasks))
        }
    }  
}

//function

const addTodoTask = () => {
    if (inputField.value.trim() !== '') {
        const task = {
            title: inputField.value,
            id: Math.random(),
            status: 'active'
        }
        
        console.log(task)
        inputField.value = ''
        
        const newTask = createLiElement(task)
        activeTasksList.appendChild(newTask)
        
        let locStorage = getFromLocalStorage()
        if(!locStorage) {
            locStorage = []
        }
        locStorage.push(task)
        localStorage.setItem('todoItem', JSON.stringify(locStorage))
        
        const currentCount = activeCountSpan.textContent
        activeCountSpan.textContent = Number(currentCount) + 1
    }

    const isFirstActiveTask = isFirstTask(activeTasksList)

    if (isFirstActiveTask) {
        createClearAllTasksBtn (
            clearAllActiveTasks,
            clearAllActiveWrapper,
            'Clear All Active'
        )
    }
}

const createLiElement = (task) => {
    const newTask = document.createElement('li')
    newTask.innerText = task.title
    
    const checkBox = document.createElement('input')
    checkBox.type = 'checkbox'
    checkBox.classList.add('checkbox')
    checkBox.checked = task.status === 'completed'
    checkBox.dataset.id = task.id
    
    newTask.appendChild(checkBox)
    
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.className = 'deleteBtn'
    deleteBtn.dataset.id = task.id
    
    newTask.appendChild(deleteBtn)

    return newTask
}

const renderTodoList = () => {
    activeTasksList.innerHTML = ''
    completedTasksList.innerHTML = ''

    let activeCount = 0
    let completedCount = 0

    let locStorage = getFromLocalStorage();
    if (!locStorage) {
        locStorage = [];
    }

    const activeTasksWrapper = document.createDocumentFragment()
    const completedTasksWrapper = document.createDocumentFragment()

    locStorage.forEach((task) => {
        const newTask = createLiElement(task)

        if (task.status === 'completed') {
            completedTasksWrapper.appendChild(newTask)
            completedCount++;
        } else {
            activeTasksWrapper.appendChild(newTask)
            activeCount++;
        }
    })

    activeTasksList.appendChild(activeTasksWrapper)
    completedTasksList.appendChild(completedTasksWrapper)

    activeCountSpan.textContent = activeCount
    completedCountSpan.textContent = completedCount
}

//event listeneres

submitBtn.addEventListener('click', addTodoTask)
activeTasksList.addEventListener('change', toggleTodoStatus)
activeTasksList.addEventListener('click', (e) => {hasTaskRemovel(e, activeTasksList, removeClearAllActiveTasksBtn, activeCountSpan)})
completedTasksList.addEventListener('change', toggleTodoStatus)
completedTasksList.addEventListener('click', (e) => {hasTaskRemovel(e, completedTasksList, removeClearAllCompletedTasksBtn, completedCountSpan)})

inputField.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 && inputField.value.trim() !== '') {
            addTodoTask()
        }
    })
  
//LOCAL STORAGE

const getFromLocalStorage = () => {
    const storedTodoList = localStorage.getItem('todoItem')
    if (storedTodoList) {
        return JSON.parse(storedTodoList)
    }
}

window.onload = () => {
    renderTodoList()

    const hasActiveTasks = activeTasksList.children.length > 0
    if(hasActiveTasks) {
        createClearAllTasksBtn (
            clearAllActiveTasks,
            clearAllActiveWrapper,
            'Clear All Active'
        )
    }

    const hasCompletedTasks = completedTasksList.children.length > 0
    if(hasCompletedTasks) {
        createClearAllTasksBtn (
            clearAllCompletedTasks,
            clearAllCompletedWrapper,
            'Clear All Completed'
        )
    }
}

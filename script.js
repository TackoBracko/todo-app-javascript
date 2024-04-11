const date = document.querySelector('.date')
date.innerText = new Date().toDateString()

const activeTasksList = document.querySelector('.activeTasks')
const completedTasksList = document.querySelector('.completedTasks')
const inputField = document.querySelector('.taskInput')
const submitBtn = document.querySelector('.submitBtn')
const activeCountSpan = document.querySelector('.activeCount')
const doneCountSpan = document.querySelector('.doneCount')
const clearAllActiveWrapper = document.querySelector('.clear-all-active-wrapper')
const clearAllCompletedWrapper = document.querySelector('.clear-all-completed-wrapper')

//delete task

const removeTask = (element) => {
    element.parentElement.remove()

    const locStorage = getFromLocalStorage()
    const newLocalStorage = locStorage.filter(task => task.id !== Number(element.dataset.id))

    localStorage.setItem('todoItem', JSON.stringify(newLocalStorage))
}

const handleTasksList = (e, list, removeClearAllTasksBtn, countSpan) => {
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

activeTasksList.addEventListener('click', (e) =>{handleTasksList(e, activeTasksList, removeClearAllActiveTasksBtn, activeCountSpan)})
completedTasksList.addEventListener('click', (e) => {handleTasksList(e, completedTasksList, removeClearAllDoneTasksBtn, doneCountSpan)})

/*activeTasksList.addEventListener('click', (e) => {
  if (e.target.dataset.id && e.target.tagName === 'BUTTON') {
    removeTask(e.target)
    const isActiveTasksListEmpty = isTaskListEmpty(activeTasksList);

    if (isActiveTasksListEmpty) {
      removeClearAllActiveTasksBtn()
    }

    const currentCount = activeCountSpan.textContent;
    activeCountSpan.textContent = Number(currentCount) - 1;
  }
})*/

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
}

const removeClearAllActiveTasksBtn = () => {
    clearAllActiveWrapper.innerHTML = ''
}

//completedtaskslist

const clearAllDoneTasks = () => {
    completedTasksList.innerHTML = ''
    doneCountSpan.textContent = 0
    clearAllCompletedWrapper.innerHTML = ''
}

const removeClearAllDoneTasksBtn = () => {
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
        const status = e.target.checked ? 'done' : 'active'
        
        if (status === 'done') {
            completedTasksList.appendChild(li)

            const doneCount = doneCountSpan.textContent
            doneCountSpan.textContent = Number(doneCount) + 1

            const activeCount = activeCountSpan.textContent
            activeCountSpan.textContent = Number(activeCount) - 1

            const isFirstDoneTask = isFirstTask(completedTasksList)

            if (isFirstDoneTask) {
                createClearAllTasksBtn (
                    clearAllDoneTasks,
                    clearAllCompletedWrapper,
                    'Clear All Done'
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
                        status:'done'
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

            const doneCount = doneCountSpan.textContent
            doneCountSpan.textContent = Number(doneCount) - 1

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
                removeClearAllDoneTasksBtn()
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

        /*const locStorage = getFromLocalStorage()

        if(!locStorage) {
            locStorage = []
        }

        const newLocalStorage = locStorage.map(task => {
            if (task.id === Number(e.target.dataset.id)) {
                task.status = status
                return task
            }
            return task 
        })
        localStorage.setItem('todoItem', JSON.stringify(newLocalStorage))*/
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
    checkBox.checked = task.status === 'done'
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
    let doneCount = 0

    let locStorage = getFromLocalStorage();
    if (!locStorage) {
        locStorage = [];
    }

    locStorage.map((task) => {
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

//event listeneres

submitBtn.addEventListener('click', addTodoTask)
activeTasksList.addEventListener('change', toggleTodoStatus)
completedTasksList.addEventListener('change', toggleTodoStatus)

inputField.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
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
    getFromLocalStorage()
    renderTodoList()
}

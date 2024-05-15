const date = document.querySelector('.date');
date.innerText = new Date().toDateString();

const activeTasksList = document.querySelector('.activeTasks');
const completedTasksList = document.querySelector('.completedTasks');
const inputField = document.querySelector('.taskInput');
const submitBtn = document.querySelector('.submitBtn');
const activeCountSpan = document.querySelector('.activeCount');
const completedCountSpan = document.querySelector('.doneCount');
const clearAllActiveWrapper = document.querySelector('.clear-all-active-wrapper');
const clearAllCompletedWrapper = document.querySelector('.clear-all-completed-wrapper');
const errorMsg = document.querySelector('.error_message')

//delete task

const removeTask = async (element) => {
  try {
    const response = await fetch(`/api/tasks/${element.dataset.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (response.status !== 200) {
      throw {
        text: 'Task is not deleted, something went wrong'
      }
    }

    const responseData = await response.json()
    element.parentElement.remove();

  } catch(error) {
    let customErr = 'Error removing task'
  
    if(error.text){
      customErr = error.text
    } 

    errorMsg.innerText = customErr
    errorMsg.style.display = 'block'
    console.error('We have error. Error detailss: ', error)
  }

  /*const locStorage = getFromLocalStorage();
  const newLocalStorage = locStorage.filter(
    (task) => task.id !== Number(element.dataset.id)
  );

  localStorage.setItem('todoItem', JSON.stringify(newLocalStorage));*/
};

const hasTaskRemovel = (e, list, removeClearAllTasksBtn, countSpan) => {
  if (e.target.dataset.id && e.target.tagName === 'BUTTON') {
    removeTask(e.target);

    const isListEmpty = isTasksListEmpty(list);

    if (isListEmpty) {
      removeClearAllTasksBtn();
    }

    const currentCount = countSpan.textContent;
    countSpan.textContent = Number(currentCount) - 1;
  }
};

//clear tasks
//activetaskslist

const createClearAllTasksBtn = (clearAllTasks, parent, btnText) => {
  const clearAllTaskBtn = document.createElement('button');
  clearAllTaskBtn.innerText = btnText;
  clearAllTaskBtn.className = 'clearAll';
  clearAllTaskBtn.addEventListener('click', clearAllTasks);
  parent.appendChild(clearAllTaskBtn);
};

const clearAllActiveTasks = () => {
  activeTasksList.innerHTML = '';
  activeCountSpan.textContent = 0;
  clearAllActiveWrapper.innerHTML = '';

  const locStorage = getFromLocalStorage();
  const newLocalStorage = locStorage.filter((task) => task.status !== 'active');
  localStorage.setItem('todoItem', JSON.stringify(newLocalStorage));
};

const removeClearAllActiveTasksBtn = () => {
  clearAllActiveWrapper.innerHTML = '';
};

//completedtaskslist

const clearAllCompletedTasks = () => {
  completedTasksList.innerHTML = '';
  completedCountSpan.textContent = 0;
  clearAllCompletedWrapper.innerHTML = '';

  const locStorage = getFromLocalStorage();
  const newLocalStorage = locStorage.filter(
    (task) => task.status !== 'completed'
  );
  localStorage.setItem('todoItem', JSON.stringify(newLocalStorage));
};

const removeClearAllCompletedTasksBtn = () => {
  clearAllCompletedWrapper.innerHTML = '';
};

//checking is task first and is list empty

const isFirstTask = (list) => {
  if (list.children.length === 1) {
    return true;
  } else {
    return false;
  }
};

const isTasksListEmpty = (list) => {
  if (list.children.length === 0) {
    return true;
  } else {
    return false;
  }
};

//toggle status

const toggleTodoStatus = async (e) => {
  if (e.target.dataset.id && e.target.tagName === 'INPUT') {
    const li = e.target.parentElement;
    const status = e.target.checked ? 'completed' : 'active';

    try {
      const response = await fetch(`/api/tasks/${e.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: e.target.dataset.id,
          title: e.target.dataset.title,
          status: e.target.dataset.status
        })
      })

      if (response.status !== 200) {
        throw {
          text: 'We have some problem to toggle tasks, please try again later'
        } 
      }

      const responseData = await response.json()
      const newToggleTask = {
        title: responseData.data.title,
        status: responseData.data.status
      }
      console.log(responseData)
      console.log(newToggleTask)

      if (status === 'completed') {
        completedTasksList.appendChild(li);
  
        const completedCount = completedCountSpan.textContent;
        completedCountSpan.textContent = Number(completedCount) + 1;
  
        const activeCount = activeCountSpan.textContent;
        activeCountSpan.textContent = Number(activeCount) - 1;
  
        const isFirstDoneTask = isFirstTask(completedTasksList);
  
        if (isFirstDoneTask) {
          createClearAllTasksBtn(
            clearAllCompletedTasks,
            clearAllCompletedWrapper,
            'Clear All Completed'
          );
        }
  
        const isActiveTasksListEmpty = isTasksListEmpty(activeTasksList);
  
        if (isActiveTasksListEmpty) {
          removeClearAllActiveTasksBtn();
        }
  
        /*const locStorage = getFromLocalStorage();
        const updatedTasks = locStorage.map((task) => {
          if (task.id === Number(e.target.dataset.id)) {
            const updatedTask = {
              title: task.title,
              id: task.id,
              status: 'completed',
            };
            return updatedTask;
          } else {
            return task;
          }
        });
  
        localStorage.setItem('todoItem', JSON.stringify(updatedTasks));*/
        
      } else if (status === 'active') {
        activeTasksList.appendChild(li);
  
        const activeCount = activeCountSpan.textContent;
        activeCountSpan.textContent = Number(activeCount) + 1;
  
        const completedCount = completedCountSpan.textContent;
        completedCountSpan.textContent = Number(completedCount) - 1;
  
        const isFirstActiveTask = isFirstTask(activeTasksList);
  
        if (isFirstActiveTask) {
          createClearAllTasksBtn(
            clearAllActiveTasks,
            clearAllActiveWrapper,
            'Clear All Active'
          );
        }
  
        const isDoneTasksListEmpty = isTasksListEmpty(completedTasksList);
  
        if (isDoneTasksListEmpty) {
          removeClearAllCompletedTasksBtn();
        }
  
        /*const locStorage = getFromLocalStorage();
        const updatedTasks = locStorage.map((task) => {
          if (task.id === Number(e.target.dataset.id)) {
            const updatedTask = {
              title: task.title,
              id: task.id,
              status: 'active',
            };
            return updatedTask;
          } else {
            return task;
          }
        });
        localStorage.setItem('todoItem', JSON.stringify(updatedTasks));*/
      }

    } catch(error) {
      let customErr = 'There was an error updating tasks status'
  
      if(error.text){
        customErr = error.text
      } 

      errorMsg.innerText = customErr
      errorMsg.style.display = 'block'
      console.error('We have error. Error detailss: ', error)
    }
  }
};

//function

const addTodoTask = async () => {
  submitBtn.classList.add('loading')
  
  setTimeout(async () => {

    if (inputField.value.trim() !== '') {
      const task = {
        title: inputField.value,
        //id: Math.random(),
        status: 'active',
      };
  
      console.log(task);
      inputField.value = '';

      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: task.title,
            status: task.status
          })
        })
  
        if (response.status !== 200) {
          throw {
            text: 'We have some problem to create new task, please try again later'
          } 
        }
  
        const responseData = await response.json()
        const newResponseTask = {
          title: responseData.data.title,
          status: responseData.data.status,
          id: responseData.data.id
        }
        
        const newTask = createLiElement(newResponseTask);
        //const newTask = createLiElement(responseData.data);
        activeTasksList.appendChild(newTask);
    
        /*let locStorage = getFromLocalStorage();
        if (!locStorage) {
          locStorage = [];
        }
        locStorage.push(task);
        localStorage.setItem('todoItem', JSON.stringify(locStorage));*/
    
        const currentCount = activeCountSpan.textContent;
        activeCountSpan.textContent = Number(currentCount) + 1;
        
        const isFirstActiveTask = isFirstTask(activeTasksList);
        
        if (isFirstActiveTask) {
          createClearAllTasksBtn(
            clearAllActiveTasks,
            clearAllActiveWrapper,
            'Clear All Active'
          );
        }
      }
      catch(error) {
        let customErr = 'There is been error during task creation or during request'
  
        if(error.text){
          customErr = error.text
        } 
  
        errorMsg.innerText = customErr
        errorMsg.style.display = 'block'
        submitBtn.classList.remove('loading')
  
        console.error('We have error. Error detailss: ', error)
      }
    }
    submitBtn.classList.remove('loading')  
  }, 1000)

};

const createLiElement = (task) => {
  const newTask = document.createElement('li');
  newTask.innerText = task.title;

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.classList.add('checkbox');
  checkBox.checked = task.status === 'completed';
  checkBox.dataset.id = task.id;

  newTask.appendChild(checkBox);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'deleteBtn';
  deleteBtn.dataset.id = task.id;

  newTask.appendChild(deleteBtn);

  return newTask;
};

const renderTodoList = (tasks) => {
  activeTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';

  let activeCount = 0;
  let completedCount = 0;

  /*let locStorage = getFromLocalStorage();
  if (!locStorage) {
    locStorage = [];
  }*/

  const activeTasksWrapper = document.createDocumentFragment();
  const completedTasksWrapper = document.createDocumentFragment();

  //throw new Error
  
  tasks.forEach((task) => {
    const newTask = createLiElement(task);
    
    if (task.status === 'completed') {
      completedTasksWrapper.appendChild(newTask);
      completedCount++;
    } else {
      activeTasksWrapper.appendChild(newTask);
      activeCount++;
    }
  });
  
  activeTasksList.appendChild(activeTasksWrapper);
  completedTasksList.appendChild(completedTasksWrapper);

  activeCountSpan.textContent = activeCount;
  completedCountSpan.textContent = completedCount;
};

//event listeneres

submitBtn.addEventListener('click', addTodoTask);
activeTasksList.addEventListener('change', toggleTodoStatus);
activeTasksList.addEventListener('click', (e) => {
  hasTaskRemovel(
    e,
    activeTasksList,
    removeClearAllActiveTasksBtn,
    activeCountSpan
  );
});
completedTasksList.addEventListener('change', toggleTodoStatus);
completedTasksList.addEventListener('click', (e) => {
  hasTaskRemovel(
    e,
    completedTasksList,
    removeClearAllCompletedTasksBtn,
    completedCountSpan
  );
});

inputField.addEventListener('keypress', (e) => {
  if (e.keyCode === 13 && inputField.value.trim() !== '') {
    addTodoTask();
  }
});

//LOCAL STORAGE

const getFromLocalStorage = () => {
  const storedTodoList = localStorage.getItem('todoItem');
  if (storedTodoList) {
    return JSON.parse(storedTodoList);
  }
};

window.onload = async () => {
  //loaders
  const loaders= document.querySelectorAll('.loader')
  loaders.forEach((loader) => {
    loader.style.display = 'flex'
  })
    
  try {
    const response = await fetch ('/api/tasks')
    
    if(response.status !== 200) {
      throw { 
        text: `Hey, we have some problem fetching tasks. Error ${response.status}`
      }
    } 
    
    const responseData = await response.json()
    const tasks = responseData.data
    renderTodoList(tasks) 
    console.log(tasks)
  
  } catch(error) {
    let customErr = 'An unexpected error happened'

    if(error.text){
      customErr = error.text
    } 

    errorMsg.innerText = customErr
    errorMsg.style.display = 'block'

    console.error('We have error. Error details: ', error)
  }

  loaders.forEach((loader) => {
    loader.style.display = 'none'
  })
  
  const hasActiveTasks = activeTasksList.children.length > 0;
  if (hasActiveTasks) {
    createClearAllTasksBtn(
      clearAllActiveTasks,
      clearAllActiveWrapper,
      'Clear All Active'
    );
  }
  
  const hasCompletedTasks = completedTasksList.children.length > 0;
  if (hasCompletedTasks) {
    createClearAllTasksBtn(
      clearAllCompletedTasks,
      clearAllCompletedWrapper,
      'Clear All Completed'
    );
  }  
}



/* 
Method: GET
Api: /api/tasks
if res.status === 200 {
  returns {
    data: Array<{
    id: string;
    title: string;
    status: string;
    created: Date;
  }>
  }
} else {
  returns {
    error: string;
  }
}
*/

/* 
Method: POST
Api: /api/tasks
Expects: {
  title: string;
  status: string;
}
if res.status === 200 {
  returns {
    data: {
    id: string;
    title: string;
    status: string;
    created: Date;
  }
  }
} else {
  returns {
    error: string;
  }
}
*/

/* 
Method: PATCH
Api: /api/tasks
Expects: {
  id: string;
  title: string;
  status: string;
}
if res.status === 200 {
  returns {
    data: {
    title: string;
    status: string;
  }
  }
} else {
  returns {
    error: string;
  }
}
*/

/* 
Method: DELETE
Api: /api/tasks/:id
if res.status === 200 {
  returns {
    data: string;
  }
} else {
  returns {
    error: string;
  }
}
*/

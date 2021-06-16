document.querySelector('.clear-tasks').addEventListener('click',
clearAll);

let deleteIcons = document.querySelectorAll('.delete-item');

const form = document.querySelector('#task-form');
const inputTask = document.getElementById('task');
const tasks = document.querySelector('.collection');
const svgIcon = document.querySelector('#hidden-example svg');




form.addEventListener('submit', insertNewTask)
initilize();

function initilize() {
    deleteIcons = document.querySelectorAll('.delete-item');
    for (let i = 0; i < deleteIcons.length; i++) {
        const icon = deleteIcons[i];
        icon.addEventListener('click', clear);
    }
}

function insertNewTask(e) {
    e.preventDefault();
    const item = document.createElement("li");
    item.setAttribute('class', "collection-item");
    const text = document.createTextNode(inputTask.value);
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "delete-item secondary-content")
    const icon = svgIcon.cloneNode(true);
    link.appendChild(icon);
    item.appendChild(text);
    item.appendChild(link);
    tasks.appendChild(item);
    initilize();
}

function clear(e) {
    let item = e.target;
    if (e.target.tagName === 'path') {
        e.target.parentElement.parentElement.parentElement.remove();
    } else if (e.target.tagName === 'svg') {
        e.target.parentElement.parentElement.remove();
    } else if (e.target.tagName === 'a') {
        e.target.parentElement.remove();
    }
    initilize();
}


function clearAll(e) {
    const tasks = document.querySelector('.collection').children;
    const length = tasks.length
    for (let i = 0; i < length; i++) {
        tasks[0].remove();
    }
    initilize();
}

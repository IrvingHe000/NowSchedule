var events = new Map();
var num = 0;

const titles = document.getElementsByClassName("tasks-title");
const numInEachGroup = [0, 0, 0];

document.getElementById("clear-tasks").addEventListener('click', clearAll);

const colors = ["rgb(238, 229, 248)", "rgb(181, 196, 177)", "rgb(224,229,223)",
    "rgb(122, 114, 129)", "rgb(150, 84, 84)", "rgb(134, 150, 167)",
    "rgb(234, 208, 209)", "rgb(191, 191, 191)", "rgb(107, 81, 82)"];

const today = new Date();
let deleteIcons = document.querySelectorAll('.delete-item');

const formPeriod = document.querySelector('#task-form-period');
const formDdl = document.querySelector('#task-form-ddl');

const tasks = document.querySelector('.collection');
const svgIcon = document.querySelector('#hidden-example svg');

const selectTaskType = document.getElementById("select-your-type");
const periodType = document.getElementById("period-type");
const deadlineType = document.getElementById("deadline-type");
const chooseTypeForm = document.getElementById("select-type-form");

chooseTypeForm.addEventListener('submit', chooseType);

function chooseType(e) {
    e.preventDefault();
    periodType.style.display = 'none';
    deadlineType.style.display = 'none';
    const types = document.getElementsByName('task-type');

    if (types[0].checked) {
        periodType.style.display = 'block';
    } else if (types[1].checked) {
        deadlineType.style.display = 'block';
    } else {

    }
}



formPeriod.addEventListener('submit', insertNewTaskPeriod);
formDdl.addEventListener('submit', insertNewTaskDdl);
initilize();
setDate();

function initilize() {
    deleteIcons = document.querySelectorAll('.delete-item');
    for (let i = 0; i < deleteIcons.length; i++) {
        const icon = deleteIcons[i];
        icon.addEventListener('click', clear);
    }
}



function randomColor(){
    let r = Math.floor(Math.random()*256);
	let g = Math.floor(Math.random()*256);
	let b = Math.floor(Math.random()*256);
	let rgb = 'rgb('+r+','+g+','+b+')';
	return rgb;
}


function isSameWeek(timeStampA, timeStampB) {
    let A = new Date(timeStampA).setHours(0, 0, 0, 0);
    let B = new Date(timeStampB).setHours(0, 0, 0, 0);
    var oneDayTime = 1000 * 60 * 60 * 24;
    var old_count = parseInt(A / oneDayTime);
    var now_other = parseInt(B / oneDayTime);
    return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
}



function periodAddToTimetable(date, start, end, inputTask) {
    var starthour = start.substr(0, 2);
    var startmin = start.substr(3, 2);
    var endhour = end.substr(0, 2);
    var endmin = end.substr(3, 2);
    var color = colors[Math.floor(Math.random()*9)]
    if (starthour < 6 && endhour > 6) {
        starthour = 6;
        startmin = 0;
    } else if (starthour > 6 && endhour < 6) {
        endhour = 23;
        endmin = 59;
    }

    const example = document.querySelector('#example-block');
    let weekday = date.getDay();
    if (weekday === 0) {
        weekday = 7;
    }
    const dayTimetable = document.querySelector('#timetable-mainBody');

    let minHeight = ((60 - startmin) / 60.0 + endmin / 60.0) * 65;
    let hourHeight = (endhour - starthour - 1) * 65;
    let h = minHeight + hourHeight;
    let height = h + "px";
    let timetableRow = dayTimetable.children[starthour - 6];
    let timetableGrid = timetableRow.children[weekday];
    let newGrid = example.cloneNode(true);

    newGrid.style.display = "block";
    newGrid.childNodes[1].textContent = inputTask;
    newGrid.style.height = height;
    newGrid.style.position = 'absolute';
    newGrid.style.top = startmin * 65.0 / 60.0 + 'px';
    newGrid.childNodes[1].style.borderStyle = "solid none solid none";
    newGrid.childNodes[1].style.borderRadius = "5px"
    newGrid.childNodes[1].style.borderColor = "black";
    newGrid.childNodes[1].style.backgroundColor = color;
    timetableGrid.style.position = 'relative';
    timetableGrid.appendChild(newGrid);
    return newGrid;
}

function insertNewTaskPeriod(e) {
    e.preventDefault();
    const inputStartTime = document.getElementById('start-period').value;
    const inputEndTime = document.getElementById('end-period').value;
    const inputTask = document.getElementById('task-period').value;
    const inputDate = document.getElementById('date-period').value;
    const date = new Date(inputDate);
    let grid = null;
    const classify = compareDate(date, today);
    if (isSameWeek(date, today)) {
        grid = periodAddToTimetable(date, inputStartTime, inputEndTime, inputTask);
    }

    if (inputTask.value === "") {
        periodType.style.display = 'none';
        return;
    }
    const item = document.createElement("li");
    item.setAttribute('class', "collection-item");
    const text = document.createTextNode(inputTask);
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "delete-item secondary-content")
    const icon = svgIcon.cloneNode(true);
    link.appendChild(icon);
    item.appendChild(text);
    item.appendChild(link);
    item.setAttribute('id', num);
    num++;

    if (classify === -1) {
        tasks.insertBefore(item, titles[1]);
    } else if (classify === 0) {
        tasks.insertBefore(item, titles[2]);
    } else {
        tasks.appendChild(item);
    }

    selectTaskType.style.display = 'block';
    periodType.style.display = 'none';
    if (grid !== null) {
        events.set(item, grid);
    }
    initilize();
}

function insertNewTaskDdl(e) {
    e.preventDefault();
    const inputTask = document.getElementById('task-ddl').value;
    const inputDate = document.getElementById('date-ddl').value;
    const ddl = document.getElementById('ddl').value;
    const date = new Date(inputDate);
    var grid = null;
    const classify = compareDate(date, today);

    console.log(date)
    console.log(today)
    console.log(ddl)
    console.log(inputTask)

    if (isSameWeek(date, today)) {
         grid = ddlAddToTimetable(date, ddl, inputTask);
    }
    if (inputTask === "") {
        deadlineType.style.display = 'none';
        return;
    }
    const item = document.createElement("li");
    item.setAttribute('class', "collection-item");
    const text = document.createTextNode(inputTask);
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "delete-item secondary-content")
    const icon = svgIcon.cloneNode(true);
    link.appendChild(icon);
    item.appendChild(text);
    item.appendChild(link);
    item.setAttribute('id', num);
    item.style.color = "red";
    num++;
    if (classify === -1) {
        tasks.insertBefore(item, titles[1]);
    } else if (classify === 0) {
        tasks.insertBefore(item, titles[2]);
    } else {
        tasks.appendChild(item);
    }

    deadlineType.style.display = 'none';
    if (grid !== null) {
        events.set(item, grid);
    }
    initilize();
}

function ddlAddToTimetable(date, ddl, inputTask) {
    var grid = periodAddToTimetable(date, ddl, ddl, inputTask);
    grid.childNodes[1].style.borderColor = "red";
    return grid;
}

function clear(e) {
    let item;
    if (e.target.tagName === 'path') {
        item = e.target.parentElement.parentElement.parentElement;
    } else if (e.target.tagName === 'svg') {
        item = e.target.parentElement.parentElement;
    } else if (e.target.tagName === 'a') {
        item = e.target.parentElement;
    }
    console.log(item);
    const grid = events.get(item);
    if (grid !== undefined) {
        grid.remove();
    }
    item.remove();
    events.delete(item);
    initilize();
}


function clearAll(e) {
    const tasks = document.querySelector('.collection').children;
    const length = tasks.length
    for (let i = 0, j = 0; i < length; i++) {
        console.log(tasks[j].getAttribute('class'))
        if (tasks[j].getAttribute('class') !== "collection-item tasks-title") {
            if (events.get(tasks[j])) {
                events.get(tasks[j]).remove();
            }
            tasks[j].remove();
        } else {
            j++;
        }

    }
    num = 0;
    events = new Map();
    initilize();
    console.log(titles)
}

// Adding Today's date on navbar
function setDate() {
    const date = new Date();
    const navbarDate = document.querySelector('#navbar-date');
    navbarDate.textContent = date.toDateString();
}


function compareDate(date, today) {
    if (date.getFullYear() > today.getFullYear()) {
        return 1;
    } else if (date.getFullYear() < today.getFullYear()) {
        return -1;
    } else {
        if (date.getMonth() > today.getMonth()) {
            return 1;
        } else if (date.getMonth() < today.getMonth()) {
            return -1;
        } else {
            if (date.getDate() > today.getDate()) {
                return 1;
            } else if (date.getDate() < today.getDate()) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

setDate();


for (let i = 0; i < 3; i++) {
    titles[i].firstElementChild.addEventListener('click', hideTasks);
}


function hideTasks(e) {
    e.preventDefault();
    let title = e.target;
    while(title.tagName !== "LI") {
        title = title.parentElement;
    }
    let cur = title;
    while(cur.nextElementSibling !== null && cur.nextElementSibling.getAttribute('class')
    !== "collection-item tasks-title") {
        console.log(cur);
        cur = cur.nextElementSibling;
        if (cur.style.display === 'none') {
            cur.style.display = 'block';
        } else {
            cur.style.display = 'none';
        }
    }
}

//Showing current time on timetable
function addCurrentTime(date, ddl, inputTask) {
    var grid = periodAddToTimetable(date, ddl, ddl, inputTask);
    grid.childNodes[1].style.borderStyle = "dashed none none none";
    grid.childNodes[1].style.borderColor = "blue";
    return grid;
}

addCurrentTime(today, today.getHours() + ":" + today.getMinutes(), "Current Time");
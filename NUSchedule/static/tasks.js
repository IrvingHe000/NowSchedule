document.querySelector('.clear-tasks').addEventListener('click',
clearAll);

const colors = ['darkorange', 'aqua', 'crimson', 'cadetblue', 'deepskyblue', 'dodgerblue'];

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

function insertNewTaskPeriod(e) {
    e.preventDefault();
    const inputStartTime = document.getElementById('start-period').value;
    const inputEndTime = document.getElementById('end-period').value;
    const inputTask = document.getElementById('task-period').value;
    const inputDate = document.getElementById('date-period').value;
    const date = new Date(inputDate);

    if (isSameWeek(date, today)) {
        periodAddToTimetable(date, inputStartTime, inputEndTime, inputTask);
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
    tasks.appendChild(item);
    selectTaskType.style.display = 'block';
    periodType.style.display = 'none';
    initilize();
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

function ddlAddToTimetable(date, ddl, inputTask) {
    return periodAddToTimetable(date, ddl, ddl, inputTask);
}

function periodAddToTimetable(date, start, end, inputTask) {
    console.log(start);
    console.log(end);
    var starthour = start.substr(0, 2);
    var startmin = start.substr(3, 2);
    var endhour = end.substr(0, 2);
    var endmin = end.substr(3, 2);
    const color = colors[Math.floor(Math.random()*6)]
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
    const middle = Math.floor((endhour - starthour) / 2);

    for (let hour = starthour - 6, j = 0; hour <= endhour - 6; hour++, j++) {
        var height = '101%';
        if (starthour === endhour) {
            height = 100 * (endmin - startmin) / 60.0 + 1 + '%';

        } else if (j === 0) {
            height = 100 * (60 - startmin) / 60.0 + 1+ '%';
        } else if (hour === endhour - 6) {
            height = 100 * endmin / 60.0 + 1 + '%';
        }
        var timetableRow = dayTimetable.children[hour];
        console.log(weekday);
        var timetableGrid = timetableRow.children[weekday];
        var newGrid = example.cloneNode(true);

        newGrid.style.display = "block";
        if (j == middle) {
            newGrid.childNodes[1].textContent = inputTask;
        }

        newGrid.style.height = height;
        newGrid.style.position = 'absolute';
        console.log(newGrid);
        console.log(timetableGrid);
        if (starthour === endhour) {
            newGrid.style.top =  startmin * 65.0 / 60.0 + 'px';
        } else if (j === 0) {
            newGrid.style.top = startmin * 65.0 / 60.0 + 'px';
            newGrid.childNodes[1].style.borderStyle = "solid solid none solid";
        } else if (hour === endhour - 6) {
            newGrid.childNodes[1].style.borderStyle = "none solid solid solid";
        } else {
            newGrid.childNodes[1].style.borderStyle = "none solid none solid";
        }
        newGrid.childNodes[1].style.borderColor = color;
        newGrid.childNodes[1].style.backgroundColor = color;
        timetableGrid.style.position = 'relative';
        timetableGrid.appendChild(newGrid);
    }
}

function insertNewTaskDdl(e) {
    e.preventDefault();
    const inputTask = document.getElementById('task-ddl').value;
    const inputDate = document.getElementById('date-ddl').value;
    const ddl = document.getElementById('ddl').value;
    const date = new Date(inputDate);

    if (isSameWeek(date, today)) {
        ddlAddToTimetable(date, ddl, inputTask);
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
    tasks.appendChild(item);
    deadlineType.style.display = 'none';
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

// Adding Today's date
function setDate() {
    const date = new Date();
    const navbarDate = document.querySelector('#navbar-date');
    navbarDate.textContent = date.toDateString();
}
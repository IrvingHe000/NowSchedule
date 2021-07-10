const createNewTeamA = document.getElementById('create-new-team');

const submitNewTeamButton = document.getElementById('create-button');
submitNewTeamButton.addEventListener("click", submitNewTeam)
createNewTeamA.addEventListener('click', createNewTeam);
setDate();

const currentTeam = document.getElementById("current-team");

var array = [];
var nums = 0;

function submitNewTeam(e) {
    document.getElementById("do-not-have-team").style.display = 'block';
    document.getElementById("create-your-team").style.display = 'none';
}

function createNewTeam(e) {
    document.getElementById("do-not-have-team").style.display = 'none';
    document.getElementById("create-your-team").style.display = 'block';
}

const inviteButton = document.getElementById('invite-form');
inviteButton.addEventListener('submit', addUser);


function addUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    array[nums] = username;
    nums++;
    const temp = document.createElement('h6');
    temp.style.marginLeft = '5px';
    temp.style.marginTop = '5px';
    temp.textContent = username;
    currentTeam.appendChild(temp);
    console.log(array);
}

function setDate() {
    const date = new Date();
    const navbarDate = document.querySelector('#navbar-date');
    navbarDate.textContent = date.toDateString();
}
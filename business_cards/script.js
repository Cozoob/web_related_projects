// json do przechowywania dancyh o pracownikach
let url = "./employees.json";

// opis pracownika
let photo = document.querySelector("img");
let employeeName = document.querySelector(".name");
let position = document.querySelector(".position");
let description = document.querySelector(".description");

// strzalki oraz losowy wybor
let leftArrow = document.querySelector(".fa-arrow-left");
let rightArrow = document.querySelector(".fa-arrow-right");
let button = document.querySelector(".randomchoice");

leftArrow.addEventListener('click', chooseLeft);
rightArrow.addEventListener('click', chooseRight);
button.addEventListener('click', chooseRandom);

// zmienne pomocne do wyboru pracownikow
let idx = 0;
let last = 0;

function chooseLeft(){
    fetch(url)
    .then(response => {
        if (response.status !== 200) {
            console.log("są błędy");
            }
        console.log('ok')
        return response.json();})
    .then(data => {
        let employees = data['employees'];
        let len = employees.length;
        last = idx;
        idx = Math.abs((idx - 1) % len);
        changeElements(employees[idx].name, employees[idx].position, employees[idx].photo, employees[idx].description);
    })
    .catch((err) => {
        console.log("błąd podczas pobierania danych", err);
        });
    
}

function chooseRight(){
    fetch(url)
    .then(response => {
        if (response.status !== 200) {
            console.log("są błędy");
            }
        console.log('ok')
        return response.json();})
    .then(data => {
        let employees = data['employees'];
        let len = employees.length;
        last = idx;
        idx = Math.abs((idx + 1) % len);
        console.log(employees[idx].name);
        changeElements(employees[idx].name, employees[idx].position, employees[idx].photo, employees[idx].description);
    })
    .catch((err) => {
        console.log("błąd podczas pobierania danych", err);
        });
}

function chooseRandom(){
    fetch(url)
    .then(response => {
        if (response.status !== 200) {
            console.log("są błędy");
            }
        console.log('ok')
        return response.json();})
    .then(data => {
        let employees = data['employees'];
        let len = employees.length;
        let tmp = idx;
        idx = getRandomInt(0, len - 1);
        while(idx == last){
            idx = getRandomInt(0, len);
        }
        last = tmp;
        changeElements(employees[idx].name, employees[idx].position, employees[idx].photo, employees[idx].description);
    })
    .catch((err) => {
        console.log("błąd podczas pobierania danych", err);
        });
}

function changeElements(changeName, changePosition, changePhoto, changeDescription){
    photo.src = changePhoto;
    employeeName.innerText = changeName;
    position.innerText = changePosition;
    description.innerText = changeDescription;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
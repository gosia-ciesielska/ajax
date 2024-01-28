let lastData = "";
let newsHistory = [];
let nextSlotToUpdate = 1;
let rotatorNeedsUpdate = false;

async function startUpdateLoop() {
    await updateData();
    updateNews();
    setInterval(updateData, 10 * 1000);
    setInterval(updateNews, 5 * 1000);
}

async function updateData() {
    let response = await fetch("http://szuflandia.pjwstk.edu.pl/~ppisarski/zad8/dane.php");
    let data = await response.text();
    if (data === lastData) {
        return;
    }
    lastData = data;
    let parsed = JSON.parse(data);
    if (newsHistory[newsHistory.length - 1] != parsed.news) {
        if (newsHistory.length >= 3) {
            newsHistory.shift();
        }
        newsHistory.push(parsed.news);
    }
    updateTable(parsed.stock);
}

function updateNews() {
    let rotator = document.querySelector("#news-rotator");
    let rotatorSlots = Array.from(rotator.querySelectorAll("span"));
    let initialSlotCount = rotatorSlots.length;
    while (rotatorSlots.length < newsHistory.length) {
        let newSlot = document.createElement("span");
        rotatorSlots.push(newSlot);
        rotator.appendChild(newSlot);
    }
    if (initialSlotCount == 1) {
        return;
    }
    let slotToActivate = 0;
    for (let i = 0; i < rotatorSlots.length; i++) {
        if (rotatorSlots[i].classList.contains("active")) {
            slotToActivate = (i < rotatorSlots.length - 1) ? i + 1 : 0;
            rotatorSlots[i].classList.remove("active");
        } else {
            rotatorSlots[i].innerHTML = newsHistory[i];
        }
    }
    rotatorSlots[slotToActivate].classList.add("active");
}

function updateTable(stock) {
    let table = document.querySelector("#table-container").querySelector("table");
    let tableRows = Array.from(table.querySelectorAll("tr"));
    while (tableRows.length < 2) {
        let newRow = document.createElement("tr");
        tableRows.push(newRow);
        table.appendChild(newRow);
    }
    let stockEntries = Object.entries(stock);
    let headerCells = Array.from(tableRows[0].querySelectorAll("td"));
    let valueCells = Array.from(tableRows[1].querySelectorAll("td"));

    while (headerCells.length < stockEntries.length) {
        let newCell = document.createElement("td");
        headerCells.push(newCell);
        tableRows[0].appendChild(newCell);
    }

    while (valueCells.length < stockEntries.length) {
        let newCell = document.createElement("td");
        valueCells.push(newCell);
        tableRows[1].appendChild(newCell);
    }

    for (let i = 0; i < stockEntries.length; i++) {
        let [company, value] = stockEntries[i];
        if (headerCells[i].innerHTML != company) {
            headerCells[i].innerHTML = company;
        }
        if (valueCells[i].innerHTML != value) {
            valueCells[i].innerHTML = value;
        }
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    startUpdateLoop();
});
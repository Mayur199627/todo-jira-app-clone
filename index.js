const addbtn = document.querySelector(".add-btn");
const crossbtn = document.querySelector(".cross-btn");
const modal = document.querySelector(".modal-cont");
const mainContainer = document.querySelector(".main-cont");
const taskInput = document.querySelector(".textarea-cont");
const task = document.querySelector(".task-area")
const taskId = document.querySelector(".ticket-id");
const allPriorityColors = document.querySelectorAll(".priority-color")
const lock = document.querySelector('.ticket-lock')
const toolBoxColors = document.querySelectorAll(".color")

let colors = ["lightpink", "lightblue", "lightgreen", "black"]
let modalPriorityColor = colors[colors.length - 1]
let addFlag = false;
let removeFlag = false

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open"

let ticketArr = [];

if(localStorage.getItem("jira_item")){
    ticketArr = JSON.parse(localStorage.getItem("jira_item"))
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)
    })
}

for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener('click', () => {
        let currToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currToolBoxColor === ticketObj.ticketColor;
        })

        // remove previous ticket
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        //display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId)
        })

    })
    toolBoxColors[i].addEventListener("dblclick", () => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        ticketArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId)
        })
    })
}

//Listener for Show and Hide Modal
addbtn.addEventListener('click', () => {
    addFlag = !addFlag;
    if (addFlag) {
        modal.style.display = "flex"
    } else {
        modal.style.display = "none"
    }
})

//Listener for craete new task
modal.addEventListener("keydown", (e) => {
    if (e.key === "Alt") {
        createTicket(modalPriorityColor, taskInput.value)
        modalDefault()
        addFlag = false;
    }

})


crossbtn.addEventListener('click', (e) => {
    removeFlag = !removeFlag
})

function createTicket(ticketColor, ticketTask, ticketId) {
    let id = ticketId || Date.now()
    let ticketEle = document.createElement("div")
    ticketEle.setAttribute("class", "ticket-cont")
    ticketEle.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`

    mainContainer.appendChild(ticketEle)

    if (!ticketId) {
        ticketArr.push({ ticketColor, ticketTask, ticketId: id });
        localStorage.setItem("jira_item", JSON.stringify(ticketArr))
    }
    console.log(ticketArr)
    handleRemoval(ticketEle, id)
    handleLock(ticketEle, id)
    handleColor(ticketEle, id)
}

function handleRemoval(ticket, id) {
    ticket.addEventListener("click", () => {
        if (!removeFlag) return;
        let idx = getTicketidx(id);
        ticketArr.splice(idx, 1)
        let strticketArr = JSON.stringify(ticketArr)
        localStorage.setItem("jira_item", strticketArr)
        ticket.remove();
    })
}

function handleLock(ticket, id) {
    let ticketIdx = getTicketidx(id)
    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    let ticketTaskArea = document.querySelector(".task-area")
    ticketLock.addEventListener('click', (e) => {
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable", true)
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable", false)
        }
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_item", JSON.stringify(ticketArr))
    })
}
// Listener for modal priority coloring

allPriorityColors.forEach((colorEle, idx) => {
    colorEle.addEventListener('click', (e) => {
        allPriorityColors.forEach((priorityColorEle, idx) => {
            priorityColorEle.classList.remove("border");
        })
        colorEle.classList.add("border")
        modalPriorityColor = colorEle.classList[0]
    })
})

function handleColor(ticket, id) {

    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {

        let ticketidx = getTicketidx(id)
        let currTicketColor = ticketColor.classList[1];

        let currTicketColorIndex = colors.findIndex((color) => {
            return currTicketColor === color;
        })
        console.log(currTicketColorIndex)
        currTicketColorIndex++
        let newTicketColorIndex = currTicketColorIndex % colors.length;
        let newTicketColor = colors[newTicketColorIndex];
        ticketColor.classList.remove(currTicketColor);
        ticketColor.classList.add(newTicketColor);

        ticketArr[ticketidx].ticketColor = newTicketColor;
        localStorage.setItem("jira_item", JSON.stringify(ticketArr))

    })
}

function getTicketidx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketId === id;
    })
    return ticketIdx
}
// set modalTo Default

function modalDefault() {
    modal.style.display = "none"
    taskInput.value = ""
    modalPriorityColor = colors[colors.length - 1]
    allPriorityColors.forEach((priorityColorEle, idx) => {
        priorityColorEle.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add("border")

}
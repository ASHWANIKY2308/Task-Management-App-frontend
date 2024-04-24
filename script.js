const mode = document.querySelector("#mode");
const resultDiv = document.getElementById("result");
const checkbox = document.querySelector("#flexSwitchCheckDefault");
const reminder = document.getElementById("floatingInput-4");

const saveButton =document.getElementById('save');
let isChecked=false;
saveButton.addEventListener("click", function () {
    const taskName = document.getElementById("floatingInput-1").value;
    const endDate = document.getElementById("floatingInput-2").value;
    const comments = document.getElementById("floatingTextarea").value;
    if (taskName === "" || endDate === "" || comments === ""){
        alert("Please fill all fields!");
        }else{
            let dateEnded = new Date(endDate);
            let currentTime = new Date();
            dateEnded.setHours(0, 0, 0, 0);
            currentTime.setHours(0, 0, 0, 0);
            // Checking if the time has passed or not
            if (dateEnded < currentTime) {
                alert("The deadline you have set has already passed!")
                } else {
                    saveTask();
                }
    }
});
function toggleMode() {
    const cards = document.querySelectorAll(".card");
    const resultDiv = document.getElementById("result");
    const newCards = resultDiv.querySelectorAll(".card");

    cards.forEach((card) => {
        if (mode.textContent === "Enable Dark Mode") {
            card.removeAttribute("data-bs-theme", "dark");
        } else {
            card.setAttribute("data-bs-theme", "dark");
        }
    });
    newCards.forEach((newCard) => {
        if (mode.textContent === "Enable Dark Mode") {
            newCard.removeAttribute("data-bs-theme", "dark");
        } else {
            newCard.setAttribute("data-bs-theme", "dark");
        }
    });
}

checkbox.addEventListener("change", () => {
    if (mode.textContent === "Enable Dark Mode") {
        mode.textContent = "Disable Dark Mode";
    } else {
        mode.textContent = "Enable Dark Mode";
    }
    toggleMode();
});

document.getElementById("result").style.display = "none";
const customTimeInput = document.getElementById("customTimeInput");
reminder.addEventListener("change", function () {
    if (reminder.value === "4") {
        customTimeInput.style.display = "block";
        
        $("#reminderWithTime").timepicker({
            timeFormat: "h:mm p",
            interval: 30,
            minTime: "00:00am",
            maxTime: "11:30pm",
            defaultTime: "09:00am",
            scrollbar: true,
        });
    } else {
        customTimeInput.style.display = "none";
    }
});
document.getElementById("result").style.display = "none";

var taskNumber = 0;
function saveTask() {
    taskNumber++;
    const formCard = document.getElementById("card");
    formCard.style.opacity = "0";
    formCard.style.transform = "translateX(-500%)";
    const resultDiv = document.getElementById("result");
    const priority = document.getElementById("floatingInput-3");
    const reminder = document.getElementById("floatingInput-4");
    const endDate = document.getElementById("floatingInput-2").value;
    const taskName = document.getElementById("floatingInput-1").value;
    const comments = document.getElementById("floatingTextarea").value;
    const priorityOption = priority.options[priority.selectedIndex].textContent;
    const reminderOption = reminder.options[reminder.selectedIndex].textContent;

    const savedData = `
    <strong>Task Name:</strong> ${taskName}<br>
    <strong>End Date:</strong> ${endDate}<br>
    <strong>Priority:</strong> ${priorityOption}<br>
    <strong>Reminder:</strong> ${reminderOption}<br>
    <strong>Comments:</strong> ${comments}
    `;
    const taskDiv = document.createElement("div");
    taskDiv.className = `card col-md-6 mb-2 ${taskDiv.style.opacity === "1" ? "rev-animated" : "animated"
        }`;
    taskDiv.style.width = "inherit";

    taskDiv.innerHTML = `
    <div class="card-header fw-bolder fs-3 text-muted item-separated">
    <span id="title">Task ${taskNumber}.${taskName === "" ? "Empty Task" : " - " + taskName
        }</span>
    <div class="btn-group" role="group">
    <button class="btn btn-success mark-done mx-1" title="Mark as Done">✓</button>
    <button class="btn btn-danger  delete" title="Delete">✗</button>
    </div>
    </div>
    <div class="card-body" id="savedData">${savedData}</div>
    `;

    const taskData = {
        taskName,
        endDate,
        priorityOption,
        reminderOption,
        comments,
    };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    setTimeout(() => {
        resultDiv.appendChild(taskDiv);
        resultDiv.style.display = "block";
        formCard.style.opacity = "1";
        formCard.style.transform = "translateX(0)";
        indexing();
        toggleMode();
    }, 300);
    document.getElementById("floatingInput-1").value = "";
    document.getElementById("floatingInput-2").value = "";
    document.getElementById('floatingInput-3').value = '';
    document.getElementById('floatingInput-4').value = '';
    document.getElementById("floatingTextarea").value = "";

    const title = taskDiv.querySelector("#title");
    const deleteButton = taskDiv.querySelector(".delete");
    const markDoneButton = taskDiv.querySelector(".mark-done");
    const originalOpacity = taskDiv.style.opacity;

    
    addTaskEventListeners(taskDiv, title, markDoneButton, deleteButton,originalOpacity);
}
let isMarked = false;
let mark = null;

function addTaskEventListeners(taskDiv, title, markDoneButton, deleteButton, originalOpacity) {
    markDoneButton.addEventListener("click", function () {
        if (!isMarked) {
            title.style.textDecoration = "line-through";
            mark = document.createElement("span");
            mark.innerText = "Marked as Done ✓";
            markDoneButton.title = "Restore";
            mark.style.textDecoration = "none";
            mark.classList.add("badge", "bg-primary");
            markDoneButton.textContent = "⟲";
            title.append(mark);
            taskDiv.style.opacity = "0.5";
        } else {
            mark.remove();
            markDoneButton.title = "Marked as Done";
            markDoneButton.textContent = "✓";
            title.style.textDecoration = "none";
            taskDiv.style.opacity =
                taskDiv.dataset.originalOpacity || originalOpacity;
        }
        isMarked = !isMarked;
    });
    const savedDataBody = taskDiv.querySelector("#savedData");
    deleteButton.addEventListener("click", function () {
        if (!isMarked) {
            taskDiv.style.opacity = 0.6;
            savedDataBody.style.display = "none";
        } else {
            taskDiv.style.transform = "translateX(100%)";
            setTimeout(() => {
                resultDiv.removeChild(taskDiv);
                const parent = deleteButton.parentNode;
                let sibling = parent.previousElementSibling;
                const indexNumber = parseInt(sibling.textContent.match(/\d+/));
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                if (indexNumber !== -1) {
                tasks.splice(indexNumber-1, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
                indexing();
            }, 1200);
        }
        isMarked = !isMarked;
    });
}

function indexing() {
    const taskDivs = document.querySelectorAll(".card.col-md-6.mb-2");
    let taskNumber = 0;
    let isEmpty = true;

    taskDivs.forEach((taskDiv) => {
        const title = taskDiv.querySelector("#title");
        if (title) {
            taskNumber++;
            title.textContent = `Task ${taskNumber}${getTitleText(title)}`;
            isEmpty = false; 
        }
    });
    if (isEmpty) {
        document.getElementById("result").style.display = "none";
    }
}
function getTitleText(titleElement) {
    const titleText = titleElement.textContent;
    const startIndex = titleText.indexOf("-");
    return startIndex !== -1 ? titleText.substring(startIndex) : "";
}


function renderSavedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((taskData) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "card col-md-6 mb-2";
        taskDiv.style.width = "inherit";
        const savedData = `
            <strong>Task Name:</strong> ${taskData.taskName}<br>
            <strong>End Date:</strong> ${taskData.endDate}<br>
            <strong>Priority:</strong> ${taskData.priorityOption}<br>
            <strong>Reminder:</strong> ${taskData.reminderOption}<br>
            <strong>Comments:</strong> ${taskData.comments}
        `;
        taskDiv.innerHTML = `
            <div class="card-header fw-bolder fs-3 text-muted item-separated">
                <span id="title">Task ${taskData.taskName === "" ? "Empty Task" : " - " + taskData.taskName}</span>
                <div class="btn-group" role="group">
                    <button class="btn btn-success mark-done mx-1" title="Mark as Done">✓</button>
                    <button class="btn btn-danger delete" title="Delete">✗</button>
                </div>
            </div>
            <div class="card-body" id="savedData">${savedData}</div>
        `;
        document.getElementById('result').appendChild(taskDiv);
        document.getElementById("result").style.display = "block";
        const title = taskDiv.querySelector("#title");
        const deleteButton = taskDiv.querySelector(".delete");
        const markDoneButton = taskDiv.querySelector(".mark-done");
        const originalOpacity = taskDiv.style.opacity;
        addTaskEventListeners(taskDiv, title, markDoneButton, deleteButton,originalOpacity);
        document.getElementById('result').appendChild(taskDiv);
        indexing();
    });
}
window.addEventListener('load', renderSavedTasks);
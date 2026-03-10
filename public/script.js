// ---------- ELEMENTS ----------
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");


// ---------- REGISTER ----------
async function register() {
    const username = document.getElementById("reg-user")?.value.trim();
    const password = document.getElementById("reg-pass")?.value.trim();

    if (!username || !password) {
        alert("Fill all fields");
        return;
    }

    try {
        const res = await fetch("https://jayhit-backend.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        alert(data.message);

        if (data.message === "User Registered") {
            window.location.href = "login.html";
        }

    } catch (error) {
        alert("Server error");
        console.log(error);
    }
}


// ---------- LOGIN ----------
async function login() {
    const username = document.getElementById("login-user")?.value.trim();
    const password = document.getElementById("login-pass")?.value.trim();

    if (!username || !password) {
        alert("Fill all fields");
        return;
    }

    try {
        const res = await fetch("https://jayhit-backend.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        alert(data.message);

        if (data.message === "Login Success") {
            localStorage.setItem("username", username);
            window.location.href = "index.html";
        }

    } catch (error) {
        alert("Server error");
        console.log(error);
    }
}


// ---------- ADD TASK ----------
async function addTask() {
    const task = inputBox.value.trim();
    const username = localStorage.getItem("username");

    if (!task) {
        alert("Write something");
        return;
    }

    try {
        const res = await fetch("https://jayhit-backend.onrender.com/add-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, task })
        });

        const data = await res.json();

        alert(data.message);

        inputBox.value = "";

        loadTasks();

    } catch (error) {
        console.log(error);
    }
}


// ---------- LOAD TASKS ----------
async function loadTasks() {
    const username = localStorage.getItem("username");

    if (!username || !listContainer) return;

    try {
        const res = await fetch("https://jayhit-backend.onrender.com/get-tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        const tasks = await res.json();

        listContainer.innerHTML = "";

        tasks.forEach(task => {
            let li = document.createElement("li");
            li.innerHTML = task.task;

            if (task.completed) {
                li.classList.add("checked");
            }

            li.onclick = () => toggleTask(task._id);

            let span = document.createElement("span");
            span.innerHTML = "\u00d7";

            span.onclick = (e) => {
                e.stopPropagation();
                deleteTask(task._id);
            };

            li.appendChild(span);
            listContainer.appendChild(li);
        });

    } catch (error) {
        console.log(error);
    }
}


// ---------- DELETE TASK ----------
async function deleteTask(id) {
    try {
        await fetch("https://jayhit-backend.onrender.com/delete-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        loadTasks();

    } catch (error) {
        console.log(error);
    }
}


// ---------- TOGGLE TASK ----------
async function toggleTask(id) {
    try {
        await fetch("https://jayhit-backend.onrender.com/toggle-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        loadTasks();

    } catch (error) {
        console.log(error);
    }
}


// ---------- LOGOUT ----------
function logout() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}


// ---------- AUTO LOAD ----------
loadTasks();
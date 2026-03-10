// console.log("NEW SCRIPT LOADED");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

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
            window.location.href = "index.html";
        }

    } catch (error) {
        alert("Server error");
        console.log(error);
    }
}

function addTask() {
    if (!inputBox || inputBox.value.trim() === "") {
        alert("Write something");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    inputBox.value = "";
    saveData();
}

if (listContainer) {
    listContainer.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            saveData();
        } else if (e.target.tagName === "SPAN") {
            e.target.parentElement.remove();
            saveData();
        }
    });
}

function saveData() {
    if (listContainer) {
        localStorage.setItem("data", listContainer.innerHTML);
    }
}

function showTask() {
    if (listContainer) {
        listContainer.innerHTML = localStorage.getItem("data") || "";
    }
}

function logout() {
    window.location.href = "login.html";
}

showTask();
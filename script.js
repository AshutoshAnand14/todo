// ========== QUOTE OF THE DAY ==========
const quotes = [
    "Stay focused and never give up!",
    "Make today so awesome that yesterday gets jealous!",
    "Push yourself, because no one else is going to do it for you.",
    "Success is the sum of small efforts repeated daily.",
    "Dream it. Wish it. Do it."
];
document.getElementById('quote').innerText = quotes[Math.floor(Math.random() * quotes.length)];

// ========== GLOBAL VARIABLES ==========
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedToday = JSON.parse(localStorage.getItem('completedToday')) || 0;
const taskList = document.getElementById('taskList');
const streakCounter = document.getElementById('streakCounter');
const recentList = document.getElementById('recentList');

// ========== FUNCTIONS ==========
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedToday', JSON.stringify(completedToday));
}

function renderTasks() {
    taskList.innerHTML = '';
    let completed = 0;
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}`;
        if (task.completed) li.classList.add('completed');
        li.draggable = true;

        li.innerHTML = `
            <span ondblclick="editTask(${index})">${task.text} - [${task.category}] - Due: ${task.dueDate}</span>
            <div>
                <button onclick="toggleComplete(${index})">✅</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;

        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
        });
        li.addEventListener('drop', (e) => {
            const draggedIndex = e.dataTransfer.getData('text');
            const targetIndex = index;
            const temp = tasks[draggedIndex];
            tasks[draggedIndex] = tasks[targetIndex];
            tasks[targetIndex] = temp;
            saveTasks();
            renderTasks();
        });
        li.addEventListener('dragover', (e) => e.preventDefault());

        taskList.appendChild(li);

        if (task.completed) completed++;
    });
    updateProgressBar(completed, tasks.length);
}

function addTask() {
    const text = document.getElementById('taskInput').value;
    const priority = document.getElementById('prioritySelect').value;
    const category = document.getElementById('categorySelect').value;
    const dueDate = document.getElementById('dueDateInput').value;

    if (text.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    const newTask = {
        text,
        priority,
        category,
        dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    document.getElementById('taskInput').value = '';
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
        completedToday++;
        updateRecentActivity(tasks[index].text);
    }
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newName = prompt('Edit Task Name:', tasks[index].text);
    if (newName) {
        tasks[index].text = newName;
        saveTasks();
        renderTasks();
    }
}

function updateProgressBar(completed, total) {
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressFill').innerText = `${percent}%`;
    document.getElementById('weeklyTarget').innerText = completed;
    document.getElementById('monthlyTarget').innerText = completed;
    streakCounter.innerText = completedToday;
}

function updateRecentActivity(taskText) {
    const li = document.createElement('li');
    li.innerText = taskText;
    recentList.prepend(li);
    if (recentList.children.length > 5) {
        recentList.removeChild(recentList.lastChild);
    }
}

function searchTasks() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const priorityFilter = document.getElementById('filterPriority').value;

    const filtered = tasks.filter(task => {
        const matchText = task.text.toLowerCase().includes(searchText);
        const matchCategory = (categoryFilter === "All" || task.category === categoryFilter);
        const matchPriority = (priorityFilter === "All" || task.priority === priorityFilter);
        return matchText && matchCategory && matchPriority;
    });

    taskList.innerHTML = '';
    filtered.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}`;
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
            <span ondblclick="editTask(${index})">${task.text} - [${task.category}] - Due: ${task.dueDate}</span>
            <div>
                <button onclick="toggleComplete(${index})">✅</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// ========== EVENT LISTENERS ==========
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('searchInput').addEventListener('input', searchTasks);
document.getElementById('filterCategory').addEventListener('change', searchTasks);
document.getElementById('filterPriority').addEventListener('change', searchTasks);

// ========== INITIAL CALL ==========
renderTasks();

// ========== DARK MODE ==========
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
}

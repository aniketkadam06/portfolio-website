// ==========================================
// 2. State Management
// ==========================================
let tasks = [];
let currentFilter = 'All'; // Valid states: 'All', 'Active', 'Completed'

// ==========================================
// DOM Element Selectors (Assumed IDs)
// ==========================================
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counterDisplay = document.getElementById('task-counter');
const filterContainer = document.getElementById('filter-buttons');

// ==========================================
// 7. Event Handling & Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme") || "dark";

document.body.classList.remove("light-theme", "dark-theme");
document.body.classList.add(savedTheme + "-theme");

themeToggle.textContent =
savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click",()=>{

    const dark = document.body.classList.contains("dark-theme");

    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");

    const theme = dark ? "light" : "dark";

    localStorage.setItem("theme",theme);

    themeToggle.textContent =
    theme==="dark" ? "☀️":"🌙";

});
  // Load tasks from local storage immediately on refresh
  loadTasks();

  // Add Task: Click Event
  if (addBtn) {
    addBtn.addEventListener('click', addTask);
  }

  // Add Task: Enter Key Event
  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }

  // Event Delegation for Edit, Delete, and Complete buttons
  if (taskList) {
    taskList.addEventListener('click', (e) => {
      // Find the closest parent <li> to get the task ID
      const li = e.target.closest('.task-item');
      if (!li) return;
      
      const id = Number(li.dataset.id);

      // Handle Delete
      if (e.target.classList.contains('delete-btn')) {
        deleteTask(id);
      } 
      // Handle Edit
      else if (e.target.classList.contains('edit-btn')) {
        const currentText = li.querySelector('.task-text').textContent;
        const newText = prompt('Edit your task:', currentText);
        if (newText !== null) editTask(id, newText);
      } 
      // Handle Checkbox (Complete/Active toggle)
      else if (e.target.type === 'checkbox') {
        toggleTask(id);
      }
    });
  }

  // Event Delegation for Filter Buttons
  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        currentFilter = e.target.textContent.trim();
        renderTasks();
      }
    });
  }
});

// ==========================================
// 3. Local Storage Operations
// ==========================================
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateCounter();
}

// ==========================================
// 1. Full CRUD Operations
// ==========================================

// Create
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(), // Generate a unique ID based on timestamp
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = ''; // Clear input field
  
  saveTasks();
  renderTasks();
}

// Update
function editTask(id, newText) {
  if (newText.trim() === '') return;
  
  tasks = tasks.map(task => 
    task.id === id ? { ...task, text: newText.trim() } : task
  );
  
  saveTasks();
  renderTasks();
}

// Delete
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ==========================================
// 5. Complete Task
// ==========================================
function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  
  saveTasks();
  renderTasks();
}

// ==========================================
// 4. Filtering Logic
// ==========================================
function filterTasks() {
  if (currentFilter === 'Active') {
    return tasks.filter(task => !task.completed);
  } else if (currentFilter === 'Completed') {
    return tasks.filter(task => task.completed);
  }
  return tasks; // Default to 'All'
}

// ==========================================
// 8. Task Counter
// ==========================================
function updateCounter() {
  if (!counterDisplay) return;
  
  const activeTasks = tasks.filter(task => !task.completed).length;
  // Handle pluralization dynamically
  counterDisplay.textContent = `${activeTasks} Task${activeTasks !== 1 ? 's' : ''} Left`;
}

// ==========================================
// 6. Dynamic DOM Manipulation
// ==========================================
function renderTasks() {
  if (!taskList) return;
  
  // Clear the list to prevent duplicates
  taskList.innerHTML = '';
  
  // Get only the tasks that match the current filter
  const tasksToRender = filterTasks();

  tasksToRender.forEach(task => {
    // Construct List Item completely via JavaScript
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.classList.add('task-item');
    if (task.completed) {
      li.classList.add('completed');
    }

    // Construct Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    // Construct Task Text
    const span = document.createElement('span');
    span.textContent = task.text;
    span.classList.add('task-text');

    // Construct Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');

    // Construct Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    // Assemble the DOM elements
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    
    // Append to the actual task list container
    taskList.appendChild(li);
  });

  updateCounter();
}

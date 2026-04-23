// Current state
let selectedDate = new Date().toISOString().split('T')[0];
let db = JSON.parse(localStorage.getItem('myTrackerDB')) || {};

const datePicker = document.getElementById('datePicker');
datePicker.value = selectedDate;

// Load data when date changes
datePicker.addEventListener('change', (e) => {
    selectedDate = e.target.value;
    loadDayData();
});

function addItem(type) {
    const inputId = type === 'tasks' ? 'taskInput' : 'foodInput';
    const input = document.getElementById(inputId);
    if (!input.value) return;

    if (!db[selectedDate]) db[selectedDate] = { tasks: [], food: [], diary: '', mood: '😊 Happy' };
    
    db[selectedDate][type].push({ text: input.value, done: false });
    input.value = '';
    render();
}

function toggleItem(type, index) {
    db[selectedDate][type][index].done = !db[selectedDate][type][index].done;
    render();
}

function render() {
    const dayData = db[selectedDate] || { tasks: [], food: [], diary: '', mood: '😊 Happy' };
    
    renderList('taskList', dayData.tasks, 'tasks');
    renderList('foodList', dayData.food, 'food');
    
    document.getElementById('taskScore').innerText = `Performance: ${dayData.tasks.filter(t => t.done).length}/${dayData.tasks.length}`;
    document.getElementById('foodScore').innerText = `Performance: ${dayData.food.filter(f => f.done).length}/${dayData.food.length}`;
    
    document.getElementById('diaryInput').value = dayData.diary;
    document.getElementById('moodSelect').value = dayData.mood;

    localStorage.setItem('myTrackerDB', JSON.stringify(db));
}

function renderList(id, list, type) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="text-decoration: ${item.done ? 'line-through' : 'none'}">${item.text}</span>
            <input type="checkbox" ${item.done ? 'checked' : ''} onclick="toggleItem('${type}', ${index})">
        `;
        el.appendChild(li);
    });
}

function saveDayData() {
    if (!db[selectedDate]) db[selectedDate] = { tasks: [], food: [], diary: '', mood: '😊 Happy' };
    db[selectedDate].diary = document.getElementById('diaryInput').value;
    db[selectedDate].mood = document.getElementById('moodSelect').value;
    
    localStorage.setItem('myTrackerDB', JSON.stringify(db));
    alert("Magic Saved for " + selectedDate + "! ✨");
    showMotivation();
}

function showMotivation() {
    const quotes = [
        "నువ్వు అనుకుంటే ఏదైనా సాధించగలవు!",
        "ప్రతి రోజు ఒక కొత్త అవకాశం.",
        "Small progress is still progress!",
        "ఆగిపోకు, నీ గమ్యం చేరుకునే వరకు సాగిపో!"
    ];
    document.getElementById('motivationBox').innerText = quotes[Math.floor(Math.random() * quotes.length)];
}

// Initial Load
loadDayData();

function loadDayData() {
    render();
}
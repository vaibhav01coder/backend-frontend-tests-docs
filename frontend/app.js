async function loadTasks() {
    const search = document.getElementById('search-input').value.trim();
    const category = document.getElementById('category-filter').value;

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);

    const res = await fetch('/api/tasks?' + params);
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!task.completed;
        checkbox.onchange = () => toggleTask(task.id, checkbox.checked);

        const span = document.createElement('span');
        span.textContent = task.title;

        if (task.category) {
            const badge = document.createElement('span');
            badge.className = 'category-badge';
            badge.textContent = task.category;
            span.appendChild(badge);
        }

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.onclick = () => deleteTask(task.id);

        li.append(checkbox, span, del);
        list.appendChild(li);
    });
}

async function addTask() {
    const input = document.getElementById('task-input');
    const title = input.value.trim();
    if (!title) return;
    const category = document.getElementById('category-select').value;
    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category })
    });
    input.value = '';
    loadTasks();
}

async function toggleTask(id, completed) {
    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('search-input').addEventListener('input', loadTasks);
document.getElementById('category-filter').addEventListener('change', loadTasks);

loadTasks();

async function loadTasks() {
    try {
        const search = document.getElementById('search-input').value.trim();
        const category = document.getElementById('category-filter').value;

        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);

        const res = await fetch('/api/tasks?' + params);
        if (!res.ok) throw new Error('Failed to load tasks');
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
    } catch (err) {
        console.error('loadTasks:', err);
    }
}

async function addTask() {
    try {
        const input = document.getElementById('task-input');
        const title = input.value.trim();
        if (!title) return;
        const category = document.getElementById('category-select').value;
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category })
        });
        if (!res.ok) {
            const { error } = await res.json();
            alert(error || 'Failed to add task');
            return;
        }
        input.value = '';
        await loadTasks();
    } catch (err) {
        console.error('addTask:', err);
    }
}

async function toggleTask(id, completed) {
    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        if (!res.ok) throw new Error('Failed to update task');
        await loadTasks();
    } catch (err) {
        console.error('toggleTask:', err);
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete task');
        await loadTasks();
    } catch (err) {
        console.error('deleteTask:', err);
    }
}

document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('search-input').addEventListener('input', loadTasks);
document.getElementById('category-filter').addEventListener('change', loadTasks);

loadTasks();

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'tasks.json');

function load() {
    if (!fs.existsSync(FILE)) return { nextId: 1, tasks: [] };
    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch {
        return { nextId: 1, tasks: [] };
    }
}

function save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    getAll({ category, search } = {}) {
        let { tasks } = load();
        if (category) tasks = tasks.filter(t => t.category === category);
        if (search) {
            const q = search.toLowerCase();
            tasks = tasks.filter(t => t.title.toLowerCase().includes(q));
        }
        return tasks;
    },
    insert(title, category = '') {
        const data = load();
        const task = { id: data.nextId++, title, category, completed: 0 };
        data.tasks.push(task);
        save(data);
        return task;
    },
    update(id, completed) {
        const data = load();
        const task = data.tasks.find(t => t.id === Number(id));
        if (!task) return false;
        task.completed = completed ? 1 : 0;
        save(data);
        return true;
    },
    delete(id) {
        const data = load();
        const exists = data.tasks.some(t => t.id === Number(id));
        if (!exists) return false;
        data.tasks = data.tasks.filter(t => t.id !== Number(id));
        save(data);
        return true;
    }
};

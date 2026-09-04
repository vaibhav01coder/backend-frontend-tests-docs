const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'tasks.json');
const TMP  = FILE + '.tmp';

function load() {
    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('tasks.json parse/read error — starting fresh:', err.message);
        }
        return { nextId: 1, tasks: [] };
    }
}

function save(data) {
    // atomic write: write to .tmp then rename so a crash mid-write never corrupts the file
    fs.writeFileSync(TMP, JSON.stringify(data, null, 2));
    fs.renameSync(TMP, FILE);
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
        task.completed = completed === true ? 1 : 0;
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

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory storage (no DB yet - this is a gap!)
let tasks = [
    { id: 1, title: 'Sample Task', completed: false }
];

// Only basic CRUD - missing features are gaps!
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
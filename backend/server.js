const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const VALID_CATEGORIES = ['', 'Work', 'Personal', 'Shopping', 'Health', 'Other'];

app.get('/api/tasks', (req, res) => {
    try {
        const { category, search } = req.query;
        res.json(db.getAll({ category, search }));
    } catch (err) {
        res.status(500).json({ error: 'Failed to load tasks' });
    }
});

app.post('/api/tasks', (req, res) => {
    try {
        const { title, category = '' } = req.body;
        if (!title || !title.trim()) return res.status(400).json({ error: 'title required' });
        if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ error: 'invalid category' });
        res.status(201).json(db.insert(title.trim(), category));
    } catch (err) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

app.put('/api/tasks/:id', (req, res) => {
    try {
        const { completed } = req.body;
        if (completed === undefined) return res.status(400).json({ error: 'completed required' });
        const found = db.update(req.params.id, completed);
        if (!found) return res.status(404).json({ error: 'task not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// test-only reset — must be before /:id to avoid being swallowed by the wildcard
app.delete('/api/tasks/__reset', (req, res) => {
    const fs = require('fs');
    const file = require('path').join(__dirname, 'tasks.json');
    if (fs.existsSync(file)) fs.unlinkSync(file);
    res.json({ success: true });
});

app.delete('/api/tasks/:id', (req, res) => {
    try {
        const found = db.delete(req.params.id);
        if (!found) return res.status(404).json({ error: 'task not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(4000, () => console.log('Running on http://localhost:4000'));

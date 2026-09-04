const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/tasks', (req, res) => {
    const { category, search } = req.query;
    res.json(db.getAll({ category, search }));
});

app.post('/api/tasks', (req, res) => {
    const { title, category } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'title required' });
    res.json(db.insert(title.trim(), category || ''));
});

app.put('/api/tasks/:id', (req, res) => {
    db.update(req.params.id, req.body.completed);
    res.json({ success: true });
});

app.delete('/api/tasks/:id', (req, res) => {
    db.delete(req.params.id);
    res.json({ success: true });
});

app.listen(4000, () => console.log('Running on http://localhost:4000'));

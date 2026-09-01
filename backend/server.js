const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// Create task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
  res.json({ id: result.lastInsertRowid, title, completed: 0 });
});

// Toggle complete
app.put('/api/tasks/:id', (req, res) => {
  const { completed } = req.body;
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, req.params.id);
  res.json({ success: true });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
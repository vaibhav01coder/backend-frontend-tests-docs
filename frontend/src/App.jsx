import { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:4000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const load = async () => {
    const res = await fetch(API);
    setTasks(await res.json());
  };

  useEffect(() => { load(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    load();
  };

  const toggle = async (t) => {
    await fetch(`${API}/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !t.completed }),
    });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          id="task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          style={{ flex: 1, padding: 8 }}
        />
        <button id="add-task" onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id} style={{ margin: '8px 0' }}>
            <span
              onClick={() => toggle(t)}
              style={{ textDecoration: t.completed ? 'line-through' : 'none', cursor: 'pointer' }}
            >
              {t.title}
            </span>
            <button onClick={() => remove(t.id)} style={{ marginLeft: 8 }}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
import { useEffect, useState } from 'react';
import '../panel.css';
import { createTask, deleteTask, getLists, getTasks } from '../../core/api/tasks-reminders-api';
import type { Task, TaskList, TaskPriority, TaskStatusFilter } from '../../core/models/api.types';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter | ''>('');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const filters = statusFilter ? { status: statusFilter } : undefined;
      const [tasksData, listsData] = await Promise.all([getTasks(filters), getLists()]);

      setTasks(tasksData);
      setLists(listsData);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        priority,
        due_date: dueDate || null,
        list_id: listId ? Number(listId) : null,
      });

      setTitle('');
      setPriority('medium');
      setDueDate('');
      setListId('');
      loadData();
    } catch {
      setError('Failed to create task.');
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      await deleteTask(id);
      loadData();
    } catch {
      setError('Failed to delete task.');
    }
  }

  function getListName(taskListId: number | null) {
    if (taskListId === null) return 'No List';
    const list = lists.find((item) => item.id === taskListId);
    return list ? list.name : 'Unknown List';
  }

  return (
    <section className="panel">
      <h2>Tasks</h2>
      <p className="lead">Manage your daily tasks</p>

      {/* FORM */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select value={listId} onChange={(e) => setListId(e.target.value)}>
            <option value="">No List</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button type="submit">Add Task</button>
        </div>
      </form>

      {/* FILTER */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="statusFilter" style={{ fontWeight: 500 }}>
          Filter:
        </label>{' '}
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatusFilter | '')}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <p className="muted">{error}</p>}

      {/* TASK LIST */}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                background: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{task.title}</h3>

                  <p style={{ margin: '0.4rem 0' }}>
                    <strong>Status:</strong>{' '}
                    <span style={{ color: task.completed ? '#16a34a' : '#dc2626' }}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </p>

                  <p style={{ margin: '0.4rem 0' }}>
                    <strong>Priority:</strong> {task.priority}
                  </p>

                  <p style={{ margin: '0.4rem 0' }}>
                    <strong>Due:</strong> {task.due_date || '—'}
                  </p>

                  <p style={{ margin: '0.4rem 0' }}>
                    <strong>List:</strong> {getListName(task.list_id)}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      background: '#ef4444',
                      padding: '8px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
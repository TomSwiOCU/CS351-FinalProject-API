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
      <p className="lead">Manage your daily tasks, assign them to lists, and track completion status.</p>

      <form onSubmit={handleAddTask} style={{ marginBottom: '1rem' }}>
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

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="statusFilter">Filter by status: </label>{' '}
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

      {loading ? (
        <p className="muted">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{task.title}</h3>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}
                  </p>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>Due Date:</strong> {task.due_date || 'No due date'}
                  </p>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>List:</strong> {getListName(task.list_id)}
                  </p>
                </div>

                <div>
                  <button type="button" onClick={() => handleDeleteTask(task.id)}>
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
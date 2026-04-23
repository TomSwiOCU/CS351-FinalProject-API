import { useEffect, useState } from 'react';
import '../panel.css';
import { createList, deleteList, getLists, getTasksForList } from '../../core/api/tasks-reminders-api';
import type { Task, TaskList } from '../../core/models/api.types';

export function ListsPage() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadLists() {
    try {
      setLoading(true);
      setError('');
      const data = await getLists();
      setLists(data);
    } catch {
      setError('Failed to load lists.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLists();
  }, []);

  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createList({ name: name.trim() });
      setName('');
      loadLists();
    } catch {
      setError('Failed to create list.');
    }
  }

  async function handleDeleteList(id: number) {
    try {
      await deleteList(id);

      if (selectedListId === id) {
        setSelectedListId(null);
        setTasks([]);
      }

      loadLists();
    } catch {
      setError('Failed to delete list.');
    }
  }

  async function handleViewTasks(listId: number) {
    try {
      setTasksLoading(true);
      setError('');
      setSelectedListId(listId);

      const data = await getTasksForList(listId);
      setTasks(data);
    } catch {
      setError('Failed to load tasks for this list.');
    } finally {
      setTasksLoading(false);
    }
  }

  function getSelectedListName() {
    const list = lists.find((item) => item.id === selectedListId);
    return list ? list.name : 'Selected List';
  }

  return (
    <section className="panel">
      <h2>Task Lists</h2>
      <p className="lead">Create lists to group tasks and view the tasks inside each list.</p>

      <form onSubmit={handleCreateList} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="List name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Add List</button>
        </div>
      </form>

      {error && <p className="muted">{error}</p>}

      {loading ? (
        <p className="muted">Loading lists...</p>
      ) : lists.length === 0 ? (
        <p className="muted">No lists found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {lists.map((list) => (
            <div
              key={list.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{list.name}</h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => handleViewTasks(list.id)}>
                    View Tasks
                  </button>
                  <button type="button" onClick={() => handleDeleteList(list.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedListId !== null && (
        <div>
          <h3>{getSelectedListName()} Tasks</h3>

          {tasksLoading ? (
            <p className="muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks in this list.</p>
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
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}
                  </p>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p style={{ margin: '0.35rem 0' }}>
                    <strong>Due Date:</strong> {task.due_date || 'No due date'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
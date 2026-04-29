import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../panel.css';
import { 
  createTask, 
  deleteTask, 
  getTasks, 
  getLists,
  toggleTaskComplete 
} from '../../core/api/tasks-reminders-api';
import type { Task, TaskList, TaskPriority } from '../../core/models/api.types';

type OutletContextType = {
  selectedListId: number | null;
};

export function TasksPage() {
  // GET SELECTED LIST FROM PARENT
  const { selectedListId } = useOutletContext<OutletContextType>();

  // STATE MANAGEMENT
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedFormListId, setSelectedFormListId] = useState<string>('');

  // LOAD TASKS AND LISTS FROM API
  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const filters: any = selectedListId !== null ? { list_id: selectedListId } : {};
      const [tasksData, listsData] = await Promise.all([getTasks(filters), getLists()]);

      setTasks(tasksData);
      setLists(listsData);
    } catch (err) {
      console.error('loadData failed:', err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }

  // RUN WHEN PAGE LOADS OR LIST CHANGES
  useEffect(() => {
    loadData();
  }, [selectedListId]);

  // This is the fixed toggle handler
  const handleToggleComplete = async (id: number) => {
    console.log('Button clicked! Task ID:', id);

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      await toggleTaskComplete(id);
      console.log('Toggle successful - syncing with server');
      await loadData();
    } catch (err) {
      console.error('Toggle failed:', err);
      setError('Failed to update task status.');
      loadData();
    }
  };

  // ADD NEW TASK
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        priority,
        due_date: dueDate || null,
        list_id: selectedFormListId ? Number(selectedFormListId) : (selectedListId || null),
      });
      setTitle('');
      setPriority('medium');
      setDueDate('');
      setSelectedFormListId('');
      loadData();
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      loadData();
    } catch {
      setError('Failed to delete task.');
    }
  };

  // GET LIST NAME FOR DISPLAY
  const getListName = (taskListId: number | null) => {
    if (taskListId === null) return 'No Category';
    const list = lists.find(l => l.id === taskListId);
    return list ? list.name : 'Unknown';
  };

  const currentListName = selectedListId 
    ? lists.find(l => l.id === selectedListId)?.name 
    : null;

  return (
    <section className="panel">
      <h2>
        {currentListName ? `Tasks in "${currentListName}"` : 'All Tasks'}
      </h2>
      <p className="lead">Manage your daily tasks and productivity</p>

      {/* ADD TASK FORM */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="What needs to be done today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
          </div>

          <select 
            value={selectedFormListId} 
            onChange={(e) => setSelectedFormListId(e.target.value)}
          >
            <option value="">No Category</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button type="submit">Add Task</button>
        </div>
      </form>

      {/* ERROR MESSAGE */}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {/* TASK LIST DISPLAY */}
      {loading ? (
        <p className="muted">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="muted">
          {selectedListId ? `No tasks in "${currentListName}" yet.` : 'No tasks found. Add one above!'}
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </h3>
                  
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
                    <strong>Due:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                  </p>

                  <p style={{ margin: '0.4rem 0' }}>
                    <strong>Category:</strong> {getListName(task.list_id)}
                  </p>
                </div>

                {/* TASK ACTION BUTTONS */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    style={{
                      background: task.completed ? '#16a34a' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    {task.completed ? 'Undo' : 'Mark Complete'}
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
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
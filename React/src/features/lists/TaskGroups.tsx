// src/features/lists/TaskGroups.tsx
import { useState, useEffect } from 'react';
import { getLists, createList, deleteList } from '../../core/api/tasks-reminders-api';
import type { TaskList } from '../../core/models/api.types';
import '../panel.css';

interface TaskGroupsProps {
  selectedListId: number | null;
  onSelectList: (listId: number | null) => void;
}

export function TaskGroups({ selectedListId, onSelectList }: TaskGroupsProps) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLists = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getLists();
      setLists(data);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await createList({ name: newListName.trim() });
      setNewListName('');
      loadLists();
    } catch {
      setError('Failed to create category');
    }
  };

  const handleDeleteList = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteList(id);
      if (selectedListId === id) onSelectList(null);
      loadLists();
    } catch {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="panel">
      <h2>Categories</h2>
      <p className="lead">Group your daily tasks</p>

      <form onSubmit={handleCreateList} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="New category name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={!newListName.trim()}>Add</button>
        </div>
      </form>

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {loading ? (
        <p className="muted">Loading categories...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            onClick={() => onSelectList(null)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: selectedListId === null ? '#2563eb' : '#f1f5f9',
              color: selectedListId === null ? 'white' : 'inherit',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            All Tasks
          </div>

          {lists.map((list) => (
            <div
              key={list.id}
              onClick={() => onSelectList(list.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                background: selectedListId === list.id ? '#2563eb' : '#f1f5f9',
                color: selectedListId === list.id ? 'white' : 'inherit',
                cursor: 'pointer',
              }}
            >
              <span>{list.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem' }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
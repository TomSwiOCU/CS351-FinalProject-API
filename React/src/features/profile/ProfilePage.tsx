// src/features/profile/ProfilePage.tsx
import { useEffect, useState } from 'react';
import '../panel.css';
import { getProfile, updateProfile } from '../../core/api/tasks-reminders-api';
import type { UserProfile } from '../../core/models/api.types';

export function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Load current user profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const profile = await getProfile();
      setUser(profile);
      setName(profile.name || '');
      setEmail(profile.email || '');
    } catch (err) {
      setError('Failed to load profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updates: any = {};
      if (name !== user.name) updates.name = name;
      if (email !== user.email) updates.email = email;
      if (password) updates.password = password;

      if (Object.keys(updates).length === 0) {
        setSuccess('No changes to save.');
        setSaving(false);
        return;
      }

      const updatedProfile = await updateProfile(updates);
      setUser(updatedProfile);
      setSuccess('Profile updated successfully!');
      setPassword(''); // clear password field
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section className="panel"><p className="muted">Loading profile...</p></section>;

  return (
    <section className="panel">
      <h2>Profile</h2>
      <p className="lead">Manage your account information</p>

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {success && <p style={{ color: '#16a34a' }}>{success}</p>}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gap: '1.25rem', maxWidth: '500px' }}>
          <label>
            <strong>Name</strong>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </label>

          <label>
            <strong>Email</strong>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </label>

          <label>
            <strong>New Password</strong>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
        Logged in as: <strong>{user?.email}</strong>
      </p>
    </section>
  );
}
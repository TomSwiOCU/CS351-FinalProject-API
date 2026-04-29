// src/features/login/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../core/auth/auth';
import type { ApiErrorBody } from '../../core/models/api.types';
import './LoginPage.css';

/**
 * LoginPage Component
 * - Handles user authentication using the backend /auth/login endpoint
 * - Minimal changes from original file (only title, subtitle, demo hint added)
 */
export function LoginPage() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simple validation
  const emailInvalid = touched.email && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const passwordInvalid = touched.password && !password;

  /**
   * Handle form submission
   * - Calls the backend login function
   * - On success: navigates to /tasks
   * - On error: shows error message from API
   */
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email || !password || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await login({ email, password });
      navigate('/tasks', { replace: true });
    } catch (err: unknown) {
      const body = (err as { body?: ApiErrorBody })?.body;
      const msg = body?.error?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="card">
        {/* Project title and description */}
        <h1>Daily Task Log</h1>
        <p className="subtitle">Track your day • Stay organized • Reflect on progress</p>

        {errorMessage && (
          <div className="alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="login-form" onSubmit={submit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="student@example.com"
            />
            {emailInvalid && <span className="hint">Enter a valid email.</span>}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="••••••••"
            />
            {passwordInvalid && <span className="hint">Password is required.</span>}
          </label>

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Demo: <strong>student@example.com</strong> / <strong>secret</strong>
        </div>
      </div>
    </div>
  );
}
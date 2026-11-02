import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { authenticate } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', program: 'Computer Science' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await authenticate(isRegister ? 'register' : 'login', form); navigate(location.state?.from || '/'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><section className="auth-showcase"><Link to="/login" className="brand"><span className="brand-mark">E</span>EduSphere</Link><div className="showcase-copy"><p className="eyebrow">STUDY SMARTER</p><h1>Build better learning habits, one day at a time.</h1><p>Keep your tasks, focus sessions, and academic goals in one calm workspace.</p></div><div className="showcase-card"><span className="card-icon">✦</span><div><b>Start your journey</b><small>Organize today. Achieve more tomorrow.</small></div></div></section>
    <section className="auth-panel"><form className="auth-form" onSubmit={submit}><p className="eyebrow">{isRegister ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</p><h2>{isRegister ? 'Welcome to EduSphere' : 'Log in to your workspace'}</h2><p className="muted">{isRegister ? 'Set up your workspace in less than a minute.' : 'Pick up right where you left off.'}</p>
      {isRegister && <div className="name-row"><label>First name<input name="firstName" value={form.firstName} onChange={change} placeholder="Aneesh" required /></label><label>Last name<input name="lastName" value={form.lastName} onChange={change} placeholder="Kumar" required /></label></div>}
      <label>Email address<input type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" required /></label>
      {isRegister && <label>Course or program<input name="program" value={form.program} onChange={change} placeholder="Computer Science" /></label>}
      <label>Password<input type="password" name="password" value={form.password} onChange={change} placeholder={isRegister ? 'Create a secure password' : 'Enter your password'} minLength={isRegister ? 8 : 1} required /></label>
      {error && <p className="error-text">{error}</p>}<button className="btn btn-primary full" disabled={busy}>{busy ? 'Please wait...' : isRegister ? 'Create account →' : 'Log in →'}</button><p className="form-footer">{isRegister ? 'Already have an account?' : 'New to EduSphere?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></p></form></section></main>;
}

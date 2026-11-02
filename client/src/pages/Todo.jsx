import { useEffect, useState } from 'react'; import { api, uploadUrl } from '../api';
export default function Todo() {
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [show, setShow] = useState(false);
   const [filter, setFilter] = useState('All');
   const [form, setForm] = useState({ title: '', subject: '', dueDate: '', priority: 'Medium', kind: 'task' });
   const [file, setFile] = useState(null); const [busy, setBusy] = useState(false);
   async function refresh() {
      try {
         setTasks(await api('/tasks'));
         setError('')
      } catch (e) { setError(e.message) } finally { setLoading(false) }
   } useEffect(() => { refresh() }, []);
   async function addTask(e) {
      e.preventDefault(); setBusy(true);
      setError(''); try {
         const body = new FormData(); Object.entries(form).forEach(([k, v]) => body.append(k, v)); if (file) body.append('file', file); const task = await api('/tasks', { method: 'POST', body }); setTasks([task, ...tasks]);
         setForm({ title: '', subject: '', dueDate: '', priority: 'Medium', kind: 'task' }); setFile(null);
         setShow(false)
      } catch (e) { setError(e.message) } finally { setBusy(false) }
   }
   async function toggle(task) { try { const updated = await api(`/tasks/${task._id}`, { method: 'PATCH', body: JSON.stringify({ completed: !task.completed }) }); setTasks(tasks.map(t => t._id === updated._id ? updated : t)) } catch (e) { setError(e.message) } }
   async function remove(task) { try { await api(`/tasks/${task._id}`, { method: 'DELETE' }); setTasks(tasks.filter(t => t._id !== task._id)) } catch (e) { setError(e.message) } }
   const visible = tasks.filter(t => filter === 'All' || (filter === 'Completed' ? t.completed : !t.completed));

   return <div className="page-content"><header className="page-heading"><div><p className="eyebrow">PRODUCTIVITY</p><h1>To-do</h1><p className="muted">Stay organized, focus on what matters, and get things done.</p></div><button className="btn btn-primary" onClick={() => setShow(true)}>＋ Add task</button></header>{error && <p className="error-text">{error}</p>}
      <section className="stats-grid compact-stats">{[['Total tasks', tasks.length], ['Completed', tasks.filter(t => t.completed).length], ['Remaining', tasks.filter(t => !t.completed).length]].map(([label, value]) => <article className="stat-card" key={label}><p>{label}</p><strong className="count-up">{value}</strong><small>Across your workspace</small></article>)}</section>
      <section className="panel task-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR LIST</p><h2>Tasks and assignments</h2></div><div className="filter-tabs">{['All', 'Pending', 'Completed'].map(x => <button key={x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div></div>
         {loading ? <div className="skeleton-card"><div className="skeleton-line" /><div className="skeleton-line short" /></div> : visible.map(task => <div className="task-row todo-row" key={task._id}><button className={`check-task ${task.completed ? 'checked' : ''}`} aria-label="Toggle task completion" onClick={() => toggle(task)}>{task.completed ? '✓' : ''}</button><div className="task-info"><b className={task.completed ? 'is-done' : ''}>{task.title}</b><small>{task.kind === 'assignment' ? 'Assignment' : 'Task'} · {task.subject || 'General'}{task.dueDate ? ` · Due ${task.dueDate}` : ''}{task.filePath && <> · <a className="text-link" href={uploadUrl(task.filePath)} target="_blank" rel="noreferrer">{task.fileName || 'Attachment'}</a></>}</small></div><span className={`priority priority-${task.priority?.toLowerCase()}`}>{task.priority}</span><button className="delete-btn" onClick={() => remove(task)} aria-label="Delete task">×</button></div>)}{!loading && visible.length === 0 && <div className="empty-state"><span>✦</span><b>Nothing on this list</b><p>Add a task and make today count.</p></div>}</section>
      {show && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShow(false) }}><form className="modal-card" onSubmit={addTask}><div className="panel-heading"><div><p className="eyebrow">MAKE A PLAN</p><h2>New task</h2></div><button type="button" className="close-btn" onClick={() => setShow(false)}>×</button></div><label>Task title<input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Revise data structures" required /></label><label>Subject<input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Computer Networks" /></label><div className="name-row"><label>Due date<input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label><label>Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label></div><label>Type<select value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}><option value="task">Task</option><option value="assignment">Assignment</option></select></label>{form.kind === 'assignment' && <label>Attach a file (max 5 MB)<input type="file" onChange={e => setFile(e.target.files[0] || null)} /></label>}<div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={() => setShow(false)}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save task'}</button></div></form></div>}
   </div>;
}

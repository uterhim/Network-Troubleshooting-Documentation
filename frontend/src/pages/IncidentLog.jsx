import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = { title: '', category: 'Network', severity: 'medium', affected_users: 1 };

export default function IncidentLog() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
  api.getIncidents().then(setIncidents).catch((e) => setError(e.message));
};
useEffect(() => {
  load();
}, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.createIncident(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const total = incidents.length;
  const open = incidents.filter((i) => !i.resolved_at).length;
  const avgDowntime = (() => {
    const resolved = incidents.filter((i) => i.downtime_minutes != null);
    if (!resolved.length) return null;
    return Math.round(resolved.reduce((sum, i) => sum + Number(i.downtime_minutes), 0) / resolved.length);
  })();

  return (
    <div>
      <h2>Incident Log</h2>
      {error && <div className="card" style={{ background: '#ffebee', color: '#c62828' }}>{error}</div>}

      <div className="stats-grid">
        <div className="stat-card"><div className="num">{total}</div><div className="label">Total incidents</div></div>
        <div className="stat-card"><div className="num">{open}</div><div className="label">Currently open</div></div>
        <div className="stat-card"><div className="num">{avgDowntime ?? '—'}</div><div className="label">Avg. downtime (min)</div></div>
      </div>

      <button className="btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Log new incident'}
      </button>

      {showForm && (
        <form onSubmit={submit} className="card" style={{ marginTop: 12 }}>
          <label>Title</label>
          <input required value={form.title} onChange={set('title')} placeholder="e.g. Office-wide internet outage" />
          <label>Category</label>
          <select value={form.category} onChange={set('category')}>
            {['Network', 'DNS', 'VPN', 'Wireless', 'Outage', 'Hardware'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <label>Severity</label>
          <select value={form.severity} onChange={set('severity')}>
            {['low', 'medium', 'high', 'critical'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label>Affected users</label>
          <input type="number" min="1" value={form.affected_users} onChange={set('affected_users')} />
          <button className="btn" style={{ marginTop: 12 }} type="submit">Save incident</button>
        </form>
      )}

      <table className="incidents" style={{ marginTop: 16 }}>
        <thead>
          <tr><th>Title</th><th>Category</th><th>Severity</th><th>Users</th><th>Reported</th><th>Downtime</th></tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.category}</td>
              <td><span className={`badge badge-${i.severity}`}>{i.severity}</span></td>
              <td>{i.affected_users}</td>
              <td>{new Date(i.reported_at).toLocaleDateString()}</td>
              <td>{i.downtime_minutes != null ? `${Math.round(i.downtime_minutes)} min` : 'Open'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

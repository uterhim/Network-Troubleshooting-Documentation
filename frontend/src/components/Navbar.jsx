export default function Navbar({ view, setView }) {
  return (
    <div className="navbar">
      <h1>🌐 Network Troubleshooting & Documentation</h1>
      <nav>
        <button className={view === 'incidents' ? 'active' : ''} onClick={() => setView('incidents')}>Incident Log</button>
        <button className={view === 'runbooks' ? 'active' : ''} onClick={() => setView('runbooks')}>Runbooks</button>
      </nav>
    </div>
  );
}

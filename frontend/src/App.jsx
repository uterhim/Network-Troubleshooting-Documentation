import { useState } from 'react';
import Navbar from './components/Navbar';
import IncidentLog from './pages/IncidentLog';
import Runbooks from './pages/Runbooks';

export default function App() {
  const [view, setView] = useState('incidents');

  return (
    <div>
      <Navbar view={view} setView={setView} />
      {view === 'incidents' && (
        <div className="container single">
          <IncidentLog />
        </div>
      )}
      {view === 'runbooks' && <Runbooks />}
    </div>
  );
}

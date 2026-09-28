import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { api } from '../api';

export default function Runbooks() {
  const [runbooks, setRunbooks] = useState([]);
  const [active, setActive] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getRunbooks()
      .then((list) => {
        setRunbooks(list);
        if (list.length) selectRunbook(list[0].slug);
      })
      .catch((e) => setError(e.message));
  }, []);

  const selectRunbook = (slug) => {
    setActive(slug);
    api.getRunbook(slug).then((r) => setContent(r.content)).catch((e) => setError(e.message));
  };

  if (error) return <div className="card" style={{ background: '#ffebee', color: '#c62828' }}>{error}</div>;

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Runbooks</h3>
        <ul>
          {runbooks.map((r) => (
            <li key={r.slug} className={active === r.slug ? 'active' : ''} onClick={() => selectRunbook(r.slug)}>
              {r.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: content ? marked.parse(content) : '<p>Select a runbook.</p>' }} />
    </div>
  );
}

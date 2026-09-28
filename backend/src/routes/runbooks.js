const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const RUNBOOKS_DIR = path.join(__dirname, '..', '..', '..', 'docs', 'runbooks');

function parseTitle(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].replace(/^Runbook:\s*/, '') : fallback;
}

// GET /api/runbooks — list available runbooks
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(RUNBOOKS_DIR).filter((f) => f.endsWith('.md'));
    const runbooks = files.map((filename) => {
      const content = fs.readFileSync(path.join(RUNBOOKS_DIR, filename), 'utf-8');
      return { slug: filename, title: parseTitle(content, filename) };
    });
    res.json(runbooks.sort((a, b) => a.slug.localeCompare(b.slug)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list runbooks' });
  }
});

// GET /api/runbooks/:slug — raw markdown content of one runbook
router.get('/:slug', (req, res) => {
  try {
    const safeSlug = path.basename(req.params.slug); // prevent path traversal
    const filePath = path.join(RUNBOOKS_DIR, safeSlug);
    if (!filePath.startsWith(RUNBOOKS_DIR) || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Runbook not found' });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ slug: safeSlug, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read runbook' });
  }
});

module.exports = router;

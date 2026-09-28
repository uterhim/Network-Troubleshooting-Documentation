const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/incidents — list, filterable by category/severity
router.get('/', async (req, res) => {
  try {
    const { category, severity } = req.query;
    const conditions = [];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    if (severity) {
      values.push(severity);
      conditions.push(`severity = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT *,
        CASE WHEN resolved_at IS NOT NULL
          THEN EXTRACT(EPOCH FROM (resolved_at - reported_at)) / 60
          ELSE NULL END AS downtime_minutes
       FROM incidents ${where} ORDER BY reported_at DESC`,
      values
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// POST /api/incidents
router.post('/', async (req, res) => {
  try {
    const { title, category, severity, affected_users, root_cause, resolution, runbook_used } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'title and category are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO incidents (title, category, severity, affected_users, root_cause, resolution, runbook_used)
       VALUES ($1, $2, COALESCE($3, 'medium')::incident_severity, COALESCE($4, 1), $5, $6, $7)
       RETURNING *`,
      [title, category, severity, affected_users, root_cause, resolution, runbook_used]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// PATCH /api/incidents/:id — mainly used to close out an incident
router.patch('/:id', async (req, res) => {
  try {
    const { root_cause, resolution, runbook_used, resolved } = req.body;
    const resolvedClause = resolved ? ', resolved_at = now()' : '';
    const { rows } = await pool.query(
      `UPDATE incidents
       SET root_cause = COALESCE($1, root_cause),
           resolution = COALESCE($2, resolution),
           runbook_used = COALESCE($3, runbook_used)
           ${resolvedClause}
       WHERE id = $4
       RETURNING *`,
      [root_cause, resolution, runbook_used, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Incident not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

module.exports = router;

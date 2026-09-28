const express = require('express');
const cors = require('cors');
require('dotenv').config();

const incidentsRouter = require('./routes/incidents');
const runbooksRouter = require('./routes/runbooks');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/incidents', incidentsRouter);
app.use('/api/runbooks', runbooksRouter);

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`Network docs API running on http://localhost:${PORT}`));

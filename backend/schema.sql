-- Network Troubleshooting & Documentation — incident log schema (PostgreSQL)

DROP TABLE IF EXISTS incidents CASCADE;

CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE incidents (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    category         VARCHAR(100) NOT NULL,
    severity         incident_severity NOT NULL DEFAULT 'medium',
    affected_users   INTEGER NOT NULL DEFAULT 1,
    reported_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at      TIMESTAMPTZ,
    root_cause       TEXT,
    resolution       TEXT,
    runbook_used     VARCHAR(150)
);

CREATE INDEX idx_incidents_category ON incidents(category);
CREATE INDEX idx_incidents_severity ON incidents(severity);

# Network Troubleshooting & Documentation Project

A combination of practical network-diagnostic tooling and structured documentation — the kind of reference material and scripts a support/network team actually relies on day to day.

**Stack:** React (Vite) · Node.js / Express · PostgreSQL · Python (diagnostic scripts)

## What's in this repo

1. **Runbooks** (`docs/runbooks/`) — step-by-step troubleshooting guides for the most common network incidents: no internet connectivity, DNS resolution failures, shared/site-wide outages, and VPN connection issues. Each follows the same structure: symptoms → triage steps → resolution → escalation criteria.

2. **Network topology reference** (`docs/network-topology.md`) — a Mermaid diagram of a representative office network plus a table of common failure points per component, so the runbooks make sense in context.

3. **Diagnostic scripts** (`scripts/`) — standalone Python tools used while working through the runbooks above:
   - `ping_sweep.py` — sweep a subnet and report live hosts
   - `dns_check.py` — compare DNS resolution results across multiple resolvers
   - `port_scan.py` — check whether specific TCP ports are open on a host

4. **Incident Log & Runbook Browser app** (`backend/` + `frontend/`) — a small full-stack app for logging real incidents (category, severity, affected users, downtime, root cause, resolution, and which runbook was used) and browsing the runbooks themselves in the browser.

## Diagnostic scripts — quick usage

```bash
cd scripts
pip install dnspython   # only needed for dns_check.py

python ping_sweep.py 192.168.1.0/24
python dns_check.py example.com --resolvers 9.9.9.9
python port_scan.py fileserver.local --ports 445 139 3389
```

## Running the incident log app

### 1. Database

```bash
createdb netdocs_db
psql netdocs_db -f backend/schema.sql
psql netdocs_db -f backend/seed.sql   # optional sample incidents
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev     # http://localhost:4100
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # http://localhost:5173
```

## Project structure

```
network-troubleshooting-documentation/
├── docs/
│   ├── network-topology.md
│   └── runbooks/
│       ├── 01-no-internet-connectivity.md
│       ├── 02-dns-resolution-failure.md
│       ├── 03-shared-outage.md
│       └── 04-vpn-connection-issues.md
├── scripts/
│   ├── ping_sweep.py
│   ├── dns_check.py
│   └── port_scan.py
├── backend/    Express API — incident CRUD + serves runbook content
└── frontend/   React app — incident log dashboard + runbook viewer
```

## Why this project

Most "network troubleshooting" portfolio pieces are either pure documentation or pure code. This one pairs both: the runbooks encode judgment (how to triage, what to check first, when to escalate), the scripts encode the practical commands referenced in those runbooks, and the incident log shows how real occurrences get tracked and fed back into the documentation over time.

## License

MIT

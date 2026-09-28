# Runbook: Shared Outage Affecting Multiple Users

**Category:** Network | **Typical priority:** Urgent | **Typical resolution time:** Varies

## Symptoms
- Multiple users on the same floor, VLAN, or office report connectivity loss simultaneously
- Often reported as a spike of tickets in a short window

## Triage steps

1. **Confirm blast radius.** Ask affected users: same floor? same switch? same building? Check the ticket queue for a spike.

2. **Check shared infrastructure in order:**
   - Core/access switch status (link lights, management interface reachable?)
   - Firewall/edge router status and WAN link
   - Wi-Fi controller/AP status if wireless-only

3. **Check with the ISP** if the WAN link itself appears down (no internet even from the firewall).

4. **Communicate early.** Post a short status update to the affected team/channel — "aware of the outage, investigating" — even before root cause is known. This is as much a part of the runbook as the technical fix.

5. **Once resolved**, confirm with 2–3 previously affected users before closing tickets, not just the first one.

## Post-incident
Log: start time, detection method, root cause, fix applied, total downtime, and number of users affected. Feed this into the incident log for trend analysis (recurring switch, recurring ISP, etc.).

# Runbook: DNS Resolution Failure

**Category:** Network | **Typical priority:** Medium–High | **Typical resolution time:** 5–15 min

## Symptoms
- Can ping IP addresses but not hostnames
- Intermittent "site can't be reached" errors
- Internal resources (e.g. `\\fileserver`) unreachable by name but reachable by IP

## Triage steps

1. **Confirm the symptom.**
   ```
   ping 8.8.8.8            # should succeed
   ping google.com          # fails or times out = DNS issue
   nslookup google.com
   ```

2. **Check which DNS server the client is using.**
   ```
   ipconfig /all | findstr "DNS Servers"     (Windows)
   cat /etc/resolv.conf                       (Linux)
   ```
   Confirm it matches the expected internal DNS server (usually the Domain Controller).

3. **Flush the local DNS cache.**
   ```
   ipconfig /flushdns        (Windows)
   sudo dscacheutil -flushcache   (macOS)
   ```

4. **Test the DNS server directly.**
   ```
   nslookup google.com <dns-server-ip>
   ```
   - If this also fails → the DNS server itself is down or unreachable. Escalate to server team.
   - If this succeeds but the client's default lookup fails → client-side DNS cache or misconfigured adapter settings.

5. **Check for stale or missing DNS records** if only internal resources are affected — coordinate with whoever manages the DNS zone.

## Resolution
Note whether the fix was client-side (flush/reconfigure) or server-side (record fix, service restart) — this distinction matters for tracking recurring DNS incidents.

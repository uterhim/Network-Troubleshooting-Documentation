# Runbook: No Internet Connectivity (Single User)

**Category:** Network | **Typical priority:** High | **Typical resolution time:** 5–20 min

## Symptoms
- User reports "no internet" or "can't load any websites"
- Browser shows `DNS_PROBE_FINISHED_NO_INTERNET` or similar

## Triage steps

1. **Confirm scope.** Ask if other users on the same floor/network are affected.
   - If yes → likely a shared infrastructure issue (switch, AP, firewall, ISP). Escalate to network team, check `03-shared-outage.md`.
   - If just one user → continue below.

2. **Check physical/link layer.**
   - Wired: confirm the Ethernet cable is seated and the NIC link light is on.
   - Wi-Fi: confirm the device is connected to the correct SSID with a strong signal.

3. **Check IP configuration.**
   ```
   ipconfig /all        (Windows)
   ifconfig / ip a       (macOS/Linux)
   ```
   - No IP or `169.254.x.x` (APIPA) → DHCP failure. Run `ipconfig /release` then `ipconfig /renew`.
   - Valid IP but still no connectivity → continue.

4. **Test connectivity at each layer.**
   ```
   ping 127.0.0.1        # local stack
   ping <default gateway>
   ping 8.8.8.8           # internet by IP (bypasses DNS)
   ping google.com        # DNS resolution
   ```
   - Fails at gateway → switch port or cable issue.
   - Gateway OK, IP ping fails → firewall/ISP issue upstream.
   - IP ping OK, DNS ping fails → DNS issue, see `02-dns-resolution-failure.md`.

5. **Check for a VPN or proxy client** that may be routing traffic incorrectly. Disconnect and retest.

## Resolution
Document which step resolved it in the ticket, including exact commands run and their output — this is what turns a one-off fix into a pattern for the knowledge base.

## Escalation
If unresolved after the above, escalate to network team with: affected user, IP config output, ping results at each layer, and whether other users are affected.

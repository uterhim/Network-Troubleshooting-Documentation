# Runbook: VPN Connection Failures

**Category:** Network | **Typical priority:** High | **Typical resolution time:** 10–30 min

## Symptoms
- VPN client fails to connect or authenticate
- Connects but no access to internal resources
- Frequent disconnects

## Triage steps

1. **Check the error code/message** — VPN clients are usually specific (e.g., error 809, 619, certificate errors). Match against vendor documentation first.

2. **Confirm credentials and account status** — locked account or expired password is a common false alarm reported as "VPN is broken."

3. **Check client-side network path.**
   ```
   ping <vpn-gateway-public-ip>
   telnet <vpn-gateway-ip> <vpn-port>
   ```
   Common blockers: user's home/hotel network blocking the VPN port/protocol, local firewall or antivirus interference.

4. **Check gateway-side.**
   - Certificate expiry on the VPN gateway (a frequent, easily-missed cause)
   - Gateway license/connection limits reached
   - Gateway service status

5. **If connects but no internal access** — check split-tunneling configuration and internal routing/firewall rules for the VPN subnet.

## Resolution
Because certificate expiry is a recurring root cause, note the gateway certificate expiry date in the resolution and flag it for renewal tracking if it's within 30 days.

INSERT INTO incidents (title, category, severity, affected_users, reported_at, resolved_at, root_cause, resolution, runbook_used)
VALUES
('Office-wide internet outage', 'Outage', 'critical', 42, now() - interval '10 days', now() - interval '10 days' + interval '55 minutes', 'ISP fiber cut near building', 'Failed over to backup LTE link, confirmed with ISP once fiber was spliced', '03-shared-outage.md'),
('VPN certificate expired', 'VPN', 'high', 15, now() - interval '6 days', now() - interval '6 days' + interval '35 minutes', 'Gateway TLS certificate expired overnight', 'Renewed certificate, restarted VPN service, set calendar reminder 30 days before next expiry', '04-vpn-connection-issues.md'),
('Single user DNS failures', 'DNS', 'low', 1, now() - interval '3 days', now() - interval '3 days' + interval '15 minutes', 'Stale DNS cache after office move to new subnet', 'Flushed local DNS cache and renewed DHCP lease', '02-dns-resolution-failure.md'),
('Intermittent Wi-Fi drops, 2nd floor', 'Wireless', 'medium', 8, now() - interval '1 days', NULL, NULL, NULL, NULL);

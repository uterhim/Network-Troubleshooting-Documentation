#!/usr/bin/env python3
"""
ping_sweep.py — Sweep a /24 subnet and report which hosts respond to ICMP ping.

Usage:
    python ping_sweep.py 192.168.1.0/24
    python ping_sweep.py 192.168.1.1 192.168.1.254

Useful for quickly finding live hosts on a subnet when troubleshooting
connectivity or confirming a device's IP after a DHCP/network change.
"""

import argparse
import ipaddress
import platform
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed


def ping_host(ip: str, timeout_ms: int = 500) -> bool:
    """Return True if the host responds to a single ping."""
    system = platform.system().lower()
    if system == "windows":
        cmd = ["ping", "-n", "1", "-w", str(timeout_ms), str(ip)]
    else:
        cmd = ["ping", "-c", "1", "-W", str(max(1, timeout_ms // 1000)), str(ip)]

    try:
        result = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return result.returncode == 0
    except FileNotFoundError:
        print("Error: 'ping' command not found on this system.", file=sys.stderr)
        sys.exit(1)


def sweep(network: ipaddress.IPv4Network, max_workers: int = 50):
    live_hosts = []
    hosts = list(network.hosts())
    print(f"Sweeping {len(hosts)} addresses in {network}...\n")

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(ping_host, str(ip)): ip for ip in hosts}
        for future in as_completed(futures):
            ip = futures[future]
            if future.result():
                live_hosts.append(str(ip))
                print(f"  [UP]   {ip}")

    return sorted(live_hosts, key=lambda ip: ipaddress.IPv4Address(ip))


def main():
    parser = argparse.ArgumentParser(description="Sweep a subnet for live hosts via ICMP ping.")
    parser.add_argument("target", help="CIDR network to sweep, e.g. 192.168.1.0/24")
    parser.add_argument("--workers", type=int, default=50, help="Number of concurrent pings (default: 50)")
    args = parser.parse_args()

    try:
        network = ipaddress.ip_network(args.target, strict=False)
    except ValueError as e:
        print(f"Invalid network: {e}", file=sys.stderr)
        sys.exit(1)

    live_hosts = sweep(network, max_workers=args.workers)

    print(f"\n{len(live_hosts)} host(s) responded out of {network.num_addresses - 2} usable addresses.")


if __name__ == "__main__":
    main()

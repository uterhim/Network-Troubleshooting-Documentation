#!/usr/bin/env python3
"""
port_scan.py — Check whether specific TCP ports are open on a host.

Usage:
    python port_scan.py 192.168.1.10 --ports 22 80 443 3389
    python port_scan.py fileserver.local --ports 445 139

Useful for quickly confirming whether a required service (RDP, SMB, HTTPS,
a printer's web interface, etc.) is reachable before digging deeper —
a much faster first step than a full troubleshooting session.

Note: for read-only diagnostic use on hosts you own or support. Do not scan
networks or hosts without authorization.
"""

import argparse
import socket
import sys

COMMON_PORTS = {
    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
    80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS",
    445: "SMB", 3389: "RDP", 3306: "MySQL", 5432: "PostgreSQL",
    139: "NetBIOS", 631: "IPP (Printing)",
}


def check_port(host: str, port: int, timeout: float = 1.5) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        try:
            return sock.connect_ex((host, port)) == 0
        except socket.gaierror:
            print(f"Error: could not resolve host '{host}'", file=sys.stderr)
            sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Check whether TCP ports are open on a host.")
    parser.add_argument("host", help="Hostname or IP to check")
    parser.add_argument("--ports", nargs="+", type=int, required=True, help="Ports to check, e.g. 22 80 443")
    parser.add_argument("--timeout", type=float, default=1.5, help="Timeout per port in seconds (default: 1.5)")
    args = parser.parse_args()

    print(f"Checking {len(args.ports)} port(s) on {args.host}:\n")
    for port in args.ports:
        label = COMMON_PORTS.get(port, "")
        label_str = f" ({label})" if label else ""
        is_open = check_port(args.host, port, timeout=args.timeout)
        status = "OPEN" if is_open else "closed/filtered"
        print(f"  {port:>5}{label_str:20s} -> {status}")


if __name__ == "__main__":
    main()

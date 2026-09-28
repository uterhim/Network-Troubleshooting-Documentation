#!/usr/bin/env python3
"""
dns_check.py — Compare DNS resolution results across multiple resolvers for a hostname.

Usage:
    python dns_check.py example.com
    python dns_check.py example.com --resolvers 8.8.8.8 1.1.1.1 10.0.0.1

Useful for diagnosing "works on one network but not another" DNS complaints,
or confirming a DNS record has propagated after a change.

Requires: dnspython  (pip install dnspython)
"""

import argparse
import sys

try:
    import dns.resolver
except ImportError:
    print("This script requires dnspython. Install it with: pip install dnspython", file=sys.stderr)
    sys.exit(1)

DEFAULT_RESOLVERS = {
    "Google": "8.8.8.8",
    "Cloudflare": "1.1.1.1",
}


def query(hostname: str, resolver_ip: str, record_type: str = "A"):
    resolver = dns.resolver.Resolver()
    resolver.nameservers = [resolver_ip]
    resolver.lifetime = 3.0
    try:
        answer = resolver.resolve(hostname, record_type)
        return [str(r) for r in answer]
    except dns.resolver.NXDOMAIN:
        return ["NXDOMAIN (no such domain)"]
    except dns.resolver.NoAnswer:
        return ["No answer for this record type"]
    except Exception as e:
        return [f"Error: {e}"]


def main():
    parser = argparse.ArgumentParser(description="Compare DNS resolution across multiple resolvers.")
    parser.add_argument("hostname", help="Hostname to resolve, e.g. example.com")
    parser.add_argument("--record-type", default="A", help="DNS record type (default: A)")
    parser.add_argument("--resolvers", nargs="*", help="Custom resolver IPs to test in addition to defaults")
    args = parser.parse_args()

    resolvers = dict(DEFAULT_RESOLVERS)
    if args.resolvers:
        for i, ip in enumerate(args.resolvers, start=1):
            resolvers[f"Custom-{i}"] = ip

    print(f"Resolving {args.hostname} ({args.record_type} record) across {len(resolvers)} resolver(s):\n")

    results = {}
    for name, ip in resolvers.items():
        answers = query(args.hostname, ip, args.record_type)
        results[name] = answers
        print(f"  {name:12s} ({ip:15s}) -> {', '.join(answers)}")

    unique_answers = {tuple(sorted(v)) for v in results.values()}
    print()
    if len(unique_answers) > 1:
        print("⚠ Resolvers disagree — possible propagation delay, split-horizon DNS, or misconfiguration.")
    else:
        print("✓ All resolvers agree.")


if __name__ == "__main__":
    main()

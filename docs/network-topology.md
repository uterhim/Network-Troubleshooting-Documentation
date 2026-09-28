# Network Topology Overview

Reference topology for a small/medium office network — the environment the runbooks in this repo assume.

```mermaid
flowchart TD
    ISP[Internet / ISP]
    FW[Firewall / Edge Router]
    CORE[Core Switch]
    AP1[Wi-Fi AP - Floor 1]
    AP2[Wi-Fi AP - Floor 2]
    SRV[Server Room Switch]
    DC[Domain Controller / DNS / DHCP]
    FILE[File Server]
    PRINT[Print Server]
    VPN[VPN Gateway]
    WKS[User Workstations]

    ISP --> FW
    FW --> CORE
    FW --> VPN
    CORE --> AP1
    CORE --> AP2
    CORE --> SRV
    SRV --> DC
    SRV --> FILE
    SRV --> PRINT
    AP1 --> WKS
    AP2 --> WKS
    CORE --> WKS
```

## Key components

| Component | Role | Common failure points |
|---|---|---|
| Firewall / Edge Router | Internet gateway, NAT, VPN termination | WAN link down, cert expiry on VPN, misconfigured ACLs |
| Core Switch | Backbone connectivity between floors and server room | Port failure, VLAN misconfiguration, spanning-tree loops |
| Domain Controller (DNS/DHCP) | Name resolution, IP address leasing, authentication | DHCP scope exhaustion, DNS record staleness, service crash |
| File / Print Server | Shared resources | Disk I/O bottlenecks, permission/ACL issues, driver conflicts |
| Wi-Fi APs | Wireless access per floor | Channel congestion, weak signal, firmware bugs |

This diagram is intentionally simplified — it documents the layer at which most day-to-day help-desk tickets originate (edge, DNS/DHCP, and access layer) rather than a full physical topology.

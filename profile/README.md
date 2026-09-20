<p align="center">
  <img src="../docs/field-banner.svg" alt="Dispersal Wolves" width="100%">
</p>

# Security tools that travel light

Dispersal Wolves builds small defensive utilities for independent systems. Each tool runs locally, keeps a narrow contract, and makes its decisions visible.

## The field kit

| Tool | Purpose |
|---|---|
| **Host Check** | Read-only host security posture reports |
| **Open Ports** | Listening-port inventory and baseline changes |
| **SSH Guard** | OpenSSH policy audits and validated hardening |
| **Honeyfile** | Local canary-file monitoring |
| **File Watch** | SHA-256 file-integrity baselines |
| **Secret Sweep** | Credential scanning for working trees and staged changes |
| **Container Check** | Docker Compose security posture checks |
| **Firewall Kit** | Reviewable nftables and UFW policy profiles |
| **Log Howl** | Local log matching, suppression, and alerts |
| **Safe Share** | Temporary token-protected file sharing |

## Field rules

- Local operation is the default.
- Reports are readable by people and scripts.
- Mutating commands require deliberate confirmation.
- Host data is never collected as telemetry.
- Limitations belong in the documentation, not behind marketing language.

Every repository includes its threat model and private vulnerability-reporting instructions.

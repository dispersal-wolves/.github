<p align="center">
  <img src="../docs/field-banner.svg" alt="Dispersal Wolves — security tools that travel light" width="100%">
</p>

Dispersal Wolves builds small defensive tools for machines in the wild. Every utility runs locally, keeps a narrow contract, and leaves its decisions visible.

## The field kit

| Observe | Guard | Carry |
|---|---|---|
| [**Host Check**](https://github.com/dispersal-wolves/host-check) reads the security posture of one machine. | [**SSH Guard**](https://github.com/dispersal-wolves/ssh-guard) reviews and hardens OpenSSH policy. | [**Safe Share**](https://github.com/dispersal-wolves/safe-share) opens a temporary, limited route to a file. |
| [**Open Ports**](https://github.com/dispersal-wolves/open-ports) records what is listening and what changed. | [**Honeyfile**](https://github.com/dispersal-wolves/honeyfile) watches files that should stay untouched. | [**Firewall Kit**](https://github.com/dispersal-wolves/firewall-kit) renders policies you can read before loading. |
| [**File Watch**](https://github.com/dispersal-wolves/file-watch) keeps SHA-256 integrity baselines. | [**Secret Sweep**](https://github.com/dispersal-wolves/secret-sweep) catches credentials before they travel. | [**Log Howl**](https://github.com/dispersal-wolves/log-howl) turns meaningful log lines into restrained alerts. |
| [**Container Check**](https://github.com/dispersal-wolves/container-check) reviews Compose definitions for host exposure. |  |  |

## Field rules

**Local first.** Host data stays where it was found unless you explicitly configure a destination.

**Safe by default.** Inspection is read-only. Changes require a deliberate command and remain reviewable.

**Small contracts.** Each repository solves one defensive job instead of becoming a security platform.

**Honest limits.** A clean report is evidence, not proof that a machine is uncompromised.

---

Every repository carries its threat model, security policy, automated checks, and machine-readable output where it helps. Visit the website or open any tool to begin from its README.

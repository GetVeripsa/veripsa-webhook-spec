# Check-state contract

Generated from `contract/check-states.json` for contract **v1.0.0**. Human sentence copy may evolve; integrations depend on `check_run.name === "Veripsa"` plus the normalized token.

| Token | Observable title example | Conclusion | Underlying verdict | ACK field | PR comment | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| `Clear` | `Veripsa — Clear` | `success` | `clear` | `forbidden` | `never` | `stable` |
| `Clear to land` | `Veripsa — Clear to land` | `success` | `clear` | `forbidden` | `required` | `stable` |
| `Heads up` | `Veripsa — Heads up` | `neutral` | `heads_up` | `forbidden` | `when_coordination_context_exists` | `stable` |
| `Wait in line` | `Veripsa — Wait in line` | `neutral` | `wait_in_line` | `forbidden` | `when_coordination_context_exists` | `stable` |
| `Unknown` | `Veripsa — Unknown` | `neutral` | `unknown` | `forbidden` | `required` | `stable` |
| `Paused (acknowledge to proceed)` | `Veripsa — Paused (acknowledge to proceed)` | `action_required` | `heads_up` / `wait_in_line` | `false` | `required` | `stable` |
| `Acknowledged` | `Veripsa — Acknowledged` | `neutral` | `heads_up` / `wait_in_line` | `true` | `required` | `stable` |
| `Unresolved merge conflict markers` | `Veripsa — Unresolved merge conflict markers` | `action_required` | `merge_conflict_markers` | `forbidden` | `required` | `stable` |
| `Acknowledgement verification pending` | `Veripsa — acknowledgement verification pending` | `neutral` | — | `forbidden` | `never` | `stable` |
| `Heading to` | `Veripsa — heading to main` | `success` | — | `forbidden` | `never` | `stable` |
| `Watching` | `Veripsa is now watching` | `neutral` | — | `forbidden` | `never` | `stable` |
| `Early-access limit reached` | `Veripsa paused — early-access limit reached` | `neutral` | — | `forbidden` | `never` | `stable` |
| `Changed files not read` | `Veripsa — changed files not read, not analyzed` | `neutral` | — | `forbidden` | `never` | `stable` |
| `Branch state not verified` | `Veripsa — branch state not verified, retrying` | `neutral` | — | `forbidden` | `never` | `stable` |
| `Merge queue: clear` | `Veripsa — merge queue: clear` | `success` | — | `forbidden` | `never` | `stable` |
| `Merge queue: review overlap` | `Veripsa — merge queue: review overlap` | `neutral` | — | `forbidden` | `never` | `stable` |
| `Merge queue: not analyzed` | `Veripsa — merge queue: not analyzed` | `neutral` | — | `forbidden` | `never` | `stable` |

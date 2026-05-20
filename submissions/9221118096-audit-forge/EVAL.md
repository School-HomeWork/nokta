# 🧪 EVAL.md — Golden Scenarios (ratchet)

A monotonically growing evaluation set. Every **successful** forge cycle adds a
golden scenario here. The ratchet rule: a future cycle may not break an existing
golden scenario — if it does, that is a major incident and the cycle is rolled
back. This is the Track C autonomy proof: the agent's own regression net grows
with each repair, so quality only moves forward.

> Manual check today (no e2e runner wired): each scenario is verified by reading
> the touched screen + `tsc`/unit gate. The list is written so it could be
> promoted to Detox/Maestro specs later without rewording.

---

### G1 — Onboarding CTA respects screen margins
*Added by cycle 1.*
- **Given** the Onboarding screen on any phone width,
- **Then** the "Get Started" button is inset from both screen edges (not flush),
- **And** `tsc --noEmit` + `src/lib` unit tests pass.
- **Guards against:** regressing `footer` padding or the CTA stretch behaviour.

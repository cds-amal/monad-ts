# Token Transfer App: DX Research

A React TypeScript app for figuring out whether monadic/functional patterns or imperative patterns work better when building on top of a design system.

## What's This About?

We built the same token transfer UI two ways: one using the MetaMask Design System directly (imperative), and one wrapping it in adapters with dependency injection (functional/monadic). Then we kept adding features to see which approach held up better.

**The short version:** The functional approach needed 2.6x more code upfront, but it was the only one that could ship iOS support without starting over. It also made feature flags, runtime UI configuration, and design system compliance trivial to add, while the imperative approach would've required retrofitting infrastructure first. By feature 4, the imperative branch stopped shipping; by feature 7, the functional branch was compounding.

---

## Research Tracks

### Track 1: Inline Styles (Original)

The first experiment compared inline styles vs adapter patterns (no design system).

| Branch | Approach |
|--------|----------|
| `imperative_01` → `imperative_03` | Direct DOM + inline styles |
| `monad_01` → `monad_03` | Adapter-based architecture |

**Research doc:** [`dx-research.md`](./dx-research.md)

### Track 2: MetaMask Design System

The more interesting experiment: what happens when you're building *on top of* a design system?

| Branch | What's In It |
|--------|--------------|
| `metamask-baseline` | Shared foundation with MDS packages |
| `mm-imperative_01` | Direct MDS usage, inline platform logic |
| `mm-monad_01` | MDS wrapped in adapters, iOS working |
| `mm-monad_02` | Code review mitigations for 100+ person teams |
| `mm-monad_03` | Feature flags, environment context, platform-specific UI |
| `mm-monad_04` | Runtime UI config system, adapter bypass case study |
| `mm-monad_05` | Adapter gap closure, design system compliance (Task G) |

**Findings:** [`mm-dx-findings.md`](./mm-dx-findings.md) (the takeaway; ~270 lines)
**Evidence journal:** [`mm-dx-research.md`](./mm-dx-research.md) (per-task details; ~950 lines)

---

## Quick Start

```bash
pnpm install
pnpm run dev
```

For iOS (on mm-monad branches):
```bash
pnpm run native:ios
```

---

## What We Built and Learned

### The Tasks

| Task | What We Did | What We Learned |
|------|-------------|-----------------|
| **A: Input Component** | Built a reusable Input (MDS doesn't have one) | Functional: composable `ValidationResult.chain()`. Imperative: inline `getError()` functions that get copy-pasted everywhere. |
| **B: AddressSelect Refactor** | Simplified a 133-line component | Functional: 65 LOC + generic `Dropdown` primitive. Imperative: 108 LOC, no reusable parts. |
| **C: Dark Mode** | Theme switching with MDS tokens | Functional: `ThemeOps` module (pure, testable). Imperative: simple hook (concise but coupled to React lifecycle). |
| **D: Cross-Platform (iOS)** | Get the app running on iOS simulator | Functional: working iOS app via `.native.tsx` files. Imperative: we documented what it would take and didn't do it. |
| **E: Feature Flags** | Runtime feature toggles with platform-specific UI | Functional: 35-line context, type-safe, testable. Imperative: would need to retrofit localStorage or a library. |
| **F: UI Config System** | Long-press dialog for runtime component configuration | Good architecture + bad usage = bad outcome. Initial impl bypassed the adapter layer, silently regressing to web-only. Fix required platform-specific files for dialog, gestures, and persistence. |
| **G: Close Adapter Gaps** | Eliminate style escape hatches, expand adapter surface | 3 files of adapter logic, 12 files of mechanical substitutions. Design directives propagate structurally, not socially. |

### The Numbers

| Metric | Functional (mm-monad_05) | Imperative (mm-imperative_01) |
|--------|--------------------------|-------------------------------|
| Total new code | ~2,171 LOC (Tasks A-G) | ~327 LOC (Tasks A-C) |
| Features shipped | 7 | 3 (stalled at Task D) |
| Reusable primitives | 10 | 1 (AccountBadge) |
| Platforms supported | 2 (Web, iOS) | 1 (Web) |
| Files with platform conditionals | 0 | N/A |
| Files changed for design directive (Task G) | 15 (3 logic, 12 mechanical) | N/A (no centralized layer) |

### Cost Per Feature (Functional)

| Task | New Lines | Shared | Web-Only | Native-Only |
|------|-----------|--------|----------|-------------|
| A: Input | 147 | 147 | 0 | 0 |
| B: Refactor | 65 | 65 | 0 | 0 |
| C: Dark Mode | 85 | 85 | 0 | 0 |
| D: iOS | 567 | 45 | 287 | 235 |
| E: Flags | 318 | 70 | 108 | 175 |
| F: Config | 849 | 215 | 351 | 283 |
| G: DS Gaps | 140 | 55 | 60 | 45 |

### The Velocity Crossover (Measured in Commits)

```
                Task A    Task B    Task C    Task D    Task E    Task F    Task G
Functional:     Input     Dropdown  DarkMode  iOS ✅    Flags ✅   Config ✅  DS Gaps ✅
Imperative:     Input     Refactor  DarkMode  iOS ❌    —         —         —
```

The crossover happens at feature 4. Both branches deliver Tasks A through C (imperative faster). At Task D (cross-platform), imperative produces a document; functional produces a working iOS app. Tasks E, F, and G don't exist on the imperative branch at all. After the crossover, functional compounds while imperative accumulates debt.

See the [findings doc](./mm-dx-findings.md) for the distilled analysis, or the [evidence journal](./mm-dx-research.md) for per-task details.

---

## Branch Guide

### For Reviewers

1. **Start here** (master): Overview and context
2. **MetaMask baseline** → `git checkout metamask-baseline`
3. **Compare the approaches:**
   - `git checkout mm-imperative_01`: Direct MDS usage (stalls at Task D)
   - `git checkout mm-monad_01`: Adapter pattern, iOS support
   - `git checkout mm-monad_02`: Team scale mitigations
   - `git checkout mm-monad_03`: Feature flags, environment context
   - `git checkout mm-monad_04`: UI config system, adapter bypass case study
   - `git checkout mm-monad_05`: Adapter gap closure, design system compliance

### Branch Lineage

```
master
├── imperative_01 → imperative_02 → imperative_03  (inline styles track)
├── monad_01 → monad_02 → monad_03                 (adapter track)
│
└── metamask-baseline                               (MDS foundation)
    ├── mm-imperative_01                            (direct MDS, Tasks A-C)
    └── mm-monad_01 → ... → mm-monad_04 → mm-monad_05 (Tasks A-G)
```

---

## When To Use Which Approach

### Functional/Adapter makes sense when:

- Cross-platform support exists or is anticipated
- Team size exceeds 10 engineers
- You need feature flags or A/B testing
- Long-term maintainability matters
- You want tests that don't require `jest.mock()` everywhere
- Design system team ships directives that need structural propagation
- AI-assisted development (a well-typed adapter layer constrains AI output to compliant patterns)

### Imperative/Direct makes sense when:

- Single-platform, web-only application
- Rapid prototyping or MVP phase
- Small team (1-5 engineers)
- Short project lifespan
- Time-to-first-feature is the only thing that matters

---

## Project Structure

```
src/
├── components/        # UI components
├── services/          # Mock Web3 and accounts
├── hooks/             # React hooks
├── types/             # TypeScript interfaces
│
│ # These exist on monad branches:
├── adapters/          # Platform adapters (web.tsx, native.tsx)
├── config/            # Runtime UI configuration (mm-monad_04+)
├── environment/       # Cross-platform environment detection
├── features/          # Feature flag system
├── validation/        # Composable validation (ValidationResult monad)
├── theme/             # Theme operations
└── styles/            # Style utilities
```

---

## Mock Accounts

Test addresses for validation scenarios:

| Type | What It's For |
|------|---------------|
| EOA | Valid wallet addresses |
| Contract | Token contracts, DEX routers |
| Invalid | Bad checksum, wrong length |
| Blacklisted | Flagged addresses (shows the feature flag UI) |
| Sanctioned | OFAC sanctioned addresses |

---

## The Research

The research is split into two companion documents:

**[mm-dx-findings.md](./mm-dx-findings.md)** (~270 lines): the argument. Organized around insights, not chronology. Covers the thesis, the numbers, the velocity crossover, six key insights, and recommendations. Reads in about 10 minutes.

**[mm-dx-research.md](./mm-dx-research.md)** (~950 lines): the evidence journal. Per-task implementation details, code samples, architecture deep-dives, and raw data tables. Cross-referenced from the findings doc for readers who want the proof.

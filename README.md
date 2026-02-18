# Token Transfer App: DX Research

A React TypeScript app for figuring out whether monadic/functional patterns or imperative patterns work better when building on top of a design system.

## What's This About?

We built the same token transfer UI two ways: one using the MetaMask Design System directly (imperative), and one wrapping it in adapters with dependency injection (functional/monadic). Then we kept adding features to see which approach held up better.

**The short version:** The functional approach needed 2.6x more code upfront, but it was the only one that could ship iOS support without starting over. It also made feature flags and runtime UI configuration trivial to add, while the imperative approach would've required retrofitting infrastructure first. By feature 4, the imperative branch stopped shipping; by feature 6, the functional branch was compounding.

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

**Research doc:** `mm-dx-research.md` (on the mm-monad branches)

---

## Quick Start

```bash
npm install
npm run dev
```

For iOS (on mm-monad branches):
```bash
cd ios && pod install && cd ..
npm run ios
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

### The Numbers

| Metric | Functional (mm-monad_04) | Imperative (mm-imperative_01) |
|--------|--------------------------|-------------------------------|
| Total new code | ~1,713 LOC (Tasks A-F) | ~327 LOC (Tasks A-C) |
| Features shipped | 6 | 3 (stalled at Task D) |
| Reusable primitives | 10 | 1 (AccountBadge) |
| Platforms supported | 2 (Web, iOS) | 1 (Web) |
| Files with platform conditionals | 0 | N/A |

### Cost Per Feature (Functional)

| Task | New Lines | Shared | Web-Only | Native-Only |
|------|-----------|--------|----------|-------------|
| A: Input | 147 | 147 | 0 | 0 |
| B: Refactor | 65 | 65 | 0 | 0 |
| C: Dark Mode | 85 | 85 | 0 | 0 |
| D: iOS | 567 | 45 | 287 | 235 |
| E: Flags | 318 | 70 | 108 | 175 |
| F: Config | 849 | 215 | 351 | 283 |

### The Velocity Crossover (Measured in Commits)

```
                Task A    Task B    Task C    Task D    Task E    Task F
Functional:     Input     Dropdown  DarkMode  iOS ✅    Flags ✅   Config ✅
Imperative:     Input     Refactor  DarkMode  iOS ❌    —         —
```

The crossover happens at feature 4. Both branches deliver Tasks A through C (imperative faster). At Task D (cross-platform), imperative produces a document; functional produces a working iOS app. Tasks E and F don't exist on the imperative branch at all. After the crossover, functional compounds while imperative accumulates debt.

See the [full research doc](./mm-dx-research.md) for the cumulative features chart and detailed cost analysis.

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

### Branch Lineage

```
master
├── imperative_01 → imperative_02 → imperative_03  (inline styles track)
├── monad_01 → monad_02 → monad_03                 (adapter track)
│
└── metamask-baseline                               (MDS foundation)
    ├── mm-imperative_01                            (direct MDS, Tasks A-C)
    └── mm-monad_01 → mm-monad_02 → mm-monad_03 → mm-monad_04 (Tasks A-F)
```

---

## When To Use Which Approach

### Functional/Adapter makes sense when:

- Cross-platform support exists or is anticipated
- Team size exceeds 10 engineers
- You need feature flags or A/B testing
- Long-term maintainability matters
- You want tests that don't require `jest.mock()` everywhere

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
├── config/            # Runtime UI configuration (mm-monad_04)
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

## The Research Doc

The full analysis is in [mm-dx-research.md](./mm-dx-research.md) (on monad branches and master). It covers:

- Cumulative features shipped chart (the divergence at feature 4)
- Per-task cost breakdown by platform (shared/web/native)
- Detailed code samples showing overhead vs payoff
- Test philosophy alignment (fast, predictive, low-cost, velocity-enabling)
- Task F case study: what happens when you bypass the adapter layer
- Metro cache gotcha with `.native.tsx` file resolution
- Why enterprises often regret choosing imperative for "faster time-to-market"

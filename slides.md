---
transition: slideUp
style:
  border: rounded
  border_color: "#9999CC"
layout: center
theme: dracula
---

## Bridging Design-Engineering Friction in the Age of AI

A composable adapter experiment with the MetaMask Design System

----

# The Friction

Design and engineering teams move at different velocities. AI amplifies the gap.

| What Happens | The Impact |
|---|---|
| AI generates 10 new components | 10 components with inline styles, arbitrary colors |
| Design team updates brand colors | Manual audit of all AI-generated code |
| Add dark mode | Rewrite every AI-generated component |
| New developer uses AI assistance | Generates code that passes review but violates patterns |
| After 6 months | Mix of design system + inline styles, inconsistent |

Design reviews become the bottleneck. Design teams can't scale code review.
The "right thing" is socially enforced (PR comments) instead of structurally enforced.

----

# What AI Generates vs What Design Wants

**What AI currently generates:**

```tsx
function WalletButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        border: 'none',
      }}
    >
      Connect Wallet
    </button>
  )
}
```

**What we actually want:**

```tsx
import { Button, ButtonVariant, ButtonBaseSize }
  from '@metamask/design-system-react'

function WalletButton({ onClick, isLoading }: Props) {
  return (
    <Button
      variant={ButtonVariant.Primary}
      size={ButtonBaseSize.Md}
      onClick={onClick}
      isLoading={isLoading}
      loadingText="Connecting"
    >
      Connect Wallet
    </Button>
  )
}
```

Native `<button>`, inline styles, hardcoded `#3b82f6`, no a11y, no loading/disabled, doesn't theme.

----

# The Hypothesis

> A composable adapter layer makes design system compliance **structural**, not social.

Instead of: "please use the design system" (code review comment, applied inconsistently)

We get: the type system enforces it; the adapter maps intent to platform-correct implementation.

```
┌─────────────┐
│  Component  │  ← Knows nothing about platform
├─────────────┤
│   Adapter   │  ← Maps semantic props → platform primitives
├─────────────┤
│  Platform   │  ← Web (MDS), iOS (React Native), etc.
└─────────────┘
```

Express **intent**, not **implementation**.

----

# Study Design

**7 tasks, 2 approaches, same MetaMask Design System.**

Two research tracks ran in parallel:

| | Functional (mm-monad) | Imperative (mm-imperative) |
|---|---|---|
| Architecture | Adapter layer + contexts + pure functions | Direct component code |
| Tasks completed | A through G (all 7) | A through C (stalled at D) |
| Branches | mm-monad_01 through mm-monad_05 | mm-imperative_01 |

Same design system. Same requirements. Same AI tooling. Different architecture.

----

# The Tasks at a Glance

| Task | What We Did | Functional | Imperative |
|---|---|---|---|
| **A**: Input | Reusable validated input | `ValidationResult.chain()` | Inline `getError()` |
| **B**: Refactor | Simplify 133-line component | 65 LOC + generic Dropdown | 108 LOC, no reuse |
| **C**: Dark Mode | Theme switching with tokens | Pure `ThemeOps` module | Simple hook (coupled) |
| **D**: iOS | Cross-platform | Working iOS app | A document explaining why not |
| **E**: Flags | Runtime feature toggles | 35-line typed context | Would need retrofit |
| **F**: Config | Runtime UI configuration | 849 LOC (adapter bypass story) | N/A |
| **G**: DS Gaps | Close escape hatches | 3 logic files, 12 mechanical | N/A |

----

# The Numbers

| Metric | Functional (mm-monad_05) | Imperative (mm-imperative_01) |
|---|---|---|
| Total new code | ~2,171 LOC (Tasks A-G) | ~327 LOC (Tasks A-C) |
| Features shipped | **7** | **3** (stalled at Task D) |
| Reusable primitives | **10** | **1** (AccountBadge) |
| Platforms supported | **2** (Web, iOS) | **1** (Web) |
| Files with platform conditionals | **0** | N/A |

**Cost per feature (functional):**

| Task | New Lines | Shared | Web-Only | Native-Only |
|---|---|---|---|---|
| A: Input | 147 | 147 | 0 | 0 |
| B: Refactor | 65 | 65 | 0 | 0 |
| C: Dark Mode | 85 | 85 | 0 | 0 |
| D: iOS | 567 | 45 | 287 | 235 |
| E: Flags | 318 | 70 | 108 | 175 |
| F: Config | 849 | 215 | 351 | 283 |
| G: DS Gaps | 140 | 55 | 60 | 45 |

----

# The Velocity Crossover

```
Features ▲
Shipped  │
         │                                            ● G: DS Gaps
    7    │                                        ╱
         │                                ● F: Config
    6    │                            ╱
         │                    ● E: Flags
    5    │                ╱
         │        ● D: iOS ✅
    4    │    ╱
         │   ╱
    3    │──●── C: Dark Mode ─────●─────────────────── Imperative
         │ ╱                      ↑ flatline (not a cliff)
    2    ●─ B: Refactor ──────────●
         │
    1    ● A: Input ──────────────●
         │
         └────────────────────────────────────────────►
              Task A    B    C    D    E    F    G
```

**Crossover at feature 4.** After that: functional compounds, imperative flatlines.

Not a cliff (nothing broke). A flatline (the approach ran out of runway).

----

# Cross-Platform Comes Free, or Requires a Rewrite

**Task D:** Get the app running on iOS.

The functional branch delivered a **working iOS app**.
The imperative branch delivered a **document explaining why it couldn't**.

```
src/adapters/
  types.ts              ← UIAdapter interface (shared)
  web.tsx               ← MDS wrapper
  native.tsx            ← React Native implementation
  AdapterContext.tsx     ← Web context
  AdapterContext.native.tsx  ← Native context
```

Components call `usePrimitives()` and don't know which platform they're on.
The bundler picks the right adapter file. The entire cross-platform cost
is in the adapter layer; everything above it is shared.

The imperative audit found: **150+ DOM elements** needing replacement,
**40+ CSS instances** incompatible, **20+ events** needing translation.
Every component file requires modification.

----

# Architecture Only Works If You Use It

**Task F:** the most interesting finding.

The initial implementation **bypassed the adapter layer**. Used raw HTML
(`<div>`, `<input type="range">`, `<button>`) instead of `usePrimitives()`.
Web worked great. Native crashed immediately.

**The three bypass points:**

| What Was Needed | Why the Adapter Couldn't Help |
|---|---|
| Modal/overlay | Adapter had no `Modal` primitive |
| Range/color inputs | `TextInput` only covers text/number/password |
| Persistence | `localStorage` is synchronous and web-only |

**The structural lesson:** when the adapter's primitive set doesn't cover
what you need, the path of least resistance is to drop down to the platform
directly. That's not a discipline problem; it's an architecture problem.

The fix: platform-specific files for dialog, gestures, and persistence.
Expand the adapter, don't bypass it.

----

# Adapter Surface = Guideline Enforceability

**Task G:** Close the escape hatches.

Before Task G, `BoxProps` didn't have `position`, `flex`, `overflow`, or
`opacity`. An AI following the guidelines perfectly would *still* produce
`style={{ position: 'relative' }}` because the adapter didn't offer an alternative.

**The effort split:**

- **3 files** needed new logic (`types.ts`, `web.tsx`, `native.tsx`): ~140 lines
- **12 files** needed only mechanical substitutions: zero behavioral changes

```
// Before                                    // After
<Box style={{ position: 'relative' }}>       <Box position="relative">
<Box style={{ flex: 1 }}>                    <Box flex={1}>
<Text style={{ textAlign: 'center' }}>       <Text textAlign="center">
```

That **20/80 ratio** (logic vs mechanical) is the adapter architecture
doing exactly what it's designed to do.

Before Task G: **~60%** of layout needed escape hatches.
After: **~95%** expressible via adapter props.

----

# Design Directives Propagate Structurally, Not Socially

In an imperative codebase, "stop using inline styles for layout" becomes:

- A code review comment, applied inconsistently
- A lint rule that can't auto-fix
- A refactoring sprint that competes with feature work

In a functional codebase, the same directive becomes:

- Expand the adapter types (3 files of logic)
- Consumers update mechanically (12 files, find-and-replace)
- Zero behavioral changes, zero risk

The social version has a half-life measured in sprints.
The structural version is permanent.

| Propagation | Social (Imperative) | Structural (Functional) |
|---|---|---|
| Mechanism | Code review comments | Type system expansion |
| Coverage | Inconsistent | Complete |
| Durability | Drifts over sprints | Permanent |
| AI compliance | Can't enforce | Constrained by adapter surface |

----

# The Documentation Stack

Three layers that work together to constrain AI output:

```
┌──────────────────────────────────────┐
│  PROBLEM_STATEMENT.md                │  ← Identifies the problem
│  "AI generates <div style={{...}}>"  │     (what we're solving for)
├──────────────────────────────────────┤
│  DESIGN_GUIDELINES/COMPONENTS.md     │  ← Documents the raw DS
│  "Use ButtonVariant.Primary"         │     (what components exist)
├──────────────────────────────────────┤
│  agents.md                           │  ← Documents the adapter layer
│  "Use usePrimitives(), not <div>"    │     (how this codebase wraps MDS)
└──────────────────────────────────────┘
```

Task G validated **all three are necessary**:

| Goal | Before Task G | After Task G |
|---|---|---|
| AI uses design system | Partial: 60% escape hatches | ~95% via adapter props |
| Token updates propagate | Colors/spacing only | Layout, positioning, borders too |
| Zero drift at 6 months | Unlikely: hatches accumulate | Remaining 7 cases documented |
| New dev + AI = compliant | Unenforceable for layout | Guidelines match adapter surface |

----

# Testing Scorecard

| Property | Functional | Imperative | Winner At Scale |
|---|---|---|---|
| **Fast** | Pure functions, isolated tests | Degrades with coupling | Functional |
| **Predictive** | Adapter = single source of truth | Scattered patterns | Functional |
| **Low Cost** | High initial, amortized | Low initial, high marginal | Functional (>4 features) |
| **Velocity-Enabling** | Guardrails enable speed | No guardrails, review bottleneck | Functional |

**The trap:** enterprises optimize for low initial cost, which doesn't matter
at enterprise timescales.

- Features 1-3: imperative ships faster
- Feature 4: imperative hits a wall (and produces a document)
- Features 5-7: don't exist on the imperative branch

155 lines of infrastructure (contexts + adapters) enables capabilities that
would require 500+ lines of scattered conditionals and an architectural
rewrite in the imperative approach.

----

# When to Use Which

**Functional (adapter layer) makes sense when:**

- Cross-platform exists or is anticipated
- Team > 10 engineers
- Feature flags and runtime configuration needed
- Long-term maintainability matters
- Design system team ships directives
- AI-assisted development (adapter constrains AI output)

**Imperative (direct) makes sense when:**

- Web-only, staying web-only
- MVP / prototype phase
- Team < 5 engineers
- Short lifespan project
- Time-to-first-feature is the only metric that matters

The question isn't "which is better."
It's "which cost structure matches your timeline."

----

# The Bottom Line

| Capability | Functional | Imperative |
|---|---|---|
| Add new platform | Add adapter file | Rewrite architecture |
| Add feature flag | Add to interface | Retrofit flag system |
| Swap service impl | Change provider | Hunt direct imports |
| Test component | Mock contexts | Mock modules |
| Absorb design directive | Expand adapter types (3 files) | Code review comments (drift) |

**Five conditions that favor the functional approach:**

1. You need (or will need) more than one platform
2. Your design system team ships directives faster than your eng team absorbs them
3. You're using AI tools to generate UI code
4. You have more than 4 features on the roadmap
5. You care about what the codebase looks like in 6 months, not just today

----

# Thank You

**fp-research**: 7 tasks, 2 approaches, 1 design system

Functional paid 2.6x upfront. It was the only approach that shipped iOS
without starting over.

Imperative didn't crash. It flatlined. Arguably worse.

**Q&A**

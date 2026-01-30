# DX Research: Imperative vs Monadic Approaches

This document tracks developer experience findings comparing imperative (inline styles + direct DOM) and monadic (adapter-based) architectures.

---

## Task 3: Cross-Platform Support (React Native)

**Objective**: Evaluate DX for adding React Native mobile support to both approaches.

### Methodology

| Approach | Deliverable | Branch |
|----------|-------------|--------|
| Imperative | Documentation only | `imperative_03` |
| Monadic | Working implementation | `monad_03` |

The velocity difference between "documenting what's needed" vs "implementing it" is itself a DX metric.

---

### Results Summary

| Metric | imperative_03 | monad_03 |
|--------|---------------|----------|
| **Deliverable** | Documentation | Working code |
| **New files** | 1 (CROSS_PLATFORM.md) | 11 (adapters + entry) |
| **Lines added** | 251 | 581 |
| **Component changes** | N/A (would be 7+) | 0 |
| **Architecture impact** | Requires new abstraction layer | Uses existing adapter pattern |
| **Time to "working"** | Cannot achieve without primitives | Adapter swap |

---

### Key Findings

#### 1. The Abstraction Tax is Unavoidable

The imperative approach avoided abstraction for initial simplicity. Cross-platform support imposes an unavoidable **abstraction tax**:

- Must create primitive components (Box, Text, Pressable)
- Must create style normalization layer
- Must add platform detection
- Must modify every component file

**The imperative approach must become monadic to support cross-platform.**

#### 2. Documentation vs Implementation Effort

| Task | Imperative | Monadic |
|------|------------|---------|
| Audit incompatibilities | Required | Not needed |
| Design abstraction layer | Required | Already exists |
| Create primitives | Required (~300 lines) | Already exists (adapters) |
| Modify components | Required (~500 lines) | 0 changes |
| Create native entry | Required | Required |
| **Total new code** | ~800 lines | ~350 lines |

The monadic approach required ~350 lines to add React Native support. The imperative approach would require ~800 lines **plus** touches every existing component.

#### 3. Architectural Convergence

Both approaches end up with similar architecture for cross-platform:

| Concept | Imperative (post-migration) | Monadic |
|---------|----------------------------|---------|
| Element abstraction | Primitives (Box, Text) | Render adapters |
| Style abstraction | Style normalizers | Style adapters |
| Platform detection | Platform.select | AdapterContext |
| Component code | Uses primitives | Uses adapters |

The difference is timing: monadic paid the abstraction cost upfront; imperative defers it until cross-platform is needed.

#### 4. The "Can't Stay Imperative" Proof

The `CROSS_PLATFORM.md` document in `imperative_03` proves that:

1. **150+ DOM elements** need replacement with primitives
2. **11 CSS property types** are incompatible (~40+ instances)
3. **6 event types** need translation (~20+ instances)
4. **Every component file** requires modification

This level of change transforms the codebase architecture from "direct control" to "abstracted control" - which is the monadic approach.

---

### Incompatibility Categories

#### DOM Elements
`div`, `span`, `button`, `input`, `form`, `header`, `h1`, `label` → All require platform-specific wrappers

#### CSS Properties
| Property | Issue |
|----------|-------|
| `cursor` | No cursor on mobile |
| `transition` | Requires Animated API |
| `boxShadow` | Platform-specific shadow props |
| `outline` | Not supported |
| `textTransform` | Manual transformation |
| `wordBreak` | Not supported |
| `overflowY: 'auto'` | Requires ScrollView |

#### Events
| Web Event | RN Equivalent |
|-----------|---------------|
| `onClick` (div) | `Pressable.onPress` |
| `onMouseEnter/Leave` | `Pressable` state callbacks |
| `onSubmit` | Manual handler |
| `onChange` | `onChangeText` |

---

### Conclusions

1. **Cross-platform support favors the monadic approach** because the adapter pattern naturally extends to new platforms.

2. **The imperative approach's simplicity is platform-specific simplicity.** It trades early abstraction for later migration cost.

3. **The "right" choice depends on requirements:**
   - Web-only app: Imperative is simpler
   - Cross-platform app: Monadic from the start
   - "Maybe cross-platform later": Consider the migration cost

4. **The adapter pattern's value increases with platform count.** Each new platform is just a new adapter implementation, not a codebase-wide migration.

---

### Files Created

#### imperative_03
- `CROSS_PLATFORM.md` - Detailed incompatibility audit and migration estimate

#### monad_03
- `src/adapters/types.ts` - Platform-agnostic component interfaces
- `src/adapters/web/render.tsx` - Web primitives (div → Box, etc.)
- `src/adapters/web/style.ts` - Web style passthrough
- `src/adapters/web/index.ts` - Web adapter export
- `src/adapters/native/render.tsx` - RN primitives (View, Pressable, etc.)
- `src/adapters/native/style.ts` - RN style normalization
- `src/adapters/native/index.ts` - Native adapter export
- `src/adapters/index.ts` - Adapter re-exports
- `src/context/AdapterContext.tsx` - Adapter provider and hooks
- `src/main.native.tsx` - React Native entry point
- `app.json` - Expo configuration

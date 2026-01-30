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
| **Deliverable** | Documentation | Working mobile app |
| **New files** | 1 (CROSS_PLATFORM.md) | 11 (adapters + entry) |
| **Lines added** | 251 | ~600 |
| **Component changes** | N/A (would be 7+) | 7 (migrated to primitives) |
| **Architecture impact** | Requires new abstraction layer | Uses adapter pattern |
| **Time to "working"** | Cannot achieve without primitives | Tested on iOS simulator |

---

### Key Findings

#### 1. The Abstraction Tax is Unavoidable

The imperative approach avoided abstraction for initial simplicity. Cross-platform support imposes an unavoidable **abstraction tax**:

- Must create primitive components (Box, Text, Pressable)
- Must create style normalization layer
- Must add platform detection
- Must modify every component file

**The imperative approach must become monadic to support cross-platform.**

#### 2. Platform-Specific Style Overrides

The adapter pattern enables clean platform-specific styling via `select()`:

```tsx
const { normalize, select } = useStyle()

const headerStyle = normalize({
  flexDirection: 'row',
  justifyContent: 'space-between',
  ...select({ native: { flexWrap: 'wrap' } }),  // mobile-only
})
```

This keeps platform logic in the style layer, not scattered through components.

#### 3. Style Normalization

The web adapter automatically converts RN-style shortcuts to CSS:

| RN Style | Web CSS |
|----------|---------|
| `paddingVertical: 12` | `paddingTop: 12, paddingBottom: 12` |
| `paddingHorizontal: 16` | `paddingLeft: 16, paddingRight: 16` |
| `marginVertical: 24` | `marginTop: 24, marginBottom: 24` |

Components write styles once using RN conventions; adapters handle translation.

#### 4. Architectural Convergence

Both approaches end up with similar architecture for cross-platform:

| Concept | Imperative (post-migration) | Monadic |
|---------|----------------------------|---------|
| Element abstraction | Primitives (Box, Text) | Render adapters |
| Style abstraction | Style normalizers | Style adapters |
| Platform detection | Platform.select | `select()` method |
| Component code | Uses primitives | Uses adapters |

The difference is timing: monadic paid the abstraction cost upfront; imperative defers it until cross-platform is needed.

#### 5. The "Can't Stay Imperative" Proof

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

5. **Platform-specific overrides are clean.** The `select({ native: {...} })` pattern keeps platform logic localized without conditional rendering in components.

---

### Files Created

#### imperative_03
- `CROSS_PLATFORM.md` - Detailed incompatibility audit and migration estimate

#### monad_03
- `src/adapters/types.ts` - Platform-agnostic component interfaces + `select()` type
- `src/adapters/web/render.tsx` - Web primitives (div → Box, etc.)
- `src/adapters/web/style.ts` - Web style normalization + `select()`
- `src/adapters/web/index.ts` - Web adapter export
- `src/adapters/native/render.tsx` - RN primitives (View, Pressable, etc.)
- `src/adapters/native/style.ts` - RN style normalization + `select()`
- `src/adapters/native/index.ts` - Native adapter export
- `src/adapters/index.ts` - Adapter re-exports
- `src/context/AdapterContext.tsx` - Adapter provider and hooks
- `src/main.native.tsx` - React Native entry point
- `app.json` - Expo configuration

#### Component Migrations (monad_03)
All components updated to use adapter primitives:
- `App.tsx` - Box, Text + platform-specific header layout
- `WalletButton.tsx` - Box, Text, Pressable
- `TokenList.tsx` - Box, Text, Pressable
- `TransferForm.tsx` - Box, Text, Pressable, TextInput
- `TransferStatus.tsx` - Box, Text, Pressable
- `ThemeToggle.tsx` - Text, Pressable
- `AddressSelect.tsx` - Box, Text, Pressable, ScrollBox

# Token Transfer App - DX Research

React TypeScript app for evaluating monadic vs imperative design system patterns.

## Research Overview

This repository contains two parallel research tracks comparing developer experience (DX):

### Track 1: Inline Styles (Original)
Compares imperative inline styles vs monadic adapter patterns.

| Branch | Approach |
|--------|----------|
| `imperative_01` - `imperative_03` | Direct DOM + inline styles |
| `monad_01` - `monad_03` | Adapter-based architecture |

**Research doc:** [`dx-research.md`](./dx-research.md)

### Track 2: MetaMask Design System
Compares approaches **on top of** the MetaMask Design System baseline.

| Branch | Approach |
|--------|----------|
| `metamask-baseline` | Shared foundation with MDS |
| `mm-imperative_01` | Direct MDS usage |
| `mm-monad_01` | MDS wrapped in adapters |

**Research doc:** See `mm-dx-research.md` on feature branches

---

## Quick Start

```bash
npm install
npm run dev
```

## Research Tasks Completed

### MetaMask DS Track (mm-* branches)

| Task | Description | Finding |
|------|-------------|---------|
| **A: Input Component** | Build reusable Input (MDS lacks one) | Monad: composable validators. Imperative: inline validation. |
| **B: AddressSelect Refactor** | Simplify 133-line component | Monad: 65 LOC + Dropdown primitive. Imperative: 108 LOC. |
| **C: Dark Mode** | Use MDS light/dark tokens | Monad: ThemeOps module. Imperative: simple hook. |
| **D: Cross-Platform** | React Native support | Monad: working adapter. Imperative: docs only. |

### Key Metrics

| Metric | mm-monad_01 | mm-imperative_01 |
|--------|-------------|------------------|
| Total new code | ~621 LOC | ~327 LOC |
| Reusable primitives | 5 (Dropdown, Validators, ThemeOps, groupBy, adapters) | 1 (AccountBadge) |
| Cross-platform ready | Yes | No (would need rewrite) |

---

## Branch Guide

### For Reviewers

1. **Start here** (master) - Overview and links
2. **MetaMask baseline** → `git checkout metamask-baseline`
3. **Compare approaches:**
   - `git checkout mm-imperative_01` - Direct MDS usage
   - `git checkout mm-monad_01` - Adapter pattern

### Branch Lineage

```
master
├── imperative_01 → imperative_02 → imperative_03  (inline styles track)
├── monad_01 → monad_02 → monad_03                 (adapter track)
│
└── metamask-baseline                               (MDS foundation)
    ├── mm-imperative_01                            (direct MDS)
    └── mm-monad_01                                 (adapters over MDS)
```

---

## Conclusions

### When to use Monad/Adapter approach:
- Cross-platform support needed
- Building reusable component library
- Extensive unit testing required
- Long-term maintainability priority

### When to use Imperative/Direct approach:
- Web-only application
- Rapid prototyping / MVP
- Simpler requirements
- Faster initial development

---

## Project Structure

```
src/
  components/     # UI components
  services/       # Mock Web3 and accounts
  hooks/          # React hooks
  types/          # TypeScript interfaces
  adapters/       # (monad branches) Platform adapters
  styles/         # (monad branches) Style utilities
  theme/          # (monad branches) Theme operations
```

## Mock Accounts

Test addresses for validation scenarios:

| Type | Description |
|------|-------------|
| EOA | Valid wallet addresses |
| Contract | Token contracts, DEX routers |
| Invalid | Bad checksum, wrong length |
| Blacklisted | Flagged addresses |
| Sanctioned | OFAC sanctioned addresses |

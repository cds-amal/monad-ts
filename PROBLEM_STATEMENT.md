# Problem Statement: AI-Generated Code Quality in Design Systems

## The Core Problem

When AI tools (Claude Code, Cursor, GitHub Copilot, etc.) generate UI code from prompts or Figma designs, they consistently produce code that violates design system principles and architectural patterns, leading to:

1. **Inconsistent component usage** - AI generates `<div>` and `<button>` instead of design system components
2. **Arbitrary styling** - AI uses inline styles, raw hex values, and magic numbers instead of semantic tokens
3. **Architecture violations** - AI ignores monadic/hexagonal patterns established in the codebase
4. **Style drift at scale** - Each AI-generated feature introduces new inconsistencies that compound over time

## Context: The Scale Problem

This repository's research (`dx-research.md`) demonstrates that:

- **Imperative styling** (inline styles, raw CSS) leads to style drift and high maintenance costs at scale
- **Monadic patterns** with semantic tokens provide better consistency and lower change impact
- **The crossover point** is around 20-50 components where structured patterns pay dividends

However, AI tools default to imperative patterns because they lack design system context.

## Concrete Examples

### What AI Currently Generates

```tsx
// ❌ Anti-pattern: AI-generated code
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
        cursor: 'pointer'
      }}
    >
      Connect Wallet
    </button>
  )
}
```

**Problems:**
- Uses native `<button>` instead of MetaMask DS Button component
- Inline styles with arbitrary values
- Hardcoded colors (`#3b82f6`) instead of semantic tokens
- No accessibility considerations
- No loading/disabled state patterns
- Doesn't scale - theming requires changing every instance

### What We Want AI to Generate

```tsx
// ✅ Desired: Design system-aware code
import { Button, ButtonVariant, ButtonBaseSize } from '@metamask/design-system-react'

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

**Benefits:**
- Uses MetaMask Design System component
- Semantic variants (`Primary`) not arbitrary colors
- Built-in loading/disabled states
- Accessibility handled by design system
- Theming works automatically
- Follows monadic principle: express intent, not implementation

## The Impact at Scale

### Current State (No Guidelines)

| Scenario | Impact |
|----------|--------|
| AI generates 10 new components | 10 components with inline styles, arbitrary colors |
| Design team updates brand colors | Manual audit of all AI-generated code required |
| Add dark mode | Must rewrite every AI-generated component |
| New developer uses AI assistance | Generates code that passes review but violates patterns |
| After 6 months | Codebase has mix of design system + inline styles, inconsistent |

### Desired State (With Guidelines)

| Scenario | Impact |
|----------|--------|
| AI generates 10 new components | 10 components using MetaMask DS, semantic variants |
| Design team updates brand colors | Design tokens update, all components update automatically |
| Add dark mode | Token theme swap, zero component changes |
| New developer uses AI assistance | AI generates pattern-compliant code from the start |
| After 6 months | Consistent codebase following design system, zero drift |

## The Gap

**What exists:**
- ✅ MetaMask Design System installed (`@metamask/design-system-react`)
- ✅ Design tokens configured (`@metamask/design-tokens`)
- ✅ Tailwind preset for semantic values
- ✅ Research showing monadic patterns reduce maintenance cost
- ✅ Example refactored components in `setup-metamask-design-system` branch

**What's missing:**
- ❌ AI-readable documentation of component patterns
- ❌ Clear rules for when to use which components
- ❌ Anti-pattern examples (what NOT to generate)
- ❌ Semantic token usage guidelines
- ❌ Architecture pattern documentation for AI consumption

## Success Criteria

When successful, AI tools will:

1. **Default to design system components** - Generate `<Button variant={ButtonVariant.Primary}>` not `<button style={{...}}>`
2. **Use semantic variants** - Generate `intent: 'primary'` not `backgroundColor: '#3b82f6'`
3. **Follow architectural patterns** - Understand separation of concerns from dx-research.md
4. **Avoid anti-patterns** - Never generate inline styles or arbitrary values
5. **Maintain consistency** - Multiple AI generations result in stylistically consistent code

## Approach

Create **AI-readable design system guidelines** in markdown format that:

1. **Are comprehensive** - Cover all MetaMask DS components being used
2. **Provide clear examples** - Show correct usage and anti-patterns side-by-side
3. **Explain the "why"** - Help AI understand intent, not just syntax
4. **Reference real code** - Use actual refactored components as examples
5. **Are iterative** - Start with components, expand to patterns, then consider structured schemas

## Target Audience

**Primary:** AI coding assistants (Claude Code, Cursor, GitHub Copilot)
**Secondary:** Human developers using AI assistance
**Tertiary:** Future tooling that could consume structured design system specifications

## Next Steps

1. Create `DESIGN_GUIDELINES/COMPONENTS.md` with comprehensive component usage patterns
2. Document anti-patterns and why they're problematic
3. Provide real examples from refactored codebase
4. Iterate based on AI-generated code quality improvements
5. Expand to architecture patterns, tokens, and eventually structured schemas

#!/usr/bin/env node
/**
 * Token Extraction Script
 *
 * Reads color tokens from @metamask/design-tokens and generates
 * a React Native compatible tokens file.
 *
 * Run: node scripts/extract-tokens.js
 */

const fs = require('fs')
const path = require('path')

// Import the theme colors from the design tokens package
const { lightTheme: lightThemeSource, darkTheme: darkThemeSource } = require('@metamask/design-tokens')
const lightColors = lightThemeSource.colors
const darkColors = darkThemeSource.colors

// Extract only the colors we need for the native adapter
function extractThemeColors(colors) {
  return {
    colors: {
      text: {
        default: colors.text.default,
        alternative: colors.text.alternative,
        muted: colors.text.muted,
      },
      background: {
        default: colors.background.default,
        alternative: colors.background.alternative,
        muted: colors.background.muted,
        pressed: colors.background.pressed,
      },
      border: {
        default: colors.border.default,
        muted: colors.border.muted,
      },
      primary: {
        default: colors.primary.default,
        muted: colors.primary.muted,
      },
      error: {
        default: colors.error.default,
        muted: colors.error.muted,
      },
      success: {
        default: colors.success.default,
        muted: colors.success.muted,
      },
      warning: {
        default: colors.warning.default,
        muted: colors.warning.muted,
      },
      info: {
        default: colors.info.default,
        muted: colors.info.muted,
      },
    },
  }
}

const lightTheme = extractThemeColors(lightColors)
const darkTheme = extractThemeColors(darkColors)

// Generate the TypeScript output
const output = `/**
 * Auto-generated from @metamask/design-tokens
 * DO NOT EDIT MANUALLY - run \`pnpm prebuild\` to regenerate
 *
 * Generated: ${new Date().toISOString()}
 */

export interface ThemeTokens {
  colors: {
    text: { default: string; alternative: string; muted: string }
    background: { default: string; alternative: string; muted: string; pressed: string }
    border: { default: string; muted: string }
    primary: { default: string; muted: string }
    error: { default: string; muted: string }
    success: { default: string; muted: string }
    warning: { default: string; muted: string }
    info: { default: string; muted: string }
  }
}

export const lightTheme: ThemeTokens = ${JSON.stringify(lightTheme, null, 2)}

export const darkTheme: ThemeTokens = ${JSON.stringify(darkTheme, null, 2)}
`

// Write the output file
const outputPath = path.join(__dirname, '..', 'src', 'adapters', 'tokens.native.ts')
fs.writeFileSync(outputPath, output, 'utf8')

console.log(`✓ Generated ${outputPath}`)

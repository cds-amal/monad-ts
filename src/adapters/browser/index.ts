// Style adapter
export { browserStyleAdapter, colors, spacing, radii, fontSizes, fontWeights, shadows } from './style'
export type { BrowserStyle } from './style'

// Render adapter (React DOM components)
export {
  Box,
  VStack,
  HStack,
  Flex,
  Spacer,
  Divider,
  Center,
  Text,
  InputField,
  ButtonElement,
} from './render'

// Web3 adapter
export { browserWeb3Adapter, MOCK_ACCOUNTS, getAccountByAddress } from './web3'
export type { AccountType, MockAccount } from './web3'

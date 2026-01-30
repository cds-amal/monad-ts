import type { Adapter } from '../types'
import { nativeRenderAdapter } from './render'
import { nativeStyleAdapter } from './style'

export const nativeAdapter: Adapter = {
  render: nativeRenderAdapter,
  style: nativeStyleAdapter,
  platform: 'native',
}

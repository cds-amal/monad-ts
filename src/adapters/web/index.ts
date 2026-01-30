import type { Adapter } from '../types'
import { webRenderAdapter } from './render'
import { webStyleAdapter } from './style'

export const webAdapter: Adapter = {
  render: webRenderAdapter,
  style: webStyleAdapter,
  platform: 'web',
}

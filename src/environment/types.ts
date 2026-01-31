export type Platform = 'web' | 'ios' | 'android'
export type Mode = 'development' | 'production' | 'test'

export interface Environment {
  mode: Mode
  platform: Platform
  isDev: boolean
  isProd: boolean
  isTest: boolean
}

export function createEnvironment(mode: Mode, platform: Platform): Environment {
  return {
    mode,
    platform,
    isDev: mode === 'development',
    isProd: mode === 'production',
    isTest: mode === 'test',
  }
}

import { hosts, getEnv, getStableUrl, getDevUrl } from '@dian/app-utils'

type HostsType = 'real' | 'pre' | 'stable' | 'dev' | 'local'

export const allHosts = {
  // add your hosts
  real: {
    z: '//z.dian.so',
    AUTH_HOST: '//auth.dian.so',
    dcapi: '//dcapi.dian.so',
  },
  pre: {
    z: '//z.dian-pre.com',
    AUTH_HOST: '//auth.dian-pre.com',
    dcapi: '//dcapi.dian-pre.com',
  },
  stable: {
    z: getStableUrl('z'),
    AUTH_HOST: getStableUrl('auth'),
    dcapi: getStableUrl('dcapi'),
  },
  dev: {
    z: getDevUrl('z'),
    AUTH_HOST: getDevUrl('auth'),
    dcapi: getDevUrl('dcapi'),
  },
  // 仅用于本地开发代理
  local: {
    z: '/@Z',
    AUTH_HOST: '/@auth',
    dcapi: '/@DCAPI',
  },
}

const env = { ...hosts, ...allHosts[getEnv() as HostsType] }

export { env }

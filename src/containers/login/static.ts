import { getEnv } from '@dian/app-utils'

const clientIdMap = {
  real: '1436222250902085633',
  pre: '1435900121810395137',
  stable: '1435899417295290370',
  dev: '1435899417295290370',
  local: '1435899417295290370',
}

export const clientId = clientIdMap[getEnv()]
export const scope = 'openid'
export const responseType = 'code'
export const grantType = 'authorization_code'
export const redirectUri = `${window.location.origin}/logged`

const authUrlMap = {
  real: 'https://auth.dian.so/oauth/authorize',
  pre: 'https://auth.dian-pre.com/oauth/authorize',
  stable: 'https://auth.dian-stable.com/oauth/authorize',
  dev: 'https://auth.dian-stable.com/oauth/authorize',
  local: 'https://auth.dian-stable.com/oauth/authorize',
}

export const authUrl = authUrlMap[getEnv()]

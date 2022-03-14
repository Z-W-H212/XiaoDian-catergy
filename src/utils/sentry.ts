import * as Sentry from '@sentry/browser'
import { isRealEnv } from '@dian/app-utils'
import pkg from '../../package.json'

if (isRealEnv()) {
  Sentry.init({
    // TODO: add your dsn
    // refs: http://sentry-clientdeploy.apps.daily.ocp.xiaodiankeji.net/
    dsn: '',
    release: pkg.gitHead.slice(0, 6),
    attachStacktrace: true,
    ignoreErrors: [
      'ChunkLoadError',
    ],
  })
}

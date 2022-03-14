import path from 'path'
import { defineConfig } from '@dian/vite'
import react from '@dian/vite-preset-react'

const cwd = process.cwd()

const server = {
  proxy: require('./config/proxy.config').proxyConfig,
  host: '0.0.0.0',
}

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: path.join(cwd, './src') },
      { find: /^~/, replacement: '' },
      { find: /antd\/lib/, replacement: 'antd/es' },
      { find: 'moment', replacement: '@dian/dayjs' },
      { find: 'lodash', replacement: 'lodash-es' },
    ],
  },
  plugins: [react({
    injectReact: true,
    legacy: false,
  })],
  optimizeDeps: {
    include: ['query-string', 'antd'],
  },
  server,
})

// import polyfills
import '@dian/polyfill'

import ReactDOM from 'react-dom'
import Router from '@/router'
import history from '@/router/history'

import 'antd/dist/antd.less'
import './global-style.less'

ReactDOM.render(
  <Router history={history} />,
  document.querySelector('#root'),
)

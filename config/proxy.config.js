const localEnv = 'stable'
// alterId 为 dna 上分配的项目临时地址
// localEnv 为 test 时必须配置 alterId
const alterId = 'alter-616147938321633280'

const getEnv = (domain, alterId) => ({
  pre: `https://${domain}.dian-pre.com`,
  online: `https://${domain}.dian.so`,
  stable: `https://${domain}.dian-stable.com`,
  test: `https://${domain}-${alterId}.six.dian-dev.com`,
})

const getTarget = (domain = 'z') => {
  return getEnv(domain, alterId)[localEnv || 'stable']
}

const zTarget = getTarget('auth')

const proxyConfig = {
  '/@auth/': {
    target: zTarget,
    changeOrigin: true,
    cookieDomainRewrite: {
      '*': '',
    },
    rewrite: path => path.replace(/^\/@auth/, ''),
  },
  '/@z': {
    // target: `https://z-${ALTER_ID}.six.dian-dev.com`,
    target: 'https://z.dian-stable.com',
    changeOrigin: true,
    cookieDomainRewrite: { '*': '' },
    rewrite: path => path.replace(/^\/@z/, '/'),
  },
  '/@DCAPI': {
    target: `https://dcapi-${alterId}.six.dian-dev.com`,
    // target: 'https://dcapi.dian-stable.com',
    changeOrigin: true,
    cookieDomainRewrite: { '*': '' },
    rewrite: path => path.replace(/^\/@DCAPI/, '/'),
  },
}

module.exports.proxyConfig = proxyConfig

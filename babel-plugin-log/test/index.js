const { transformFileSync } = require('@babel/core')
const babelPluginLog = require('../src')
const path = require('path')

const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
  plugins: [babelPluginLog],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  },
})

console.log('code ->', code)

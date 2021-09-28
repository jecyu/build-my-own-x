const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default // 因为 @babel/parser 等包都是通过 es module 导出的，所以通过 commonjs 的方式引入有的时候要取 default 属性。
const types = require('@babel/types')

const sourceCode = `
  console.log(1)
  function func() {
    console.info(2);
  }

  export default class Clazz {
    say() {
      console.debug(3);
    }

    render() {
      return <div>{console.error(4)}</div>
    }
  }
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'], // 支持 jsx 写法
})

traverse(ast, {
  CallExpression(path, state) {
    if (
      types.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === 'console' &&
      ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start
      path.node.arguments.unshift(
        types.stringLiteral(`filename: (${line}, ${column})`)
      )
    }
  },
})

const { code, map } = generator(ast)
console.log('code ->', code)

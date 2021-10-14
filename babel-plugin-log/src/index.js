/**
 * babel 插件模式
 */

module.exports = function ({ types, template }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (
          types.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === 'console' &&
          ['log', 'info', 'error', 'debug'].includes(
            path.node.callee.property.name
          )
        ) {
          const { line, column } = path.node.loc.start
          path.node.arguments.unshift(
            types.stringLiteral(`filename: (${line}, ${column})`)
          )
        }
      },
    },
  }
}

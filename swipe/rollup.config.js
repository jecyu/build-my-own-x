import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/swipe.js',
  output: {
    file: 'docs/swipe.js',
    format: 'umd',
    sourcemap: true,
    name: 'Swipe'
  },
  plugins: [
    postcss(),
    production && terser() // minify, but only in production
  ]
}

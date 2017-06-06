import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  plugins: [
    commonjs(),
    resolve({ jsnext: true }),
    babel({
      babelrc: false,
      presets: ['es2015-rollup'],
      exclude: ['node_modules/**'],
      plugins: [
        ["transform-react-jsx", { pragma: "h" }],
        ["transform-object-rest-spread"],
      ]
    })
  ],
  onwarn: function (message) {
    if (/Use of `eval` \(in .*\/node_modules\/firebase\/.*\) is strongly discouraged/.test(message)) {
      return
    }
  },
};

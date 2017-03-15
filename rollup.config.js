import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/app.js',
  dest: 'dist/index.js',
  format: 'iife',
  sourceMap: 'inline',
  useStrict: false,
  plugins: [
    commonjs(),
    resolve({ jsnext: true }),
    babel({ exclude: ['node_modules/**', 'src/**/*.scss'] }),
  ],
  onwarn: function (message) {
    if (/Use of `eval` \(in .*\/node_modules\/firebase\/.*\) is strongly discouraged/.test(message)) {
      return
    }
  },
};


const path = require('path')
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackExternals
}
  = require('customize-cra')

module.exports = override(
  fixBabelImports(
    'import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({ javascriptEnabled: true, modifyVars: { '@primary-color': '#1DA57A' }, }),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  addWebpackExternals([
    {
      "showdown":"showdown",
    },
    /^antd$/i
  ])
);
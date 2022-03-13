const head = require('./config/head.js');
const plugins = require('./config/plugins.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  theme: 'vdoing', // 使用依赖包主题
  title: "basonwoo's blog",
  description: '',
  markdown: {
    lineNumbers: true,
  },

  head,
  plugins,
  themeConfig,
}

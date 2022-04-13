module.exports = {
  devServer: {
    proxy: "http://joejhhaung:Auo20222@auhqwsg.corpnet.auo.com:8080",
    disableHostCheck: true,
    port:8084
  },

  runtimeCompiler:true,

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  }
};

module.exports = {
  devServer: {
    proxy: "http://joejhhaung:Auo20222@auhqwsg.corpnet.auo.com:8080",
    disableHostCheck: true,
  },

  runtimeCompiler:true,

  css:{
    loaderOptions:{
      sass:{
        prependData:`@import "@/styles/main.scss";`
      }
    }
  },

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

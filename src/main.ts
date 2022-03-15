import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import i18n from './i18n'


Vue.config.productionTip = false
Vue.use(ElementUI, {locale})


new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')

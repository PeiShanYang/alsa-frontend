import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import Store from './services/store.service'


Vue.config.productionTip = false
Vue.use(ElementUI, {locale})
Vue.observable(Store);


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

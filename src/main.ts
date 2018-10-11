import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Vue2Storage from 'vue2-storage'

Vue.use(Vue2Storage, {
  prefix: 'crystalplan_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000 * 360
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

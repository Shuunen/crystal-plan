import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Vue from 'vue'
import VuePellEditor from 'vue-pell-editor'
import { Plugin as Vue2Storage } from 'vue2-storage'
import './assets/fonts.css'
import './assets/global.css'
import './assets/highlight.css'
import './assets/layout.css'
import './assets/variables.css'
import Main from './main.vue'

Vue.use(Buefy)

Vue.use(Vue2Storage, {
  prefix: 'crystal_plan_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000 * 360,
})
Vue.use(VuePellEditor)

Vue.config.productionTip = false

new Vue({
  render: h => h(Main),
}).$mount('#app')

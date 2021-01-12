import Vue from 'vue'
import App from './App.vue'
import './plugins/axios'
import './plugins/element.js'
import './plugins/axios.js'
import moment from "moment"

Vue.config.productionTip = false

window.MATRIX_LANG = 'zh-CN';

Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.MATRIX_LANG);

// Element UI Setup
Vue.prototype.$ELEMENT = { size: 'small'};

new Vue({
  render: h => h(App)
}).$mount('#app')

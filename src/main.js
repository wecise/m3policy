import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import moment from 'moment'
import animate from 'animate.css'
import VueI18n from 'vue-i18n'

const m3 = require("@cnwangzd/m3js");

/* 
 * 测试环境
*/
if(process.env.NODE_ENV === "development"){
  m3.connect("47.92.151.165",8080,"wecise","admin","admin");
  //m3.connect("18.188.85.82",8080,"wecise","admin","admin");
} else {
  m3.init();
}

Vue.use(VueI18n);

Vue.use(animate);

Vue.config.productionTip = false;

window.MATRIX_LANG = 'zh-CN';

Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.MATRIX_LANG);

// Element UI Setup
Vue.prototype.$ELEMENT = { 
  size: 'small',
  i18n: m3.lang(this)
};

new Vue({
  render: h => h(App)
}).$mount('#app')

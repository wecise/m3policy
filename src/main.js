import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
// dark theme
import './assets/theme/element-#252D47/index.css'
// blue theme
// import './assets/theme/element-#409EFF/index.css'
import moment from 'moment'
import animate from 'animate.css'
import VueSplit from 'vue-split-panel'

Vue.use(VueSplit)
Vue.use(animate);
Vue.use(VueI18n);


Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.M3_LANG);
Vue.prototype.eventHub = new Vue();

Vue.config.productionTip = false;

// ElementUI Setup
ElementUI.Tooltip.props.openDelay.default = 1000;

/* 
 * 测试环境
*/
const m3 = require("@wecise/m3js");
Vue.prototype.m3 = m3;
window.m3 = m3;
window.M3_LANG = 'zh-CN';

let init = async function(){

  await m3.lang().then( res=>{
    
    window.global = m3.global;

    const i18n = new VueI18n({
      locale: window.M3_LANG,
      messages: res
    });


    Vue.prototype.$ELEMENT = { 
      size: 'mini',
      i18n: (key, value) => i18n.t(key, value)
    };

    new Vue({
      render: h => h(App),
      i18n
    }).$mount('#app')
  })
};


if(process.env.NODE_ENV === "development"){

  /* env1 */
  let env1 = function(){
    m3.connect({proxy:"http",ip:"47.92.151.165",port:8080,company:"wecise",username:"admin",password:"admin1234)(*&"}).then(()=>{
      init();
    }).catch((err)=>{
      console.log(err);
    });
  };
  
  /* env2 */
  /* let env2 = function(){
    m3.connect("http","18.188.85.82",8080,"wecise","admin","admin").then( ()=>{
      setTimeout(()=>{
        init();
      },5000)
    }).catch((err)=>{
      console.log(err);
    });
  }; */

  env1();
  
} else {
  m3.init();
  init();
}

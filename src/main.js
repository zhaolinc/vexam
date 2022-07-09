import Vue from 'vue'
import App from './App'
import router from './router'
//ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios

// 全局引入global
import global from "./components/global"
Vue.prototype.$global = global

//ElementUI
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App), //ElementUI
})

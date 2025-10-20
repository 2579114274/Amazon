import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import '@/plugins/element-ui'
// import 'animate.css' //自己写了动画就不引入了
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  // ElementUI,
  render: h => h(App)
}).$mount('#app')



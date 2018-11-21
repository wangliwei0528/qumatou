// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//例子漂浮
import VueParticles from 'vue-particles'
//引入语言包
import i18n from './lang'
//引入vuex
import store from './store'
//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//使用element-ui
Vue.use(ElementUI)
//粒子漂浮物
Vue.use(VueParticles)
import Axios from 'axios'
// Axios.defaults.baseURL='https://api.mp.qumatou.com.cn'
Axios.defaults.headers.get['Authorization']="Bearer " + localStorage.getItem("token");
Axios.defaults.headers.post['Authorization']="Bearer " + localStorage.getItem("token");
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['Accept']='application/vnd.myapp.v1+json'
Axios.defaults.headers.get['Accept']='application/vnd.myapp.v1+json'
Vue.prototype.$axios=Axios;
//引入富文本编辑器
import VueQuillEditor  from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
Vue.use(VueQuillEditor);




Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})

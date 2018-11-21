// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles

import App from './App'
// import axios from './axios'
import router from './router'
import jquery from 'jquery'
// import './assets/css/bootstrap.min.css'

import '@/assets/js/bootstrap.min'
// import './assets/css/bootstrap.min.css'
import '@/assets/js/fontSize'
import '@/assets/js/taobao'
import '@/assets/js/validate.js'

import YDUI from 'vue-ydui'; /* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import 'vue-ydui/dist/ydui.rem.css';
/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */

Vue.use(YDUI);

//判断token过期
Vue.prototype.date = function () {
  let date = localStorage.getItem('date')
  let currDate = parseInt(new Date().getTime()/1000)
  if (currDate > date) {
    window.localStorage.clear('token')
    router.replace({
      path: '/' // 到登录页重新获取token
    })
  }
};

//使用axios模块
import Axios from 'axios'
Vue.prototype.$axios=Axios;
//解决axios post传数据后端接受不到问题
import qs from 'qs'
Vue.prototype.$qs=qs

import {
  Loading,
  Message
} from 'element-ui'


//拦截器
let loadinginstace
let date = localStorage.getItem('date')
let currDate = parseInt(new Date().getTime() / 1000)
Axios.interceptors.request.use(
  config => {
    loadinginstace = Loading.service({
      fullscreen: true,
      text: '拼命加载中...',
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    })
    if (window.localStorage.getItem('token')) { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      config.headers.common['Authorization'] = `Bearer ` + localStorage.getItem('token');
      config.headers.common['Accept'] = 'application/vnd.lingmo.v1+json'
      config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config;
  },
  err => {
    loadinginstace.close()
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(err);
  });
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
Axios.interceptors.response.use(
  response => {
    loadinginstace.close()
    if (date && currDate > date) {
      router.replace({
        path: '/' // 到登录页重新获取token
      })
    } else if (response.data.message) {
      if (response.data.status == 1) {
        Message.success({
          message: response.data.message
        })
      } else {
        Message.warning({
          message: response.data.message
        })
      }
    } else if (response.data.token) { // 判断token是否存在，如果存在说明需要更新token
      window.localStorage.setItem('token', response.data.token) // 覆盖原来的token(默认一天刷新一次)
    }
    return response;
  },
  error => {
    loadinginstace.close()
    Message.error({
      message: '加载失败'
    })
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            } //登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  });
//拦截器

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

// Vue.prototype.HOST = '/api'


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})




import Vue from 'vue'
import Router from 'vue-router'

import loginParent from '@/components/login/loginParent'
// import sidebarParent from '@/components/sidebar/sidebarParent'

import index from '@/page/index/index'
import Home from '@/components/Home'
import authority from '@/page/authority/authority'
import site from '@/page/site/site'
//用户
import user from '@/page/user/user'
import editUser from '@/page/user/editUser'
//角色
import role from '@/page/role/role'
import classification from '@/page/classification/classification'
//资讯
import information from '@/page/information/information'
//添加资讯
import addInfo from '@/page/information/addInfo'
//编辑资讯
import editInfo from '@/page/information/editInfo'
//网站配置
import configure from '@/page/configure/configure'
//广告管理
import advert from '@/page/advert/advert'
//banner
import banner from '@/page/banner/banner'
//政企互动
import interaction from '@/page/interaction/interaction'
//政企互动详情
import detail from '@/page/interaction/detail'
//系统日志
import log from '@/page/log/log'
// 添加角色
import addTo from '@/page/role/addTo'
import history from '@/page/history/history'
Vue.use(Router)

export default new Router({
  // mode:"history",
  // base: '/dist/',
  routes: [{
      path: '/',
      name: 'loginParent',
      component: loginParent
    },
    {
      path: '/home',
      component: Home,
      children: [{
          path: '/',
          name: 'index',
          mata: {
            title: '首页'
          },
          component: index
        },
        {
          path: '/user',
          name: 'user',
          mata: {
            title: '用户管理'
          },
          component: user
        },
        {
          path: '/edituser/:id',
          name: 'editUser',
          mata: {
            title: '编辑用户'
          },
          component: editUser
        },
        {
          path: '/role',
          name: 'role',
          mata: {
            title: '角色管理'
          },
          component: role
        },
        {
          path: '/addTo',
          name: 'addTo',
          mata: {
            title: '角色管理'
          },
          component: addTo
        },
        {
          path: '/configure',
          name: 'configure',
          mata: {
            title: '网站配置项'
          },
          component: configure
        },
        {
          path: '/information',
          name: 'information',
          mata: {
            title: '资讯管理'
          },
          component: information
        },
        {
          path: '/addInfo',
          name: 'addInfo',
          mata: {
            title: '添加资讯'
          },
          component: addInfo
        },
        {
          path: '/editInfo/:id',
          name: 'editInfo',
          mata: {
            title: '编辑资讯'
          },
          component: editInfo
        },
        {
          path: '/banner',
          name: 'banner',
          mata: {
            title: '轮播图管理'
          },
          component: banner
        },
        {
          path: '/advert',
          name: 'advert',
          mata: {
            title: '广告管理'
          },
          component: advert
        },
        {
          path: '/classification',
          name: 'classification',
          mata: {
            title: '分类管理'
          },
          component: classification
        },
        {
          path: '/interaction',
          name: 'interaction',
          mata: {
            title: '政企互动'
          },
          component: interaction
        },
        {
          path: '/renwenshiguan',
          name: 'history',
          mata: {
            title: '人文史官'
          },
          component: history
        },
        {
          path: '/detail/:id',
          name: 'detail',
          mata: {
            title: '政企互动详情'
          },
          component: detail
        },
        {
          path: '/authority',
          name: 'authority',
          mata: {
            title: '权限管理'
          },
          component: authority
        },
        {
          path: '/site',
          name: 'site',
          mata: {
            title: '网站设置'
          },
          component: site
        },
        {
          path: '/log',
          name: 'log',
          mata: {
            title: '系统日志'
          },
          component: log
        },
      ]
    }
  ],
})

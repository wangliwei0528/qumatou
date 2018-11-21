import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
    // mode:'history',
    routes: [
        {
            path:'/',
            name:'login',
            component: (resolve) => require(['@/view/login/index'], resolve),            
        },
        {
            path:'/home',
            name:'home',
            component: (resolve) => require(['@/view/Layout/index'], resolve),
            children:[
                {
                    path:'/home',
                    component: (resolve) => require(['@/view/Home/home'], resolve),
                }, 
                {
                    path:'/user',
                    name:'user',
                    component: (resolve) => require(['@/view/user/user'], resolve),                    
                }, 
                {
                    path:'/handleuser/:id?',
                    name:'handleuser',
                    component: (resolve) => require(['@/view/user/handleuser'], resolve),                  
                }, 
                {
                    path:'/handlecom/:id?',
                    name:'handlecom',
                    component: (resolve) => require(['@/view/company/handlecom'], resolve),                  
                },  
                {
                    path:'/handlepro/:id?',
                    name:'handlepro',
                    component: (resolve) => require(['@/view/product/handlepro'], resolve),                  
                },               
                {
                    path:'/role',
                    name:'role',
                    component: (resolve) => require(['@/view/role/role'], resolve),                    
                }, 
                {
                    path:'/company',
                    name:'company',
                    component: (resolve) => require(['@/view/company/company'], resolve),
                },
                {
                    path:'/products',
                    name:'products',
                    component: (resolve) => require(['@/view/product/products'], resolve),
                },
                {
                    path:'/set',
                    name:'set',
                    component: (resolve) => require(['@/view/set/set'], resolve),
                },
                {
                    path:'/log',
                    name:'log',
                    component: (resolve) => require(['@/view/log/log'], resolve),
                },                
                                 
            ]
        },
        //404页面
        {
            path:'*',
            name:'nofound',
            component: (resolve) => require(['@/view/nofound/index'], resolve),
        },
        {
            path:'/close',
            name:'close',
            component: (resolve) => require(['@/view/close/close'], resolve),
        },

    ],

})
export default router


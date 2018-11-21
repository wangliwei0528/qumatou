//引入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
//使用一下vuex
Vue.use(Vuex)
//导出vuex实例并且注入到vue实例中
export default new Vuex.Store({
    state: {
        isCollapse: false,
        word:true,
        chartTheme: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"],
    },
    mutations: {
        toggleSiderBar(state) {
            state.isCollapse = !state.isCollapse
            state.word = !state.word
        }
    }
})

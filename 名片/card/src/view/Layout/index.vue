<template>
    <div class="layout">
        <!--侧导航-->
        <sliderbar></sliderbar>
        <div class="con-wrap" :class="{conCollapse: isCollapse}">
            <!--头部导航-->
            <topbar></topbar>

            <!--内容区域-->
            <router-view class="page-component-wrap animated fadeIn"></router-view>
        </div>
    </div>
</template>

<script>
    import sliderbar from '@/components/sliderbar/sliderbar'
    import topbar from '@/components/topbar/topbar'
    export default {
        name: "index",
        computed: {
            isCollapse() {
                return this.$store.state.isCollapse
            }
        },
        components:{
            sliderbar,
            topbar
        }
    }
</script>

<style scoped>
.page-component-wrap{
    padding:20px;
    margin-left:240px;
}
.con-wrap.conCollapse{
  transition:all .3s;
  margin-left:-170px
}
</style>
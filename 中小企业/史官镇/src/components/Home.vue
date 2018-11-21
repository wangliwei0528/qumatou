<template>
    <div class='index'>
        <Top></Top>
        <div class="left">
            <sidebar></sidebar>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Top from './top/top'
    import sidebar from './sidebar/sidebar'
    export default {
        name: "Home",
        components:{Top,sidebar}
    }
</script>

<style scoped>
.index{
    width:100%;
    height:100vh;
}
.left{
    width:300px;
    float:left;
    height:100%;
}
.main{
    width:-moz-calc(100% - 300px);
    width:-webkit-calc(100% - 300px);
    width: calc(100% - 300px);
    height:100vh;
    float:left;
    padding:30px;
}
</style>
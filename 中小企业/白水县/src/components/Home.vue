<template>
    <div>
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
.left{
    width:300px;
    float:left;
}
.main{
    width:-moz-calc(100% - 300px);
    width:-webkit-calc(100% - 300px);
    width: calc(100% - 300px);
    float:left;
    padding:30px;
}
</style>
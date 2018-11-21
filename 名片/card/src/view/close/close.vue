<template>
    <div>
        <div class='close'>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>对不起，您访问的页面暂时无法找到！！！</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click='go'><i class='el-icon-close'></i></el-button>
                </div>
                <div class='img'>
                    <h3>啊～哦～该站点已关闭！</h3>         
                </div>        
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        go(){
            this.$router.push('/')
        }
    }
}
</script>
<style scoped>
.close{
    width:800px;
    margin:100px auto;
}
.close .img{
    width:640px;
    height:380px;
    margin:0 auto;
    background: url("../../assets/img/bg.jpg") no-repeat;
    overflow: hidden;
}
h3{
    width:400px;
    text-align: center;
    margin:260px auto;
    font-size:24px
}
</style>



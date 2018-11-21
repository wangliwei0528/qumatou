<template>
    <div style="margin-left:240px">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <i class="el-icon-edit"></i>&nbsp;&nbsp;
                <span>配置信息</span>
            </div>
             <el-table
              :data="resultData"
              border
              :show-header="false"
              style="width:100%;">
              <el-table-column
                prop="key"
                align="center">
              </el-table-column>
              <el-table-column
                prop="value"
                align="center">
              </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
  name: "projectinfo",
  data() {
      return {
        data: {},
        resultData: []
      }
    },
    created() {
       this.token = localStorage.getItem("token");
      this.getData();      
    },
    methods: {
      getData() {
         const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios({
          method: 'get',
          url: "/api/admin/demolist",
          headers: {
              Authorization: "Bearer " + this.token,
              Accept: "application/vnd.myapp.v1+json"
            },
        }).then(
          (res) => {
            if(res){
              loading.close()
            }
            this.data = res.data;
            for (let i in this.data) {
              this.resultData.push({
                key: i,
                value: this.data[i]
              })
            }
          })
      }
    }
  }
</script>
<style scoped lang="less">
li {
  line-height: 30px;
}
</style>

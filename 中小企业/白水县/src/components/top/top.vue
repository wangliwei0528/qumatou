<template>
  <div class="top">
    <div class="cea">
      <el-col :span="22">
        <div class="grid-content bg-purple">{{name}}</div>
      </el-col>
      <el-col :span="2">
        <el-button type="text" @click="signOut()">退出</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
  export default {
    name: "top",
    data() {
      return {
        name:''
      }
    },
    created(){
      this.name=localStorage.getItem('wz_name')
    },
    methods: {
      signOut() {
        this.$axios({
          method: 'POST',
          url: "/api/admins/logout",          
        }).then(
          (res) => {
            if (res.status == 200) {
              this.$message({
                message: res.data.message,
                type: "success",
              })
              this.$router.push("/");
            } else {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          })

      },
    }
  }
</script>

<style scoped>
  .cea {
    background: #545c64;
    height: 1.2rem;
    line-height: 1.2rem;
    color: #fff;
    font-size: 0.36rem;
    text-align: left;
    padding-left: 0.4rem;
    border-bottom: 0.1rem solid #329a60;
  }
  .el-button--text{
    color: #ffffff;
    font-size: 0.24rem;
    margin-left: 0.4rem;
  }

</style>

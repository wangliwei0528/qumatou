<template>
  <div class="side">
    <el-row class="tac">
      <el-col :span="12">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#fff"
          :unique-opened="true"
          @select="selectMenu"
        >
          <el-submenu v-for="(val,index) in data" :key="index" :index="val.path?val.path:(index + '')">
            <template slot="title">
              <!-- <i class="el-icon-caret-bottom"></i> -->
              <span style="padding-left: 20px">{{val.perm_name}}</span>
            </template>
            <el-menu-item-group v-for="(val1,index) in val.zrperm" :key="index">
              <el-menu-item :index="val1.path?val1.path:(index + '')" class="menu" style='padding: 0 20px 50px 70px'>
                {{val1.perm_name}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  //过滤器
  function deelData(arr, curr) {
    let result = arr.filter(item => item.mata.title === curr.perm_name)
    if (result.length > 0) {
      return result[0].path
    }
    return null
  }

  export default {
    name: "sidebar",
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        data: []
      }
    },
    created() {
      this.token = localStorage.getItem('token')
      this.$axios.get("/api/sgzadmin/permlist",
        {
          // headers: {
          //   'Authorization': 'Bearer ' + this.token,
          //   'Accept':'application/vnd.myapp.v1_json'
          // },
        }).then(
        (res) => {
          let childrens = this.$router.options.routes[1].children;
          for (let i in res.data) {
            res.data[i].path = null
            if (res.data[i].zrperm.length > 0) {
              for (let l in res.data[i].zrperm) {
                let zrperm = res.data[i].zrperm[l]
                zrperm.path = deelData(childrens, zrperm)
              }
            } else {
              res.data[i].path = deelData(childrens, res.data[i])
            }
          }
          this.data = res.data;
          // console.log(this.data)
        })
    },
    methods: {
      selectMenu(index) {
        this.$router.push(index)
      }
    }

  }
</script>

<style scoped>
  .el-col-12 {
    width: 100%;
  }

  .side {
    width: 298px;
    height: 100vh;
    background-color: rgb(84, 92, 100);
  }

  .tac {
    width: 299px;
    height: 100%;
  }

  .menu {
    width: 100%;
    height: 0.5rem;
    line-height: -2.5rem;
    padding-left: 70px;
    font-size: 0.24rem;
  }


</style>
<style>
  .el-menu-item-group .el-menu-item-group__title {
    padding: 0;
  }
</style>


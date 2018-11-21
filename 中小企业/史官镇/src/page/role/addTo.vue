<template>
  <div class="user">
    <div class="search">
      <div class="addbtn"><span style="color: #ff0005">* </span>角色名称：</div>
      <div class="searchinput">
        <el-input placeholder="请输入角色名称" v-model="inputRole"></el-input>
      </div>
    </div>

    <div class="site">权限 ：</div>
    <el-table
      :data="data"
      border
      ref="multipleTable"
      style="width:100%;"
      :show-header="false"
      @selection-change="handleSelectionChange">
      <el-table-column label="用户管理列表">
        <el-table-column
          prop="group_id"
          align="center"
          width="200px"
          type="selection"
        >
        </el-table-column>
        <el-table-column
          prop="perm_name"
          label="权限"
          align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="big" style="margin-top: 1rem" @click="submit">保存提交</el-button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      data: [],
      perm: "",
      inputRole: "",
      resultList: []
    };
  },
  created() {
    if (this.$route.query.Id) {
      this.$axios({
        method: "GET",
        url: "/api/sgzadmin/group_info",
        
        params: {
          id: this.$route.query.Id
        }
      }).then(res => {
        this.inputRole = res.data.name;
        this.data = res.data.perm;
        let group_perm = res.data.group_perm || "";
        let rows = res.data.perm.filter(itm => {
          return group_perm.indexOf(itm.perm) >= 0;
        });
        this.$nextTick(function() {
          if (rows.length > 0) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        });
      });
    } else {
      this.$axios({
        method: "GET",
        url: "/api/sgzadmin/group_info",
       
      }).then(res => {
        this.data = res.data.perm;
      });
    }
  },
  mounted() {
    this.date();
  },
  methods: {
    handleSelectionChange(data) {
      this.resultList = data.map(item => item.perm);
    },
    submit() {
      if (this.$route.query.Id) {
        this.$axios({
          method: "POST",
          url: "/api/sgzadmin/edit_group/" + this.$route.query.Id,
         
          data: {
            group_name: this.inputRole,
            group_perm: this.resultList
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
          this.$router.push("/role");
        });
      } else {
        this.$axios({
          method: "POST",
          url: "/api/sgzadmin/add_group",
          
          data: {
            group_name: this.inputRole,
            group_perm: this.resultList
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
          if (res.data.message == "名称不能为空") {
          } else {
            this.$router.push("/role");
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.user {
  text-align: center;
}

.search {
  margin: 0.3rem 0;
  height: 0.8rem;
}

.addbtn {
  padding: 0.2rem 0;
  float: left;
  font-size: 0.26rem;
}

.searchinput {
  width: 300px;
  float: left;
  margin-left: 30px;
}

th {
  font-weight: bold;
  color: #000;
}

.el-table th > .cell {
  position: relative;
  word-wrap: normal;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 24px;
}

.site {
  text-align: left;
  font-size: 0.32rem;
  padding: 0.2rem 0;
}
</style>
<style>
.el-table__empty-block {
  min-height: 600px;
}
</style>

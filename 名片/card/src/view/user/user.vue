<template>
    <div class="user">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="box">
                    <div class="add">
                        <el-button type="primary" icon="el-icon-edit" @click='add'>添加</el-button>  
                    </div> 
                    <div class='inputbox'>                  
                        <span class='search'>
                          <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            v-model="name"
                            @keyup.enter.native="getData">
                          </el-input>
                        </span>                        
                    </div>                                
                </div>                               
            </div>
            
            <el-table
              ref="testTable"
              :data="data"
              style="width:100%;"
              border
              :default-sort = "{prop: 'id', order: 'ascending'}" >
                <el-table-column
                  prop="nickname"
                  label="用户名"       
                  align="center">
                </el-table-column>
                <el-table-column prop="status" label="标签类型" align="center" width="180">
                  <template slot-scope="scope">
                    <div :style="{color: scope.row.status==1?'#4F4F4F':'red'}">{{scope.row.status == 1?'启用':'禁用'}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mobile"
                  label="手机号"               
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱"                  
                  align="center">
                </el-table-column>                
                <el-table-column
                  fixed="right"
                  label="操作"                
                  align="center">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">编辑</el-button>
                  <el-button type="text" size="small">
                    <el-dropdown>
                                <span class="el-dropdown-link" style="font-size:12px;color:#409EFF">
                                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                      <el-dropdown-menu slot="dropdown">            
                        <el-dropdown-item>
                          <el-button type="text" @click="del(scope.$index, scope.row)">删除</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-button @click="blockedUser(scope.$index, scope.row)" type="text">
                            {{scope.row.status == 1?'封禁用户':'解禁用户'}}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-button>
                </template>
            </el-table-column>
        </el-table>
            <!-- 分页设置 -->
            <div class="block" v-if="pagination">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[per_page]"
                :page-size="per_page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :background="true">
              </el-pagination>
            </div>                    
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //表格数据
      data: [],
      //总数
      total: 0,
      //当前页
      currentPage: 1,
      //每页显示的数据
      pagesize: 10,
      //当前页
      page: 1,
      per_page: 0,
      pagination: true,
      //搜索
      name: "",
      //解禁封禁用户  0为封禁  1为解禁
      status: 1
    };
  },
  created() {
    //获取token
    this.token = localStorage.getItem("token");
    //获取group_id
    this.group_id = localStorage.getItem("id");
    //获取数据
    this.getData();
  },
  methods: {
    //获取数据的方法
    getData() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios
        .get("/api/admin/users", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          params: {
            page: this.page,
            name: this.name
          }
        })
        .then(res => {
          if(res){
            loading.close()
          }
          this.data = res.data.data;
          if (res.data.total < res.data.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.total;
          this.per_page = res.data.per_page;
        })
        .catch(err => console.log(err));
    },
    //页码变更显示当前页的数据
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios
        .get("/api/admin/users", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          params: {
            page: currentPage
          }
        })
        .then(res => {
          if(res){
            loading.close()
          }
          this.data = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    add() {
      this.$router.push("/handleuser");
    },
    del(index, row) {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios({
        method: "post",
        url: "/api/admin/del_user/" + row.id,
        headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
      })
        .then(res => {
          if (res.data.status == 1) {
            loading.close()
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.getData();
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    blockedUser(index, row) {
      if (row.status == 1) {
        this.status = 0;
      } else {
        this.status = 1;
      }
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios({
          method: "POST",
          url: "/api/admin/closure_user/" + row.id,
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          data: {
            status: this.status
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              loading.close()
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.getData();
            } else {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    handleEdit(index,row){
      this.$router.push("/handleuser/" + row.id);
    }
  }
};
</script>
<style scoped>

</style>



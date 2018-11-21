<template>
    <div class="role">
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
                  prop="id"
                  label="ID"       
                  align="center">
                </el-table-column>               
                <el-table-column
                  prop="group_name"
                  label="角色名称"               
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="add_time"
                  label="创建时间"                  
                  align="center">
                </el-table-column>                
                <el-table-column
                  fixed="right"
                  label="操作"                
                  align="center">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">编辑</el-button>                  
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
        <el-dialog title="角色管理" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
            <el-form :model="form" :rules="rules">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop='group_name'>
                    <el-input v-model="form.group_name"></el-input>
                </el-form-item>    
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: { group_name: "" },
      rules: {
        group_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
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
      name: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
    },
    getData() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios
        .get("/api/admin/groups", {
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
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange: function(currentPage) {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.currentPage = currentPage;
      this.$axios
        .get("/api/admin/groups", {
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
    handleEdit(index, row) {
      this.id = row.id;
      this.dialogFormVisible = true;
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios
        .get("/api/admin/group_info", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          params: {
            id: row.id
          }
        })
        .then(res => {
          if(res){
              loading.close()
          }
          this.form.group_name = res.data.name;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit() {
      //   this.dialogFormVisible = false;
      if (this.id) {
         const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios({
          method: "post",
          url: "/api/admin/edit_group/" + this.id,
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          data: {
            group_name: this.form.group_name
          }
        })
          .then(res => {
               loading.cloae()
            if (res.data.status == 1) {
           
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.form.group_name = ""
              this.dialogFormVisible = false
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
      } else {
        this.$axios({
          method: "post",
          url: "/api/admin/add_group",
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          data: {
            group_name: this.form.group_name
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              loading.close()
              this.$message({
                message: res.data.message,
                type: "success"
              });
              (this.dialogFormVisible = false), this.getData();
              this.form.group_name = "";
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
      }
    }
  }
};
</script>

<template>
    <div class="list">
        <el-card>
            <!-- 头部标题 -->
            <div slot="header" class='header'>
                <span>员工列表</span>    
            </div>
            <!-- 顶部 -->
            <div class="search">     
                <div>
                <el-input 
                placeholder="请输入内容"  
                v-model="name"
                @keyup.enter.native="getData()">       
                    <el-button 
                    slot="append"             
                    @click='getData()'
                    icon="el-icon-search">
                    </el-button>
                </el-input>      
                </div>
                <div>
                <el-button type="primary" 
                @click='add' 
                icon="el-icon-plus">
                添加</el-button>
                </div>    
            </div> 
            <el-table
                :data="list"
                border                
                style="width: 100%">
                <el-table-column
                prop="id"
                label="ID"
                align='center'>
                </el-table-column>
                <el-table-column
                prop="staff_name"
                label="姓名"
                align='center'>
                </el-table-column>
                <el-table-column
                prop="staff_mobile"
                label="电话"
                align='center'>
                </el-table-column>   
                 <el-table-column label="操作" align='center'>
                    <template slot-scope="scope">
                        <el-button
                        type='text'
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        type='text'
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
            </el-table>
            <!-- 分页设置 -->
            <div class="block" v-if="pagination" style='margin-top:20px'>
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
          <!-- 分页设置 -->  
        </el-card>
        <!-- add -->
        <el-dialog title="添加员工" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref='form' :rules='rules'>
                <el-form-item label="员工姓名" :label-width="formLabelWidth" prop='staff_name'>
                    <el-input v-model="form.staff_name" placeholder='请输入员工姓名' clearable></el-input>
                </el-form-item>
                <el-form-item label="员工电话" :label-width="formLabelWidth" prop='staff_mobile'>
                    <el-input v-model="form.staff_mobile" :maxlength="11" type='number' placeholder='请输入员工电话' clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- add -->                 
    </div>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "160px",
      list: [],
      name: "",
      id: "",
      form: {
        staff_mobile: "",
        staff_name: ""
      },
      //总数
      total: 0,
      //当前页
      currentPage: 1,
      //每页显示的数据
      pagesize: 10,
      //当前页
      page: 1,
      per_page: 0,
      pagination: false,
      rules: {
        staff_name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        staff_mobile: [
          { required: true, message: "请输入员工电话", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get("/api/company/staff_lists", {
          params: {
            name: this.name,
            page: this.page
          },
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          this.list = res.data.data;
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
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.currentPage = currentPage;
      this.$axios
        .get("/api/company/staff_lists", {
          params: {
            page: currentPage
          },
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          if (res) {
            loading.close();
          }
          this.list = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    add() {
      this.dialogFormVisible = true;
    },
    save(form) {
      //
      let data = {
        staff_mobile: this.form.staff_mobile,
        staff_name: this.form.staff_name
      };
      this.$refs[form].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          if (this.id) {
            this.$axios({
              method: "post",
              url: "/api/company/edit_staff/" + this.id,
              headers: {
                Authorization: "Bearer " + this.token,
                Accept: "application/vnd.lingmo.v1+json"
              },
              data: data
            })
              .then(res => {
                loading.close();
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.dialogFormVisible = false;
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
              headers: {
                Authorization: "Bearer " + this.token,
                Accept: "application/vnd.lingmo.v1+json"
              },
              url: "/api/company/add_staff",
              data: data
            })
              .then(res => {
                loading.close();
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.dialogFormVisible = false;
                  this.getData();
                  (this.form.staff_mobile = ""), (this.form.staff_name = "");
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
        } else {
          return false;
        }
      });
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.id = row.id;
      this.$axios
        .get("api/company/staff_info", {
          params: {
            id: this.id
          },
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          this.form = res.data.ma_staff;
        })
        .catch(err => {
          console.log(res);
        });
    },
    handleDelete(index, row) {
      const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
      this.$axios({
        method: "post",
        url: "api/company/del_staff/" + row.id,
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.lingmo.v1+json"
        }
      })
        .then(res => {
          loading.close()
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.getData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    
  }
};
</script>
<style>
.search {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.spHeight tr {
  height: 30px;
}
</style>



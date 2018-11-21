<template>
  <div class="user">
    <!-- 顶部按钮 -->
    <div class="search">
      <el-button type="text" @click="centerDialogVisible = true" class="addbtn" icon="el-icon-plus">添加用户信息</el-button>
      <div class="searchinput">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model.trim="name"
          @keyup.enter.native="getData"
        >
        </el-input >
      </div>
      <el-button icon="el-icon-search" type="primary" class="searchbtn" @click=getData>搜索</el-button>
    </div>
    <!--表格数据  -->
    <el-table
      ref="testTable"
      :data="data"
      style="width:100%;"
      border
      :default-sort = "{prop: 'id', order: 'ascending'}" >
      <el-table-column label="用户管理列表" style="color:#000">
        <el-table-column
          prop="name"
          label="用户名"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column prop="status" label="标签类型" align="center">
          <template slot-scope="scope">
            <div  :style="{color: scope.row.status==1?'#4F4F4F':'red'}">{{scope.row.status == 1?'启用':'禁用'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="180"
          align="center">
        </el-table-column>

        <el-table-column
          prop="email"
          label="Email"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="last_login"
          label="最后登陆时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="last_ip"
          label="最后登陆IP"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="group.group_name"
          label="角色"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
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
                    <el-button type="text" @click="setGroup(scope.$index, scope.row)">设置用户组</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" @click="editpass(scope.$index, scope.row)">修改密码</el-button>
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
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="ruleForm.password" type="password" placeholder="请输入6~15位密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="pwd_repeat">
            <el-input v-model.trim="ruleForm.pwd_repeat" type="password" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </span>
    </el-dialog>
    <!--修改密码 -->
    <el-dialog title="修改用户密码" :visible.sync="dialogFormVisible"  width="30%">
      <el-form :rules="rules" ref='editpass' :model="ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="editdata.name"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="editdata.email" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="editdata.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="pwd_repeat">
          <el-input v-model="editdata.pwd_repeat" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitedit">确 定</el-button>
      </div>
    </el-dialog>
    <!--设置用户组-->
    <el-dialog title="设置用户组" :visible.sync="dialogFormVisible1" width="30%">
      <el-form :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="editdata.name"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="editdata.email" ></el-input>
        </el-form-item>
        <el-form-item label="用户组"  prop="sex">
          <el-radio-group v-model="editdata.group_id">
            <el-radio
              v-for='(item,index) in groups'
              :key='index'
              :value='item.group_id'
              :label='item.group_id'
            >
              {{item.group_name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitset">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证两次密码一致性规则
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //修改密码时获取到的原始值
      editdata: {},
      id: "",
      //添加用户
      centerDialogVisible: false,
      //修改密码
      dialogFormVisible: false,
      //设置用户组
      dialogFormVisible1: false,
      groups: [],
      group_name: [],
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
      //搜索框
      name: "",
      //解禁封禁用户  0为封禁  1为解禁
      status: 1,
      //用户添加数据以及验证
      ruleForm: {
        name: "",
        password: "",
        pwd_repeat: ""
      },
      //添加用户表单验证规则
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },          
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        pwd_repeat: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "请确认密码", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
    this.getItem();
  },
  mounted() {
    this.date();
  },
  methods: {
    //获取数据的方法
    getData() {
      this.$axios
        .get("/api/admins/users", {
          
          params: {
            page: this.page,
            name: this.name
          }
        })
        .then(res => {
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
      this.$axios
        .get("/api/admins/users", {
         
          params: {
            page: currentPage
          }
        })
        .then(res => {
          this.data = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    //用户编辑
    handleEdit(index, row) {
      let id = row.id;
      this.$router.push("/edituser/" + id);
    },
    //用户添加提交
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$axios({
            method: "POST",
            url: "/api/admins/add_user",
           
            data: this.$qs.stringify({
              name: this.ruleForm.name,
              password: this.ruleForm.password,
              pwd_repeat: this.ruleForm.pwd_repeat
            })
          })
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.centerDialogVisible = false;
                this.ruleForm.name = "";
                this.ruleForm.password = "";
                this.ruleForm.pwd_repeat = "";
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
          console.log("error submit!!");
          return false;
        }
      });
    },

    //用户添加重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //修改密码时获取对应ID的用户名和邮箱
    editpass(index, row) {
      this.id = row.id;
      this.dialogFormVisible = true;
      this.$axios({
        method: "get",
        url: "/api/admins/user_info/" + this.id,
        
      })
        .then(res => {
          this.editdata = res.data;
        })
        .catch(err => console.log(err));
    },
    //提交修改密码
    onSubmitedit() {
      this.$axios({
        method: "POST",
        url: "/api/admins/edit_password/" + this.id,
        
        data: this.$qs.stringify({
          password: this.editdata.password,
          pwd_repeat: this.editdata.pwd_repeat
        })
      })
        .then(res => {
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.$router.push("/user"), this.getData();
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
      this.dialogFormVisible = false;
    },
    //获取全部角色
    getItem() {
      this.$axios({
        method: "get",
        url: "/api/admins/user_group",
        
      })
        .then(res => {
          this.groups = res.data.groups;
        })
        .catch(err => console.log(err));
    },
    //设置用户组
    setGroup(index, row) {
      this.id = row.id;
      this.dialogFormVisible1 = true;
      //获取原信息
      this.$axios({
        method: "get",
        url: "/api/admins/user_info/" + row.id,
        
      })
        .then(res => {
          this.editdata = res.data;
        })
        .catch(err => console.log(err));
    },
    onSubmitset() {
      this.$axios({
        method: "POST",
        url: "/api/admins/setup_user/" + this.id,
        
        data: {
          group_id: this.editdata.group_id
        }
      })
        .then(res => {
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.dialogFormVisible1 = false;
            this.getData();
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(erer => {
          console.log(err);
        });
    },
    //封禁用户
    blockedUser(index, row) {
      if (row.status == 1) {
        this.status = 0;
      } else {
        this.status = 1;
      }
      this.$axios({
        method: "POST",
        url: "/api/admins/closure_user/" + row.id,
       
        data: {
          status: this.status
        }
      })
        .then(res => {
          if (res.data.status == 1) {
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
    }
  }
};
</script>
<style scoped>
.search {
  width: 80%;
  height: 50px;
  margin-bottom: 10px;
}
.addbtn {
  margin-bottom: 20px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  float: left;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.searchinput {
  width: 300px;
  float: left;
  margin-left: 30px;
}
.searchbtn {
  float: left;
  margin-left: 2px;
}
.el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 42px;
  line-height: 42px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
.el-pagination {
  margin-top: 20px;
}
table td {
  font-weight: bold;
  color: #000;
}
.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}
</style>
<style>
.el-radio + .el-radio {
  margin-left: 30px;
}
.el-radio-group {
  display: inline;
}
</style>

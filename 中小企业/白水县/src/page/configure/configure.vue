<template>
  <div class="configure">
    <div class="search">
      <div class="searchinput">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="name"
          @keyup.enter.native="getTableData">
        </el-input>
      </div>
      <el-button icon="el-icon-search" type="primary" class="searchbtn" @click=getTableData>搜索</el-button>
    </div>

    <div>
      <el-button type="primary" class="addbtn" @click="addrole()">
        +菜单创建
      </el-button>
      <el-button type="primary" class="addbtn" @click="submenu()">
        +配置子项创建
      </el-button>
    </div>

    <el-table
      :data="data"
      border
      style="width:100%;">
      <el-table-column label="用户管理列表">
        <el-table-column
          prop="id"
          label="排序"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="字符串标识"
          align="center">
        </el-table-column>
        <el-table-column prop="dom_type" label="标签类型" align="center">
          <template slot-scope="scope">
            <code v-if="scope.row.dom_type == 1">文本</code>
            <code v-if="scope.row.dom_type == 2">单选按钮</code>
            <code v-if="scope.row.dom_type == 3">上传图片</code>
            <code v-if="scope.row.dom_type == 4">文本域</code>
            <code v-if="scope.row.dom_type == 5">编辑器</code>
          </template>
        </el-table-column>
        <el-table-column
          prop="pname.name"
          label="所属菜单"
          align="center">
        </el-table-column>
        <el-table-column prop="is_show" label="标签类型" align="center">
          <template slot-scope="scope">
            <div :style="{color: scope.row.is_show==1?'#4F4F4F':'red'}">{{scope.row.is_show?'显示':'隐藏'}}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">
            <el-dropdown>
                          <span class="el-dropdown-link" style="font-size:12px;color:#409EFF">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button @click="deleteClick(scope.$index, scope.row)" type="text">删除</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="hideClick(scope.$index, scope.row)" type="text">{{scope.row.is_show?'隐藏':'显示'}}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mask" v-if="mask" @click="mask1"></div>
    <div class="editrole" v-if="mask3">
      <div>
        <div class="role"><span style="color: red;">*</span> 菜单名称 ：</div>
        <el-input
          placeholder="请输入菜单名称" style="width: 60%" v-model="inputRole">
        </el-input>
      </div>
      <el-button @click="submission()" type="primary" size="big" style="margin-top: 0.6rem;">保存提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>

    <div class="editrole1" v-if="mask2">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="所属菜单:" prop="menu" style="width:300px">
          <el-select v-model="ruleForm.menu" placeholder="请选择所属菜单">
            <el-option :label="val.name" :value="val.id" v-for="val in menuList" :key="val.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称 :" prop="name" style="width: 480px">
          <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="标识代码 :" prop="identification" style="width: 480px">
          <el-input v-model="ruleForm.identification" placeholder="请输入标识代码"></el-input>
        </el-form-item>
        <el-form-item label="标签类型 :" prop="label" style="width: 280px">
          <el-select v-model="ruleForm.label" placeholder="请选择标签类型">
            <el-option label="文本" value=1></el-option>
            <el-option label="单选按钮" value=2></el-option>
            <el-option label="上传图片" value=3></el-option>
            <el-option label="文本域" value=4></el-option>
            <el-option label="编辑器" value=5></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提示信息 :" prop="tips" style="width: 480px">
          <el-input v-model="ruleForm.tips" placeholder="请输入提示信息"></el-input>
        </el-form-item>

        <el-button type="primary" @click="submenu1">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form>
    </div>

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
  </div>

</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: [],
      input21: "",
      mask: false,
      mask2: false,
      mask3: false,
      inputRole: "",
      token: "",
      total: 0,
      currentPage: 1,
      page: 1,
      group_id: "",
      name: "",
      per_page: 0,
      id: 0,
      pagination: true,
      dom_type1: "",
      menuList: [],
      ruleForm: {
        menu: "",
        name: "",
        identification: "",
        label: "",
        tips: ""
      },
      //添加用户表单验证规则
      rules: {
        menu: [{ required: true, message: "请选择活动区域" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        identification: [
          { required: true, message: "请输入标识代码", trigger: "blur" }
        ],
        label: [{ required: true, message: "请选择标签类型", trigger: "blur" }]
      }
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getTableData();
    this.getMenuList();
  },
  mounted() {
    this.date();
  },
  methods: {
    getTableData() {
      axios
        .get("/api/admins/config", {
          
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
        });
    },
    addrole() {
      this.inputRole = "";
      this.mask = true;
      this.mask3 = true;
    },
    editClick(index, row) {
      if (row.parent_id == 0) {
        this.mask = true;
        this.mask3 = true;
        this.$axios({
          method: "GET",
          url: "/api/admins/config_info/",
         
          params: {
            add_type: 1,
            id: row.id
          }
        }).then(res => {
          this.id = res.data.id;
          this.inputRole = res.data.name;
          this.getTableData();
        });
      } else {
        this.mask = true;
        this.mask2 = true;
        this.$axios({
          method: "GET",
          url: "/api/admins/config_info/",
         
          params: {
            add_type: 2,
            id: row.id
          }
        }).then(res => {
          this.id = res.data.id;
          this.dom_type = res.data.dom_type;
          this.ruleForm.name = res.data.name;
          this.ruleForm.identification = res.data.type;
          this.ruleForm.tips = res.data.msg;
          switch (this.dom_type) {
            case 1:
              this.ruleForm.label = "文本";
              break;
            case 2:
              this.ruleForm.label = "单选按钮";
              break;
            case 3:
              this.ruleForm.label = "上传图片";
              break;
            case 4:
              this.ruleForm.label = "文本域";
              break;
            case 5:
              this.ruleForm.label = "编辑器";
              break;
          }
          for (let i in res.data.p_config) {
            this.ruleForm.menu = res.data.p_config[i].name;
          }
          this.getTableData();
        });
      }
    },
    getMenuList() {
      this.$axios({
        method: "GET",
        url: "/api/admins/config_info/",
        
        params: {
          add_type: 1
        }
      }).then(res => {
        this.getTableData();
        this.menuList = res.data.p_config;
      });
    },
    hideClick(index, row) {
      if (row.is_show == 1) {
        this.is_show = 0;
      } else {
        this.is_show = 1;
      }
      this.$axios({
        method: "GET",
        url: "/api/admins/config_isshow/" + row.id,
       
        params: {
          is_show: this.is_show
        }
      }).then(res => {
        if (res.data) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "success"
          });
        }
        this.getTableData();
      });
    },
    deleteClick(index, row) {
      this.$axios({
        method: "POST",
        url: "/api/admins/del_config/" + row.id,
        
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
        this.getTableData();
      });
    },
    submission() {
      if (this.id) {
        this.$axios({
          method: "POST",
          url: "/api/admins/edit_config/" + this.id,
          
          data: {
            name: this.inputRole,
            add_type: 1
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
          this.getTableData();
        });
      } else {
        this.$axios({
          method: "POST",
          url: "/api/admins/add_config",
          
          data: {
            name: this.inputRole,
            add_type: 1
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
          this.getTableData();
        });
      }
      this.mask3 = false;
      this.mask = false;
    },
    submenu() {
      this.ruleForm.name = "";
      this.ruleForm.identification = "";
      this.ruleForm.tips = "";
      this.ruleForm.label = "";
      this.ruleForm.menu = "";
      this.mask2 = true;
      this.mask = true;
      this.getMenuList();
    },
    submenu1() {
      if (this.id) {
        switch (this.ruleForm.label) {
          case "文本":
            this.ruleForm.label = 1;
            break;
          case "单选按钮":
            this.ruleForm.label = 2;
            break;
          case "上传图片":
            this.ruleForm.label = 3;
            break;
          case "文本域":
            this.ruleForm.label = 4;
            break;
          case "编辑器":
            this.ruleForm.label = 5;
            break;
        }
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$axios({
              method: "POST",
              url: "/api/admins/edit_config/" + this.id,
            
              data: {
                add_type: 2,
                name: this.ruleForm.name,
                type: this.ruleForm.identification,
                dom_type: this.ruleForm.label,
                msg: this.ruleForm.tips
              }
            })
              .then(res => {
                this.getTableData();
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.mask2 = false;
                  this.mask = false;
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
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$axios({
              method: "POST",
              url: "/api/admins/add_config",
              
              data: {
                add_type: 2,
                name: this.ruleForm.name,
                parent_id: this.ruleForm.menu,
                type: this.ruleForm.identification,
                dom_type: this.ruleForm.label,
                msg: this.ruleForm.tips
              }
            })
              .then(res => {
                this.getTableData();
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.mask2 = false;
                  this.mask = false;
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
      }
    },
    mask1() {
      this.mask = false;
      this.mask2 = false;
      this.mask3 = false;
    },
    cancel() {
      this.mask = false;
      this.mask2 = false;
      this.mask3 = false;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      axios
        .get("/api/admins/config", {
          
          params: {
            page: currentPage
          }
        })
        .then(res => {
          this.data = res.data.data;
          this.total = res.data.total;
        });
    }
  }
};
</script>
<style scoped>
.user {
  text-align: center;
}

.search {
  width: 500px;
  height: 50px;
  margin-bottom: 20px;
}

.addbtn {
  margin-bottom: 30px;
  float: left;
}

.searchinput {
  width: 300px;
  float: left;
}

.searchbtn {
  float: left;
  margin-left: 5px;
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

.role {
  font-size: 0.3rem;
  display: inline;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.editrole {
  width: 10rem;
  padding: 0.6rem 0.2rem;
  background: #ffffff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  border-radius: 0.1rem;
}

.editrole1 {
  width: 10rem;
  padding: 0.6rem 0.6rem;
  background: #ffffff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  border-radius: 0.1rem;
}

/*.editrole1 div {*/
/*margin-top: 0.2rem;*/
/*}*/

.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}
.editrole1 p {
  text-align: left;
  margin-left: 3.1rem;
  width: 6rem;
  font-size: 0.3rem;
  height: 0.6rem;
  line-height: 0.6rem;
}
</style>

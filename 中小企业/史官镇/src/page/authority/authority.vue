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
      <el-button type="primary" class="addbtn" @click="addrole()" icon="el-icon-plus">
        导航目录创建
      </el-button>
      <el-button type="primary" class="addbtn" @click="submenu()" icon="el-icon-plus">
        子菜单创建
      </el-button>
    </div>

    <el-table
      :data="data"
      border
      style="width:100%;">
      <el-table-column label="用户管理列表">
        <el-table-column
          prop="perm_name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="perm"
          label="代码字符串"
          align="center">
        </el-table-column>
        <el-table-column
          prop="p_name.perm_name"
          label="所属导航目录/子菜单列表"
          align="center">
        </el-table-column>
        <el-table-column prop="perm_type" label="标签类型" align="center">
          <template slot-scope="scope">
            <code>{{scope.row.perm_type?'限制权限':'公共权限'}}</code>

          </template>
        </el-table-column>
        <el-table-column prop="is_show" label="状态" align="center">
          <template slot-scope="scope">
            <div :style="{color: scope.row.is_show==1?'#4F4F4F':'red'}">{{scope.row.is_show?'显示':'隐藏'}}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <el-dropdown>
                          <span class="el-dropdown-link" style="font-size:12px;color:#409EFF">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.is_show?false:true">
                    <el-button @click="deleteClick(scope.$index, scope.row)" type="text">
                      删除
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button @click="hideClick(scope.$index, scope.row)" type="text">
                      {{scope.row.is_show?'隐藏':'显示'}}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>


    </el-table>

    <div class="mask" v-if="mask" @click="mask1"></div>
    <div class="editrole" v-if="mask3">
      <div>
        <div class="role"><span style="color: red;">*</span> 导航目录 ：</div>
        <el-input
          placeholder="请输入导航目录" style="width: 60%" v-model="inputRole">
        </el-input>
      </div>
      <el-button @click="submission()" type="primary" size="big" style="margin-top: 0.6rem;">保存提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>

    <div class="editrole1" v-if="mask2">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="子菜单列表:" prop="menu" style="width:300px">
          <el-select v-model="ruleForm.menu" placeholder="请选择">
            <el-option :label="val.perm_name" :value="val.id" v-for="val in menuList" :key="val.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标识名称 :" prop="identification" style="width: 480px">
          <el-input v-model="ruleForm.identification" placeholder="请输入标识名称"></el-input>
        </el-form-item>
        <el-form-item label="标识代码 :" prop="label" style="width: 480px">
          <el-input v-model="ruleForm.label" placeholder="请输入标识代码"></el-input>
        </el-form-item>
        <el-form-item label="类型 :" prop="tips" style="width:300px">
          <el-select v-model="ruleForm.tips" placeholder="请选择">
            <el-option v-for="(val,index) in menuList1" :label="val" :value="index" :key="val"></el-option>
          </el-select>
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
      menuList1: [],
      ruleForm: {
        menu: "",
        identification: "",
        tips: "",
        label: ""
      },
      //添加用户表单验证规则
      rules: {
        menu: [{ required: true, message: "请选择子菜单" }],
        identification: [
          { required: true, message: "请输入标识名称", trigger: "blur" }
        ],
        tips: [{ required: true, message: "请选择类型", trigger: "blur" }],
        label: [{ required: true, message: "请输入标识代码", trigger: "blur" }]
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
      this.$axios({
        method: "GET",
        url: "/api/sgzadmin/perm",        
        params: {
          page: this.page,
          name: this.name
        }
      }).then(res => {
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
    submenu() {
      this.inputRole = "";
      this.mask = true;
      this.mask2 = true;
    },
    addrole() {
      this.inputRole = "";
      this.mask = true;
      this.mask3 = true;
    },
    getMenuList() {
      this.$axios({
        method: "GET",
        url: "/api/sgzadmin/perm_info",       
      }).then(res => {
        this.menuList = res.data.p_name;
        this.menuList1 = res.data.p_type;
      });
    },
    hideClick(index, row) {
      if (row.is_show == 1) {
        this.is_show = 0;
      } else {
        this.is_show = 1;
      }
      this.$axios({
        method: "POST",
        url: "/api/sgzadmin/perm_release/" + row.id,        
        params: {
          is_show: this.is_show
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
            type: "success"
          });
        }
        this.getTableData();
      });
    },
    deleteClick(index, row) {
      this.$axios({
        method: "POST",
        url: "/api/sgzadmin/del_perm/" + row.id,       
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
      this.$axios({
        method: "POST",
        url: "/api/sgzadmin/add_navigation",        
        data: {
          perm_name: this.inputRole
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.mask3 = false;
          this.mask = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
        this.getTableData();
      });
    },
    submenu1() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$axios({
            method: "POST",
            url: "/api/sgzadmin/add_perm",            
            data: {
              parent_id: this.ruleForm.menu,
              perm_name: this.ruleForm.identification,
              perm: this.ruleForm.label,
              perm_type: this.ruleForm.tips
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
        .get("/api/sgzadmin/perm", {          
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
}

.editrole1 p {
  text-align: left;
  margin-left: 3.1rem;
  width: 6rem;
  font-size: 0.3rem;
  height: 0.6rem;
  line-height: 0.6rem;
}
.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}
</style>

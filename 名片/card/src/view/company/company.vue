<template>
    <div class="company">
        <el-card class="box-card">
            <!-- ID等于1 -->
            <div slot="header" class="clearfix" v-if='group_id==1'>
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
            <div v-if='group_id==1'>
                <el-table
                ref="testTable"
                :data="data"
                style="width:100%;"
                border
                :default-sort = "{prop: 'id', order: 'ascending'}" >
                    <el-table-column
                    prop="title"
                    label="标题"       
                    align="center">
                    </el-table-column>  
                    <el-table-column
                    prop="cover"
                    label="图片"                  
                    align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" style='width:50px;height:50px;'>
                    </template>
                    </el-table-column>                   
                    <el-table-column
                    prop="mobile"
                    label="手机号"               
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="tel"
                    label="电话"                  
                    align="center">
                    </el-table-column> 
                    <el-table-column
                    prop="address"
                    label="公司地址"                  
                    align="center">
                    </el-table-column> 
                    <el-table-column
                    prop="created_at"
                    label="创建时间"                  
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
                          <el-button type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-button @click="setRole(scope.$index, scope.row)" type="text">
                            分配账号
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
            </div> 
            <!-- ID等于1 -->             
            <!-- 分配账号 -->
            <el-dialog title="分配账号" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
                <el-form :model="form" :rules="rules">
                  <el-form-item label="手机号" :label-width="formLabelWidth" prop='mobile'>
                    <el-input v-model='form.mobile' ></el-input>
                  </el-form-item> 
                  <el-form-item label="密码" :label-width="formLabelWidth" prop='pwd'>
                    <el-input v-model='form.pwd' type='password'></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" :label-width="formLabelWidth" prop='pwd_repeat'>
                    <el-input v-model='form.pwd_repeat' type='password'></el-input>
                  </el-form-item>                 
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setcommit">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 分配账号 -->
            <!-- ID不等于1 -->
            <div slot="header" class="clearfix" v-if='group_id!=1'>
                <span>企业管理</span>               
            </div>   
            <div v-if='group_id!=1'>
                <el-form ref="form" :model="form" label-width="80px" :rules="rules" >
                     <el-form-item  prop='title'>
                       <el-tag>企业名称</el-tag>
                        <el-input v-model="form.title" style='width:40%'></el-input>
                    </el-form-item>
                    <el-form-item prop='address'>
                        <el-tag>企业地址</el-tag>
                        <el-input v-model="form.address" style='width:40%'></el-input>
                    </el-form-item>
                    <el-form-item prop='mobile'>
                      <el-tag>手机号码</el-tag>
                        <el-input v-model="form.mobile" style='width:40%'></el-input>
                    </el-form-item>                    
                    <div>
                        <el-form-item style="width:35%" prop='cover_url'>
                          <el-tag>上传图片</el-tag>
                        <div class="fileBox" style='display:inline-block;vertical-align:top'>
                            <span class="fileinput-button"> 
                            <img :src="srcOthers" alt="" width="80px" height="80px">
                            <input type="file" name="cover_url" id="photo" ref='cover_url' @change="getFile($event)" style='display:block;width:80px;height:80px;'>
                            </span>
                        </div>
                        </el-form-item>
                    </div>
                    <el-form-item prop='tel'>
                       <el-tag>电话号码</el-tag>
                        <el-input v-model="form.tel" style='width:40%' type="tell"></el-input>
                    </el-form-item>                                      
                    <el-form-item prop='introduction'>
                       <el-tag>企业描述</el-tag>
                        <el-input :rows="4" type="textarea" v-model="form.introduction" style='width:40%;vertical-align:top'></el-input>
                    </el-form-item>                               
                    <el-form-item style='margin-left:20%'>
                        <el-button type="primary" @click="onSubmit($event)" class='el-icon-edit-outline'>提交保存</el-button>
                        <!-- <el-button @click="cancle">取消</el-button> -->
                    </el-form-item>
                </el-form>  
            </div>  
            <!-- ID不等于1 -->                 
        </el-card>
    </div>
</template>
<script>
export default {
  name: "company",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      srcOthers: "",
      dialogFormVisible: false,
      group_id: "",
      id:'',
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
      form: {
        mobile: "",
        pwd: "",
        pwd_repeat: "",
        address: ""
      },
      formLabelWidth: "120px",
      rules: {
        pwd: [
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
    //获取token
    this.token = localStorage.getItem("token");
    //获取group_id
    this.group_id = localStorage.getItem("id");
    //获取数据
    this.getData();
    if (this.group_id != 1 || this.$route.params.id) {
      this.getData2();
    }
  },
  methods: {
    getData2() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios({
        method: "get",
        url: "/api/admin/merchant_info",
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1+json"
        },
        params: {
          id: this.$route.params.id
        }
      })
        .then(res => {
          if(res){
              loading.close();
          }
          this.form = res.data;
          this.srcOthers = res.data.cover_url;
          this.id = res.data.id;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getData() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios
        .get("/api/admin/merchant", {
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
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.currentPage = currentPage;
      this.$axios
        .get("/api/admin/merchant", {
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
      this.$router.push("/handlecom");
    },
    handleEdit(index, row) {
      this.$router.push("/handlecom/" + row.id);
    },
    handleDel(index, row) {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios({
        method: "post",
        url: "/api/admin/del_merchant/" + row.id,
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1+json"
        }
      })
        .then(res => {
          loading.close()
          if (res.data.status == 1) {
            
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.$router.push("/company"), this.getData();
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
    setRole(index, row) {
      this.dialogFormVisible = true;
      this.id = row.id;
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios({
        method: "get",
        url: "/api/admin/merchant_info",
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
          this.form = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    setcommit() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios({
        method: "post",
        url: "/api/admin/set_password/" + this.id,
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1+json"
        },
        data: {
          pwd: this.form.pwd,
          pwd_repeat: this.form.pwd_repeat
        }
      })
        .then(res => {
          loading.close()
          if (res.data.status == 1) {
            
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.$router.push("/company"), (this.dialogFormVisible = false);
            this.getData();
            (this.form.pwd = ""), (this.form.pwd_repeat = "");
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
    getFile(event) {
      let _this = this;
      var files = (this.form.cover_url = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers = this.result;
      };
    },
    onSubmit(event) {
      let formData = new FormData(this.$refs.form);
      formData.append("title", this.form.title);
      formData.append("mobile", this.form.mobile);
      formData.append("tel", this.form.tel);
      formData.append("cover_url", this.form.cover_url);
      formData.append("address", this.form.address);
      formData.append("introduction", this.form.introduction);
      this.$refs.form.validate(valid => {
        if (valid) {
           const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
          this.$axios({
            method: "post",
            url: "/api/admin/edit_merchant/"+this.id,
            headers: {
              Authorization: "Bearer " + this.token,
              Accept: "application/vnd.myapp.v1+json"
            },
            data: formData
          })
            .then(res => {
               loading.close()
              if (res.data.status == 1) {
               
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.$router.push("/company"), this.getData2();;
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
      });
    }
  }
};
</script>
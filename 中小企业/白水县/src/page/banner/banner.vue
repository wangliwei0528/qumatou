<template>
  <div class="banner">
    <!-- 添加按钮 -->
    <div>
      <el-button type="text" @click="addbanner" class="addbtn" icon="el-icon-plus">添加轮播图</el-button>
    </div>
    <el-table
      ref="testTable"
      :data="data"
      style="width:100%;"
      border
      :default-sort = "{prop: 'id', order: 'ascending'}" >
      <el-table-column label="轮播图列表" style="color:#000">
        <el-table-column
          prop="title"
          label="标题"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="img"
          label="图片"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.img" style='width:50px;height:50px'>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="update_time"
          label="更新时间"
          align="center"
        >
        </el-table-column> -->
        <el-table-column prop="status" label="标签类型" align="center" width="100" >
          <template slot-scope="scope">
            <div  :style="{color: scope.row.status==1?'#4F4F4F':'red'}">{{scope.row.status == 1?'显示':'隐藏'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="子类排序"
          align='center'>
          <template slot-scope="scope">
            <el-button
              type="primary"
              :disabled="scope.$index===0"
              @click="upload(scope.$index, scope.row)"
              size="small" >
              ↑
            </el-button>
            <el-button
              :disabled="scope.$index===(data.length-1)"
              @click="download(scope.$index, scope.row)"
              type="success"
              size="small">
              ↓
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"   type="text" size="small" >编辑</el-button>
            <el-button type="text" size="small">
              <el-dropdown>
                          <span class="el-dropdown-link" style="font-size:12px;color:#409EFF">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="small"  type="text" @click="show(scope.$index, scope.row)">{{scope.row.status == 1?'隐藏':'显示'}}</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button @click="handledDel(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                  </el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </el-button>

          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 添加banner -->
    <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref='form' :rules='rules'>
        <el-form-item label="标题" :label-width="formLabelWidth" prop='title'>
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <div class="img">
          <label for="imgpath" style="margin-right:10px">图片</label>
          <input type="file" name="imgpath" id="imgpath" ref='imgpath' @change="getFile($event)">
        </div> -->
        <div>
          <el-form-item label="选择banner图" style="width:35%" :label-width="formLabelWidth">
            <div class="fileBox">
              <span class="fileinput-button">
              <img :src="srcOthers2" alt="" width="178px" height="178px">
              <i class="el-icon-plus font"></i>
              <input type="file" name="imgpath" id="imgpath" ref='imgpath' @change="getFile($event)" style="width: 178px;height: 178px;">
              </span>
            </div>
          </el-form-item>
      </div>

        <!-- <label for="url">图片路径</label>
        <input type="file" name="url" id="url" ref='url' @change="getFiles($event)">   -->
        <el-form-item label="跳转地址" :label-width="formLabelWidth">
          <el-input v-model="form.url" auto-complete="off" placeholder="http://"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmitadd($event)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加banner -->
    <!-- 编辑banner -->
    <el-dialog title="编辑轮播图" :visible.sync="centerDialogVisible" width='40%'>
      <el-form :model="editdata" ref='formedit' :rules='rules'>
        <el-form-item label="标题" :label-width="formLabelWidth" prop='title'>
          <el-input v-model="editdata.title" auto-complete="off"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="原始图片" :label-width="formLabelWidth" >
            <div class='avatar'>
                <img :src="editdata.imgpath" alt="">
              </div>
          </el-form-item>
        </div>


        <div>
          <el-form-item label="选择banner图" :label-width="formLabelWidth">
            <div class="fileBox">
              <span class="fileinput-button">
              <img :src="srcOthers2" alt="" width="178px" height="178px">
              <i class="el-icon-plus font"></i>
              <input type="file" name="imgpath" id="imgpath" ref='imgpath' @change="getFile($event)" style="width: 178px;height: 178px;">
              </span>
            </div>
          </el-form-item>
      </div>
        <!-- <div class="imagepathc">
          <label for="imgpath" style='margin-left:12px'>图片</label>
          <input type="file" name="imgpath" id="imgpath" ref='imgpath' @change="getFile($event)">
        </div> -->

        <el-form-item label="跳转地址" :label-width="formLabelWidth">
          <el-input v-model="editdata.url" auto-complete="off" placeholder="http://"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmitedit($event)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑banner -->

  </div>
</template>
<script>
export default {
  data() {
    return {
      srcOthers2: "",
      //添加banner
      formLabelWidth: "120px",
      dialogFormVisible: false,
      centerDialogVisible: false,
      //提交值
      form: {
        title: "",
        imgpath: "",
        url: ""
      },
      //规则
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        imgpath: [{ required: true, message: "请输入图片", trigger: "blur" }]
        // url: [{ required: true, message: "请输入图片路径", trigger: "blur" }]
      },
      //数据
      data: [],
      //默认显示  1为显示 0为隐藏
      status: "1",
      //编辑的原始值
      editdata: {}
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
  },
  mounted() {
    this.date();
  },
  methods: {
    getData() {
      this.$axios({
        method: "get",
        url: "/api/admins/editarea",
        
      })
        .then(res => {
          this.data = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加
    addbanner() {
      this.dialogFormVisible = true;
    },
    //图片上传
    getFile(event) {
      let _this = this;
      var files = (this.form.imgpath = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers2 = this.result;
      };
      // this.form.imgpath = event.target.files[0];
    },
    onsubmitadd() {
      let formData = new FormData(this.$refs.form);
      formData.append("title", this.form.title);
      formData.append("imgpath", this.form.imgpath);
      formData.append("url", this.form.url);
      formData.append("type", 1);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/api/admins/add_editarea",
           
            data: formData
          })
            .then(res => {
              this.status_code = res.data.status;
              if (this.status_code == 1) {
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.$refs.imgpath.value = "";
                this.form.title = "";
                this.form.url = "";
                this.srcOthers2 = "";
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
          return false;
        }
      });
    },
    //编辑
    handleEdit(index, row) {
      this.id = row.id;
      this.centerDialogVisible = true;
      this.$axios({
        method: "get",
        url: "/api/admins/editaera_info",
       
        params: {
          id: row.id
        }
      })
        .then(res => {
          this.editdata = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onsubmitedit(event) {
      let formData = new FormData(this.$refs.formedit);
      formData.append("title", this.editdata.title);
      formData.append("imgpath", this.form.imgpath);
      formData.append("type", 1);
      this.$refs.formedit.validate(valid => {
        if (valid) {
          this.$axios({
            method: "POST",
            url: "/api/admins/edit_editarea/" + this.id,
            
            data: formData
          })
            .then(res => {
              this.status_code = res.data.status;
              if (this.status_code == 1) {
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.centerDialogVisible = false;
                this.srcOthers2 = "";
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
          return false;
        }
      });
    },
    //删除
    handledDel(index, row) {
      this.$axios({
        method: "post",
        url: "/api/admins/del_editarea/" + row.id,
       
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
    },
    //显示与隐藏
    show(index, row) {
      if (row.status == 1) {
        this.status = 0;
      } else {
        this.status = 1;
      }
      this.$axios({
        method: "POST",
        url: "/api/admins/editaera_isshow/" + row.id,
        
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
    },
    //排序上移
    upload(index, row) {
      this.id = row.id;
      this.$axios({
        method: "POST",
        url: "/api/admins/editarea_seq",
        
        data: {
          id: this.id,
          page: this.page,
          p: "up"
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
    },
    //排序  下移
    download(index, row) {
      this.id = row.id;
      this.$axios({
        method: "POST",
        url: "/api/admins/editarea_seq",
        
        data: {
          id: this.id,
          page: this.page,
          p: "down"
        }
      })
        .then(res => {
          this.status_code = res.data.status;
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
.avatar {
  margin-left: 0;
}
.avatar img {
  width: 178px;
  height: 178px;
}

.fileBox {
  width: 178px;
  height: 178px;
}

.fileinput-button {
  width: 178px;
  height: 178px;
  float: left;
  display: flex;
  /* margin-top: 10px;
  line-height: 150px; */
  position: relative;
  display: inline-block;
  overflow: hidden;
  color: #ccc;
  border: 1px solid #ccc;
  /*background: url(../../assets/img/addUpload.png) no-repeat;*/
  background-position: center 20px;
}
.fileinput-button input {
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
  -ms-filter: "alpha(opacity=0)";
}
.font {
  font-size: 20px;
  margin-top: 79px;
  margin-left: 79px;
}
</style>



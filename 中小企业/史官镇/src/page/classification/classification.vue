<template>
<div>
    <div>
      <el-button
      :label="val"
      v-for='(val, key,index) in typeValue'
      :key='index'
      @click='choose(key)'
      :class=" {active:index==dynamic}"
      style='margin-bottom:30px;margin-left:3px'
      >
      {{val}}
    </el-button>
  </div>
  <!-- 添加按钮 -->
  <div>
    <el-button type="text" @click="addcate" class="addbtn" icon="el-icon-plus">添加分类</el-button>
  </div>
   <!--树形表格  -->
  <div class="hello">
    <tree-grid
    :columns="columns"
    :tree-structure="true"
    :data-source="data"
    @editcate='editcate'
    @handleDelete='handleDelete'
    @upload='upload'
    @download='download'
    @mousedown='mousedown'
    @mouseup='mouseup'
    >
    </tree-grid>
  </div>
<!-- 编辑 -->
<el-dialog
  title="编辑分类"
  :visible.sync="centerDialogVisible"
  width=40%
  center>
  <el-form :model="editdata" :rules='rules' ref='form'>
    <el-form-item label="父级分类" :label-width="formLabelWidth" prop='pid'>
      <el-select v-model="editdata.pid" placeholder="请选择父级分类">
        <el-option
          v-for="item in catelist"
          :key="item.id"
          :label="item.cate_name"
          :value="item.id">
          {{item.cate_name}}
       </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分类名称" :label-width="formLabelWidth" prop='cate_name'>
      <el-input v-model="editdata.cate_name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="分类描述" :label-width="formLabelWidth" prop='cate_content'>
      <el-input v-model="editdata.cate_content" auto-complete="off" type="textarea" :rows="4"></el-input>
    </el-form-item>
    <div style="width:100%;height:200px;margin-bottom:30px" v-if='editdata.cate_image!="http://192.168.0.112:8085/"'>
        <div style="width:300px;height:200px;float:left">
          <div class="img" v-if='editdata.cate_image!="http://192.168.0.112:8085/"'>
          <el-form-item label="原始封面图" style="width:35%">
            <div class='avatar'>
                <img :src="editdata.cate_image" alt="">
            </div>
          </el-form-item>
        </div>
      </div>
      <div style="width:300px;height:200px;float:left">
          <div class="img" v-if='editdata.cate_banner!="http://192.168.0.112:8085/"'>
              <el-form-item label="原banner图" style="width:35%">
                <div class='avatar'>
                    <img :src="editdata.cate_banner" alt="">
                </div>
              </el-form-item>
          </div>
        </div>
    </div>

    <div style="width:100%;height:200px;margin-bottom:30px">
        <div style="margin-left:50px;width:300px;height:200px;float:left">
            <el-form-item label="选择封面图" style="width:35%">
              <div class="fileBox">
                <span class="fileinput-button">
                <img :src="srcOthers1" alt="" width="178px" height="178px">
                <i class="el-icon-plus font"></i>
                <input type="file" name="cate_image" id="cate_image" ref='cate_image' @change="getFiles($event)" style="width: 178px;height: 178px;">
                </span>
              </div>
            </el-form-item>
        </div>
        <div style="width:300px;height:200px;float:left">
            <el-form-item label="选择banner图">
              <div class="fileBox">
                <span class="fileinput-button">
                <img :src="srcOthers2" alt="" width="178px" height="178px">
                <i class="el-icon-plus font"></i>
                <input type="file" name="cate_banner" id="cate_banner" ref='cate_banner' @change="getFile($event)" style="width: 178px;height: 178px;">
                </span>
              </div>
            </el-form-item>
        </div>
    </div>


  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onsubmitedit">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑 -->

<!-- 添加分类 -->
  <el-dialog title="分类添加" :visible.sync="dialogFormVisible">
  <el-form :model="form" :rules='rules' ref='form'>
   <el-form-item label="父级分类" :label-width="formLabelWidth" prop='pid'>
      <el-select v-model="form.pid" placeholder="请选择父级分类">
        <el-option
          v-for="item in ptype"
          :key="item.id"
          :label="item.cate_name"
          :value="item.id">
          {{item.cate_name}}
       </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分类名称" :label-width="formLabelWidth" prop='cate_name'>
      <el-input v-model="form.cate_name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="分类描述" :label-width="formLabelWidth" prop='cate_content'>
      <el-input v-model="form.cate_content" auto-complete="off" type="textarea" :rows="4"></el-input>
    </el-form-item>
    <div style="width:100%;height:200px">
        <div style="width:300px;height:100%;margin-left:50px;float:left">
          <el-form-item label="选择封面图" style="width:35%">
            <div class="fileBox">
              <span class="fileinput-button">
              <img :src="srcOthers1" alt="" width="178px" height="178px" ref='img'>
              <i class="el-icon-plus font"></i>
              <input type="file" name="cate_image" id="cate_image" ref='cate_image' @change="getFiles($event)" style="width: 178px;height: 178px;">
              </span>
            </div>
          </el-form-item>
        </div>

      <div style="width:300px;height:100%;float:left">
          <el-form-item label="选择banner图" style="width:35%">
            <div class="fileBox">
              <span class="fileinput-button">
              <img :src="srcOthers2" alt="" width="178px" height="178px">
              <i class="el-icon-plus font"></i>
              <input type="file" name="cate_banner" id="cate_banner" ref='cate_banner' @change="getFile($event)" style="width: 178px;height: 178px;">
              </span>
            </div>
          </el-form-item>
      </div>
    </div>


  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmitadd($event)">确 定</el-button>
  </div>
</el-dialog>
<!-- 添加分类 -->
</div>

</template>
<script>
import TreeGrid from "@/components/treeTable/vue/TreeGrid";
export default {
  data() {
    return {
      srcOthers1: "",
      srcOthers2: "",
      state: true,
      //判断一级
      childreni: "",
      dynamic: 0,
      activeName: "",
      //编辑分类
      editdata: {},
      centerDialogVisible: false,
      cate_name: "",
      catelist: [],
      id: "",
      page: 1,
      //分类type
      typeValue: {},
      type: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        cate_name: "",
        pid: "",
        cate_image: "",
        cate_banner: "",
        type: "",
        cate_content: ""
      },
      rules: {
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        // pid: [{ required: true, message: "请选择父级分类", trigger: "change" }],
        cate_image: [
          { required: true, message: "请选择封面图", trigger: "change" }
        ],
        cate_banner: [
          { required: true, message: "请选择分类banner", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择分类类别", trigger: "change" }
        ],
        cate_content: [
          // { required: true, message: "请输入分类描述", trigger: "change" }
        ]
      },
      columns: [
        {
          text: "分类名称",
          dataIndex: "cate_name",
          width: "150"
        },
        {
          text: "创建时间",
          dataIndex: "create_time",
          width: "150"
        },
        {
          text: "更新时间",
          dataIndex: "update_time",
          width: "150"
        }
      ],
      //数据
      data: [],
      ptype: ""
    };
  },
  components: {
    TreeGrid
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
    this.getCate();
  },
  mounted() {
    this.date();
  },
  methods: {
    //获取type分类
    getCate() {
      this.$axios
        .get("/api/sgzadmin/cate_type")
        .then(res => {
          this.typeValue = res.data.cate_type;
        });
    },
    //选择类型获取type
    choose(key, index) {
      if (index == 1) {
        this.dynamic = index;
      }
      //点击添加字体颜色，其他的删除class名称
      this.dynamic = index;
      this.type = key;
      this.getType();
      this.getData();
    },
    addcate() {
      this.dialogFormVisible = true;
      this.getType();
    },
    //获取数据
    getData() {
      this.$axios
        .get("/api/sgzadmin/cate", {         
          params: {
            //默认展示type为1的数据
            type: this.type ? this.type : 1,
            page: this.page
          }
        })
        .then(res => {
          this.data = res.data.catlist;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取父级分类
    getType() {
      this.$axios({
        method: "get",
        url: "/api/sgzadmin/cate_list",        
        params: {
          //获取type 没有点击分类默认为1，点击后获取对应type
          type: this.type ? this.type : 1
        }
      })
        .then(res => {
          this.ptype = res.data.cagetories;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFiles(event) {
      let _this = this;
      var files = (this.form.cate_image = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers1 = this.result;
      };
      // this.form.cate_image = event.target.files[0];
    },
    getFile(event) {
      let _this = this;
      var files = (this.form.cate_banner = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers2 = this.result;
      };
      // this.form.cate_banner = event.target.files[0];
    },
    // 添加
    onSubmitadd(event) {
      let formData = new FormData(this.$refs.form);
      formData.append("cate_name", this.form.cate_name);
      formData.append("pid", this.form.pid ? this.form.pid : 0);
      formData.append("cate_content", this.form.cate_content);
      formData.append("cate_image", this.form.cate_image);
      formData.append("cate_banner", this.form.cate_banner);
      formData.append("type", this.type ? this.type : 1);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios({
            method: "POST",
            url: "/api/sgzadmin/add_cate",          
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
                this.getData();
                this.form.pid = "";
                this.form.cate_name = "";
                this.form.cate_content = "";
                this.srcOthers1 = "";
                this.srcOthers2 = "";
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
    //编辑  获取原数据
    editcate(index, row) {
      this.id = row.id;
      this.$axios({
        method: "get",
        url: "/api/sgzadmin/cate_list",        
        params: {
          //获取type 没有点击分类默认为1，点击后获取对应type
          type: this.type ? this.type : 1,
          id: row.id
        }
      })
        .then(res => {
          this.editdata = res.data;
          this.editdata.pid = res.data.pid == 0 ? "请选择" : res.data.pid;
          this.catelist = res.data.catelist;
          this.editdata.cate_content = res.data.cate_content
            ? res.data.cate_content
            : "";
        })
        .catch(err => {
          console.log(err);
        });
      this.centerDialogVisible = true;
      this.getType();
    },
    //提交修改
    onsubmitedit() {
      let formData = new FormData(this.$refs.form);
      formData.append("cate_name", this.editdata.cate_name);
      formData.append(
        "pid",
        this.editdata.pid == "请选择" ? 0 : this.editdata.pid
      );
      formData.append("cate_content", this.editdata.cate_content);
      formData.append("cate_image", this.form.cate_image);
      formData.append("cate_banner", this.form.cate_banner);
      formData.append("type", this.type ? this.type : 1);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios({
            method: "POST",
            url: "/api/sgzadmin/edit_cate/" + this.id,           
            data: formData
          })
            .then(res => {
              if (res.data.status == 1) {
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.centerDialogVisible = false;
                this.srcOthers1 = "";
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
    //鼠标按下抬起状态切换便于连续点击
    mousedown(index, row) {
      this.state = true;
    },
    mouseup(index, row) {
      this.state = false;
    },
    //排序上移
    upload(index, row) {
      this.id = row.id;
      this.$axios({
        method: "POST",
        url: "/api/sgzadmin/category_seq",        
        data: {
          id: this.id,
          page: this.page,
          p: "up"
        }
      })
        .then(res => {
          this.status_code = res.data.status;
          if (this.status_code == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.state = false;
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
        url: "/api/sgzadmin/category_seq",       
        data: {
          id: this.id,
          page: this.page,
          p: "down"
        }
      })
        .then(res => {
          this.status_code = res.data.status;
          if (this.status_code == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.state = false;
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
    //删除
    handleDelete(index, row) {
      this.$axios({
        method: "POST",
        url: "/api/sgzadmin/del_cate/" + row.id,      
      })
        .then(res => {
          this.status_code = res.data.status;
          if (this.status_code == 1) {
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
.upload-demo {
  position: relative;
}
.upload-demobox {
  display: block;
  width: 360px;
  height: 180px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.avatar img {
  width: 178px;
  height: 178px;
}
.img {
  margin-left: 50px;
}
.active {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-button：link {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-button：visited {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-button：hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.el-button:active {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
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

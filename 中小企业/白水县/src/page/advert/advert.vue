<template>
  <div class="adv">
    <!-- 顶部按钮 -->
    <div class="search">
      <el-button type="text" @click="centerDialogVisible = true" class="addbtn" icon="el-icon-plus">添加广告</el-button>
      <div class="searchinput">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model.trim="name"
          @keyup.enter.native="getData"
        >
        </el-input>
      </div>
      <el-button icon="el-icon-search" type="primary" class="searchbtn" @click=getData>搜索</el-button>
    </div>

    <el-table
      ref="testTable"
      :data="data"
      style="width:100%;"
      border
      :default-sort="{prop: 'id', order: 'ascending'}">
      <el-table-column label="广告列表" style="color:#000">
        <el-table-column
          prop="title"
          label="标题"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ad_cover"
          label="广告封面图"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.cover" style='width:50px;height:50px'>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="ad_url"
          label="广告URL"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="prices"
          label="价格"
          width="180"
          align="center">
        </el-table-column> -->
        <el-table-column
          prop="add_time"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handledDel(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
    <!-- 分页设置 -->
    <!-- 添加广告 -->
    <el-dialog
      title="添加广告"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :rules="rules" ref='form' :model="form">
        <el-form-item label="广告标题" prop='title'>
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <div>
          <el-form-item label="选择banner图">
            <div class="fileBox">
                      <span class="fileinput-button">
                      <img :src="srcOthers2" alt="" width="178px" height="178px">
                      <i class="el-icon-plus font"></i>
                      <input type="file" name="ad_cover" id="ad_cover" ref='imgpath' @change="getFile($event)"
                             style="width: 178px;height: 178px;">
                      </span>
            </div>
          </el-form-item>
        </div>
        <!-- <div class="img">
          <label for="ad_cover" prop="ad_cover">图片</label>
           <input type="file" name="ad_cover" id="ad_cover" ref='imgpath' @change="getFile($event)">
        </div>               -->

        <!-- <label for="url">图片路径</label>
        <input type="file" name="url" id="url" ref='url' @change="getFiles($event)">   -->
        <!-- <el-form-item label="跳转地址">
          <el-input v-model="form.ad_url" auto-complete="off" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="广告价格" prop="price">
          <el-input v-model="form.price" type="number" placeholder="请输入价格"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addadv">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 添加广告 -->
    <!-- 编辑广告 -->
    <el-dialog
      title="编辑广告"
      :visible.sync="dialogFormVisible"
      width="40%"
      center>
      <el-form ref='form' :model="form">
        <el-form-item label="广告标题" prop='title'>
          <el-input v-model="editdata.title"></el-input>
        </el-form-item>


        <div style="margin-bottom:20px">
          <el-form-item label="原图片">
            <div class="fileBox">
              <div>
                <img :src="editdata.ad_cover" alt="" style='width:178px;height:158px'>
              </div>
            </div>
          </el-form-item>
        </div>

        <div style="margin-top:20px">
          <el-form-item label="选择banner图">
            <div class="fileBox">
                      <span class="fileinput-button">
                      <img :src="srcOthers2" alt="" width="178px" height="178px">
                      <i class="el-icon-plus font"></i>
                      <input type="file" name="ad_cover" id="ad_cover" ref='imgpath' @change="getFile($event)"
                             style="width: 178px;height: 178px;">
                      </span>
            </div>
          </el-form-item>
        </div>
        <!-- <div class="img">
          <label for="ad_cover" prop="ad_cover">图片</label>
           <input type="file" name="ad_cover" id="ad_cover" ref='imgpath' @change="getFile($event)">
        </div>               -->

        <!-- <label for="url">图片路径</label>
        <input type="file" name="url" id="url" ref='url' @change="getFiles($event)">   -->
        <!-- <el-form-item label="跳转地址">
          <el-input v-model="editdata.ad_url" auto-complete="off" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="广告价格" prop="price">
          <el-input v-model="editdata.price" type="number" placeholder="请输入价格"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onsubmitedit($event)">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑广告 -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formLabelWidth: "120px",
        srcOthers2: '',
        editdata: "",
        //数据
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
        centerDialogVisible: false,
        dialogFormVisible: false,
        name: '',
        form: {
          title: "",
          ad_cover: "",
          // ad_url: "",
          // price: ""
        },
        rules: {
          title: [{ message: "请输入标题", trigger: "blur"}],
          ad_cover: [
            {required: true, message: "请选择封面图", trigger: "blur"}
          ],
          price: [{ message: "请输入价格", trigger: "blur"}]
        }
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
          url: "/api/admins/advert",          
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
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        this.$axios
          .get("/api/admins/advert", {            
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
      //添加
      getFile(event) {
        let _this = this;
        var files = (this.form.ad_cover = event.target.files[0]);
        if (!event || !window.FileReader) return; // 看支持不支持FileReader
        let reader = new FileReader();
        reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
        reader.onloadend = function () {
          _this.srcOthers2 = this.result;
        };
        // this.form.ad_cover = event.target.files[0];
      },
      addadv() {
        let formData = new FormData(this.$refs.form);
        formData.append("title", this.form.title);
        formData.append("ad_cover", this.form.ad_cover);
        // formData.append("ad_url", this.form.ad_url);
        // formData.append("price", this.form.price);
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$axios({
              method: "post",
              url: "/api/admins/add_advert",             
              data: formData
            })
              .then(res => {
                  console.log(res)
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.centerDialogVisible = false;
                  this.form.title = '';
                  this.$refs.imgpath.value = '';
                  this.form.ad_url = '';
                  this.form.price = '';
                  this.srcOthers2 = ''
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
        this.id = row.id
        this.dialogFormVisible = true;
        this.$axios({
          method: "get",
          url: "/api/admins/advert_info",
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
        let formData = new FormData(this.$refs.form);
        formData.append("title", this.editdata.title);
        formData.append("ad_cover", this.form.ad_cover);
        // formData.append("ad_url", this.editdata.ad_url);
        // formData.append("price", this.editdata.price);
        this.$axios({
          method: "post",
          url: "/api/admins/edit_advert/" + this.id,         
          data: formData
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.dialogFormVisible = false;
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
      },
      //删除
      handledDel(index, row) {
        this.$axios({
          method: "post",
          url: "/api/admins/del_advert/" + row.id,          
        })
          .then(res => {

            if (res.data.status == 1) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              (this.centerDialogVisible = false), this.getData();
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

  .fileBox {
    width: 178px;
    height: 178px;
  }

  .fileinput-button {
    width: 178px;
    height: 178px;
    float: left;
    display: flex;
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

  .block {
    margin-top: 0.8rem;
    width: 100%;
    text-align: center;
  }
</style>



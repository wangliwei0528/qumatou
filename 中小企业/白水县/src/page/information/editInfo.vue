<template>
  <div class="addInfo">
    <el-form ref="form" :model="data" label-width="80px" :rules='rules'
             style="width:60%;margin:0 auto;background:#fff;padding:50px">
      <el-form-item label="标题" prop='title'>
        <el-input v-model="data.title"></el-input>
      </el-form-item>
      <el-form-item label="编辑" prop='edit'>
        <el-input v-model="data.author" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop='source'>
        <el-input v-model="data.source" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="所属分类">
        <el-select v-model="data.cateid" placeholder="请选择">
          <el-option
            v-for="item in cate"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="原封面图" style="width:35%">
        <div class='avatar'>
          <img :src="data.img_path" alt="">
        </div>
      </el-form-item>

      <div>
        <el-form-item label="封面图" style="width:35%" prop="img_path">
          <div class="fileBox">
            <span class="fileinput-button">
            <img :src="srcOthers" alt="" width="178px" height="178px">
            <i class="el-icon-plus font"></i>
             <input type='file' name='img_path' ref='img_path' @change="getFile($event)"
                    style="width: 178px;height: 178px;">
            </span>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="内容" prop='content'>
        <quill-editor class="appwrapper" v-model="data.content" style='height:200px'>
        </quill-editor>
      </el-form-item>

      <el-form-item style='margin-top:150px'>
        <el-button type="primary" @click="onSubmit($event)">提交修改</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //分类
      srcOthers: "",
      data: {},
      cate: [],
      cateid: "",
      value: "",
      form: {
        title: "",
        cateid: "",
        img_path: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        cateid: [
          { required: true, message: "请输入所属分类", trigger: "change" }
        ],
        img_path: [
          { required: true, message: "请输入封面图", trigger: "change" }
        ],
        author: [{ message: "请输入编辑人", trigger: "blur" }],
        source: [{ message: "请输入文章来源", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }]
      }
    };
  },
  created() {
    this.form = this.data;
    this.token = localStorage.getItem("token");
    this.getValue(this.$route.params.id);
  },
  mounted() {
    this.date();
  },
  methods: {
    //获取原始数据
    getValue(id) {
      this.token = localStorage.getItem("token");
      this.$axios({
        method: "get",
        url: "/api/admins/news_info",
        
        params: {
          id: id
        }
      })
        .then(res => {
          for (let k in res.data) {
            res.data[k] = res.data[k] == "undefined" ? "" : res.data[k];
          }
          this.data = res.data;
          // console.log(this.data)
          this.cate = res.data.cate;
          this.cateid = res.data.cateid;
        })
        .catch(err => console.log(err));
    },
    getFile(event) {
      let _this = this;
      var files = (this.form.img_path = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers = this.result;
      };
    },
    cancle() {
      this.$router.push("/information");
    },
    onSubmit(event) {
      let formData = new FormData(this.$refs.form);
      formData.append("title", this.data.title);
      formData.append("img_path", this.form.img_path);
      formData.append("cateid", this.data.cateid);
      formData.append("author", this.data.author);
      formData.append("source", this.data.source);
      formData.append("content", this.data.content);
      this.$axios({
        method: "post",
        url: "/api/admins/edit_news/" + this.$route.params.id,
       
        data: formData
      })
        .then(res => {
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.$router.push("/information");
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
<style>
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


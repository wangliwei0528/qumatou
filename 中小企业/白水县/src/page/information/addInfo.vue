<template>
  <div class="addInfo">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
      <el-form-item label="标题" prop='title'>
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="编辑" prop='edit'>
        <el-input v-model="form.edit" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop='source'>
        <el-input v-model="form.source" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop='cateid'>
        <el-select v-model="form.cateid" placeholder="请选择">
          <el-option
            v-for="(item,key) in type"
            :key="key"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <div>
          <el-form-item label="封面图" prop="img_path">
            <div class="fileBox">
              <span class="fileinput-button">
              <img :src="srcOthers2" alt="" width="178px" height="178px">
              <i class="el-icon-plus font"></i>
              <input type='file' name='img_path' @change="getFile($event)" style="width: 178px;height: 178px;">
              </span>
            </div>
          </el-form-item>
      </div>

      <el-form-item label="内容" prop='content'>
        <!-- <quill-editor class="appwrapper" v-model="form.content"  uploadUrl='/api/api/upload'>
        </quill-editor> -->

        <div>
          <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            name="img"
            :show-file-list="false"
            :headers='header'
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload">
          </el-upload>
          <!--富文本编辑器组件-->
          <quill-editor
            class="editor"
            v-model="form.content"
          >
            <!--ref="myQuillEditor"-->
            <!--:options="editorOption"-->
            <!--@change="onEditorChange($event)"-->
          </quill-editor>

        </div>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {     
      srcOthers2: "",
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: "", // 这里写你要上传的图片服务器地址
      header: { token: localStorage.getItem("token") }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      detailContent: "", // 富文本内容
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          imageResize: {},
          ImageExtend: {
            loading: true,
            name: "img",
            size: 1, // 单位为M, 1M = 1024KB
            sizeError: () => {
              alert("图片过大！");
            } // 图片超过大小的回调
          },
          toolbar: {
            handlers: {
              image: function(value) {
                if (value) {
                  console.log(value);
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      //分类
      type: "",
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
        edit: [{ message: "请输入编辑人", trigger: "blur" }],
        source: [{ message: "请输入文章来源", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }]
      }
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getCate();
    this.getheader();
  },
  mounted() {
    this.date();
  },
  methods: {
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    onEditorChange() {
      // console.log(123)
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      console.log(this.$refs);
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      console.log(res);
      if (res) {
        console.log(res);
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", res);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    //获取header
    getheader() {
      this.header = {
        Authorization: "Bearer " + this.token
      };
    },
    //获取所属分类
    getCate() {
      this.$axios({
        method: "get",
        url: "/api/admins/news_info",
       
      })
        .then(res => {
          this.type = res.data.cate;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFile(event) {
      let _this = this;
      var files = (this.form.img_path = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers2 = this.result;
      };
      // this.form.img_path = event.target.files[0];
    },
    cancle() {
      this.$router.push("/information");
    },
    onSubmit() {
      this.getCate();
      let formData = new FormData(this.$refs.form);
      formData.append("title", this.form.title);
      formData.append("content", this.form.content);
      formData.append("cateid", this.form.cateid);
      formData.append("author", this.form.edit);
      formData.append("source", this.form.source);
      formData.append("img_path", this.form.img_path);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/api/admins/add_news",
            
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
                this.$cmessage({
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
    }
  }
};
</script>
<style scoped>
.addInfo {
  width: 100%;
  background: #fff;
  padding: 40px;
}
.editor {
  width: 100%;
  height: 260px;
}
.btn {
  margin-top: 140px;
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


<template>
    <div class="adduser">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{this.$route.params.id ?'编辑用户':'添加用户'}}</span>               
            </div>  
            <div class="forms">
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="企业ID" v-if='group_id==1' prop='merchant_id' style='margin-top:50px'>
                        <el-select v-model="form.merchant_id" placeholder="企业ID">
                            <el-option 
                            v-for='item in form.merchlist' 
                            :key='item.id' 
                            :label="item.title"
                            :value="item.id">
                            </el-option>                        
                        </el-select>                        
                    </el-form-item>     
                    <el-form-item label="昵称" prop='nickname'>
                        <el-input v-model="form.nickname" style='width:40%'></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop='mobile'>
                        <el-input v-model="form.mobile" style='width:40%'></el-input>
                    </el-form-item>                    
                    <div>
                        <el-form-item label="头像" style="width:35%" prop='avatar'>
                        <div class="fileBox">
                            <span class="fileinput-button"> 
                            <img :src="srcOthers" alt="" width="80px" height="80px">
                            <input type="file" name="avatar" id="photo" ref='avatar' @change="getFile($event)" style='display:block;width:80px;height:80px;'>
                            </span>
                        </div>
                        </el-form-item>
                    </div>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model="form.email" style='width:40%' type="email"></el-input>
                    </el-form-item>
                    <el-form-item label="微信" prop='wx'>
                        <el-input v-model="form.wx" style='width:40%'></el-input>
                    </el-form-item>
                    <el-form-item label="职务" prop='post'>
                        <el-input v-model="form.post" style='width:40%'></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop='describe'>
                        <!-- <el-input :rows="4" type="textarea" v-model="form.describe" style='width:40%'></el-input> -->
                        <div style='margin-top:-25px'>
                            <!-- 图片上传组件辅助-->
                            <el-upload
                              class="avatar-uploader"
                              action="/api/admin/upload"
                              name="img"
                              :show-file-list="false"
                              :headers='header'
                              :on-success="uploadSuccess"
                              :on-error="uploadError"
                              :before-upload="beforeUpload">
                            </el-upload>
                            <!--富文本编辑器组件-->
                            <quill-editor
                              class="editor appwrapper"
                              style='width:60%;'
                              v-model="form.describe"
                              ref="myQuillEditor"
                              :options="editorOption"
                              @change="onEditorChange($event)"
                            >
                            </quill-editor>  
                      </div>
                    </el-form-item>                               
                    <el-form-item style='margin-top:80px'>
                        <el-button type="primary" @click="onSubmit($event)" class='el-icon-edit-outline'>提交保存</el-button>
                        <el-button @click="cancle">取消</el-button>
                    </el-form-item>
                </el-form>     
            </div>                
        </el-card>
    </div>
</template>
<script>
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
export default {
  name: "adduser",
  data() {
    return {
      srcOthers: "",
      formLabelWidth: "400px",
      group_id: "",
      data: "",
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: "", // 这里写你要上传的图片服务器地址
      header: { token: localStorage.getItem("token") }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      detailContent: "", // 富文本内容
      editorOption: {}, // 富文本编辑器配置
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  // alert(1)
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      form: {
        nickname: "",
        mobile: "",
        avatar: "",
        email: "",
        wx: "",
        post: "",
        describe: "",
        merchant_id: ""
      },
      rules: {
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, message: "请输入不少于2个字符", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ],
        wx: [{ required: true, message: "请输入微信号", trigger: "blur" }],
        post: [{ required: true, message: "请输入职务", trigger: "blur" }],
        describe: [{ required: true, message: "请输入描述", trigger: "blur" }],
        merchant_id: [
          { required: true, message: "请选择企业", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.group_id = localStorage.getItem("id");
    this.getData();
    this.getheader();
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
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      // console.log(res)
      if (res) {
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
    //获取企业ID 获取编辑元数据
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$axios
        .get("/api/admin/user_info", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          params: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          if (res) {
            loading.close();
          }
          this.form = res.data;
          this.srcOthers = res.data.avatar;
        })
        .catch(err => console.log(err));
    },
    cancle() {
      this.$router.push("/user");
    },
    getFile(event) {
      let _this = this;
      var files = (this.form.avatar = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers = this.result;
      };
    },
    onSubmit(event) {
      let formData = new FormData(this.$refs.form);
      formData.append("nickname", this.form.nickname);
      formData.append("mobile", this.form.mobile);
      formData.append("email", this.form.email);
      formData.append("wx", this.form.wx);
      formData.append("post", this.form.post);
      formData.append("avatar", this.form.avatar);
      formData.append("describe", this.form.describe);
      formData.append("merchant_id", this.form.merchant_id);
      this.$refs.form.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          if (this.$route.params.id) {
            this.$axios({
              method: "POST",
              url: "/api/admin/edit_user/" + this.$route.params.id,
              headers: {
                Authorization: "Bearer " + this.token,
                Accept: "application/vnd.myapp.v1+json"
              },
              data: formData
            })
              .then(res => {
                loading.close();
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.$router.push("/user"), this.getData();
                  formData = null;
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
              method: "POST",
              url: "/api/admin/add_user",
              headers: {
                Authorization: "Bearer " + this.token,
                Accept: "application/vnd.myapp.v1+json"
              },
              data: formData
            })
              .then(res => {
                loading.close();
                if (res.data.status == 1) {
                  this.$message({
                    message: res.data.message,
                    type: "success"
                  });
                  this.$router.push("/user"), this.getData();
                  formData = null;
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
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

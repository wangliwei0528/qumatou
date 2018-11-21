<template>
  <div class="edituser" style="width:80%;margin:0 auto;background:#fff;padding:50px">
    <el-form ref="form" :model="data" label-width="100px" :rules="rules" >
      <el-form-item label="昵称" style="width:35%" prop="nickname">
        <el-input v-model="data.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" style="width:35%" prop="email">
        <el-input v-model="data.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" style="width:35%" prop="phone">
        <el-input v-model="data.phone"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="width:35%" prop="sex">
        <el-radio-group v-model="data.sex">
          <el-radio :label="0" :value='sex'>保密</el-radio>
          <el-radio :label="1" :value='sex'>男</el-radio>
          <el-radio :label="2" :value='sex'>女</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 获取原头像 -->
      <div v-if='data.avatar!="http://192.168.0.112:8085/"'>
        <el-form-item label="原头像" style="width:35%">
          <div class='avatar'>
            <img :src="data.avatar" alt="">
          </div>
        </el-form-item>
      </div>


      <!-- 获取原头像 -->
      <!-- 上传头像 -->
      <div>
        <el-form-item label="头像" style="width:35%">
          <div class="fileBox">
            <span class="fileinput-button">
            <img :src="srcOthers" alt="" width="178px" height="178px">
            <i class="el-icon-plus font"></i>
             <input type="file" name="avatar" id="photo" ref='avatar' @change="getFile($event)" style="width: 178px;height: 178px;">
            </span>
        </div>
        </el-form-item>
      </div>

      <!-- 个人签名 -->

      <el-form-item label="个人签名" style="width:50%" prop="sign" class='sign'>
        <textarea type="textarea" v-model="data.sign" ></textarea>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit($event)">立即修改</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "editUser",
  data() {
    return {
      srcOthers: "",
      data: {},
      sex: "",
      src: "",
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        nickname: "",
        email: "",
        sex: "",
        phone: "",
        sign: "",
        avatar: ""
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
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
          // { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '不允许输入空格等特殊符号' }
        ],
        sign: [{ required: true, message: "请输入个人签名", trigger: "blur" }]
        // avatar: [{ required: true, message: "请上传头像", trigger: "blur" }]
      }
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getValue(this.$route.params.id);
  },
  mounted() {
    this.date();
  },
  methods: {
    cancle() {
      this.$router.push("/user");
    },
    //获取对应ID的原始值
    getValue(id) {
      this.token = localStorage.getItem("token");
      this.$axios({
        method: "get",
        url: "/api/admins/user_info/" + id,
        
      })
        .then(res => {
          this.data = res.data;
          this.sex = res.data.sex;
        })
        .catch(err => console.log(err));
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
    //提交修改上传
    onSubmit(event) {
      let formData = new FormData(this.$refs.form);
      formData.append("nickname", this.data.nickname);
      formData.append("email", this.data.email);
      formData.append("phone", this.data.phone);
      formData.append("sex", this.data.sex);
      formData.append("sign", this.data.sign);
      formData.append("avatar", this.form.avatar);
      this.$refs.form.validate(valid => {
        if (valid) {
          //获取要修改的数据的id
          let id = this.$route.params.id;
          this.token = localStorage.getItem("token");
          this.$axios({
            method: "POST",
            url: "/api/admins/edit_user/" + this.$route.params.id,
           
            data: formData
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
textarea {
  display: block;
  width: 100%;
  height: 100px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 10px;
  margin-top: 20px;
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
.font{
  font-size:20px;
  margin-top:79px;
  margin-left:79px;
}
</style>

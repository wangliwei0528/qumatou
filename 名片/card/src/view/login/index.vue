<template>
    <div class="bg">
        <div class="login-wrap">
            <h3>欢迎登录</h3>
            <h3>企业名片系统</h3>
            <el-form ref="form" :model="form" :rules="rules" label-width="0px">
                <el-form-item prop="mobile">
                    <i class='iconfont icon-shouji'></i>
                    <el-input placeholder="输入手机号" v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <i class='iconfont icon-mima'></i>
                    <el-input placeholder="输入密码" v-model="form.password" type="password" @keyup.enter.native="login"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-row type="flex" justify="space-between">
                        <el-checkbox v-model="isMemery" style="color:#eee">记住密码</el-checkbox>
                        <a href="javascript:;" @click.prevent="openMsg"  style="color:#eee">忘记密码</a>
                    </el-row>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="login" :plain="true" >欢迎登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 粒子漂浮物 -->
        <vue-particles
                color="#fff"
                :particleOpacity="0.7"
                :particlesNumber="30"
                shapeType="star"
                :particleSize="5"
                linesColor="#fff"
                :linesWidth="2"
                :lineLinked="true"
                :lineOpacity="0.4"
                :linesDistance="150"
                :moveSpeed="3"
                :hoverEffect="true"
                hoverMode="grab"
                :clickEffect="true"
                clickMode="push"
        >
        </vue-particles>

    </div>
</template>
<script>
export default {
  name: "signin",
  data() {
    var checkone = (rule, value, callback) => {
      let regphone = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
      if (value === "") {
        callback(new Error("请输入正确的手机号"));
      } else {
        if (!isNaN(value)) {
          if (!regphone.test(value)) {
            callback(new Error("请输入正确的手机号"));
            return false;
          }
          callback();
        }
      }
    };
    return {
      form: {
        mobile: "",
        password: ""
      },
      isMemery: false,
      rules: {
        mobile: [
          {
            required: true,
            message: this.$t("m.login.mobile_tip"),
            trigger: "blur",
            validator: checkone
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("m.login.password_tip"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    
  },
  methods: {    
    login() {
      console.log(1)
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            mobile: this.form.mobile,
            password: this.form.password
          };
          this.$axios.post("/api/admin/login", data).then(res => {
            this.token = res.data.token;
            this.title = res.data.title;
            this.wz_name = res.data.wz_name;
            this.data = res.data;
            if (res.data.status_code == 200) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.$router.push("/home");
              localStorage.setItem("token", this.token);
              localStorage.setItem("title", this.title);
              localStorage.setItem("wz_name", this.wz_name);
              // this.getid()
            } else if (
              res.data.status == 0 &&
              res.data.message == "站点已关闭"
            ) {
              this.$router.push("/close");
            } else {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    }
    // openMsg() {
    //   // 注意这里使用了国际化
    //   this.$message.warning(this.$t("m.login.info"));
    // }
  },
  watch: {
    isMemery(n, o) {
      if (n) {
        localStorage.userInfo = this.form.name;
        localStorage.passwordInfo = this.form.password;
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("passwordInfo");
      }
    }
  }
};
</script>
<style scoped lang="less">
.bg {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../assets/img/sky.jpg");
  background-position: 20% 10%;
  background-size: cover;
  #particles-js {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.login-wrap {
  width: 330px;
  border-radius: 5px;
  padding: 20px;
  z-index: 3;
  background: rgba(216, 220, 229, 0.5);
  .el-form-item {
    margin-bottom: 25px !important;
  }
  h3 {
    text-align: center;
    color: #ebedef;
    margin-top: 0px;
    margin-bottom: 5px;
    span {
      color: #20a0ff;
    }
  }
  form {
    margin-top: 25px;
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  a {
    text-decoration: none;
    color: #1f2d3d;
  }
  button {
    width: 100%;
    font-weight: 600;
  }
}
.el-input {
  position: relative;
}
i {
  position: absolute;
  top: 0;
  right: 10px;
  z-index: 1;
  color: #9fa2a7;
}
</style>

<template>
  <div>
    <div class="all">
      <div style="font-weight: 500;font-size: 0.38rem">中小型企业管理</div>
      <div style="font-weight: 400;font-size: 0.36rem">登录你的帐号</div>
      <div><span style="font-size: 0.3rem">帐号 ：</span>
        <el-input placeholder="请输入你的账号" type="username" id="username" v-model="username" clearable
                  maxlength="11" @keyup.enter.native="login" @blur="check"></el-input>
      </div>
      <p id='checkUserNameResult'></p>
      <div><span style="font-size: 0.3rem">密码 ：</span>
        <el-input placeholder="请输入你的密码" type="password" id="password" v-model="password" clearable
                  maxlength="20" @keyup.enter.native="login" @blur="check" ></el-input>
      </div>
      <p id="checkPasswordResult"></p>
      <div>
        <el-button type="primary" @click="login()">登录</el-button>
      </div>

    </div>
  </div>
</template>

<script>
$("el-input").blur(function() {
  $("el-input").css("background", "red");
});
export default {
  name: "hello",
  data() {
    return {
      username: "",
      password: "",
      data: "",
      wz_name:'',
      token:'',
      date:''
    };
  },
  created() {
    localStorage.removeItem("token");
  },
  methods: {
    login() {
      let validate = this.check();
      if (validate) {
        let data = {
          name: this.username,
          password: this.password
        };
        this.$axios.post("/api/admins/login", data).then(res => {
          console.log(res);
          this.data = res.data;
          this.token = res.data.token;
          this.wz_name = res.data.wz_name;
          this.date=res.data.expires_in;
          if (res.data.status_code == 200) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.$router.push("/Home");
            localStorage.setItem("token", this.token);
            localStorage.setItem("wz_name", this.wz_name);
            localStorage.setItem("date", this.date);
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        });
      }
    },
    check() {
      var $username = document.getElementById("username").value;
      var $userpwd = document.getElementById("password").value;
      var checkPasswordResult = document.getElementById("checkPasswordResult");
      if ($username == "") {
        checkUserNameResult.innerHTML = "*用户名不能为空";
        return false;
      } else if (/^[A-Za-z\u4e00-\u9fa5]\{1\}[\s\S]*$/.test($username)) {
        checkUserNameResult.innerHTML = "*用户名格式不正确";
        return false;
      } else if ($userpwd == "") {
        checkPasswordResult.innerHTML = "*密码不能为空";
        return false;
      } else if ($userpwd.length < 6 || $userpwd.length > 20) {
        checkPasswordResult.innerHTML = "*密码6-20个字符之间";
        return false;
      } else {
        checkUserNameResult.innerHTML = "";
        checkPasswordResult.innerHTML = "";
        return true;
      }
    }
  }
};
</script>

<style scoped>
a * {
  margin: 0px;
  padding: 0px;
}

.all {
  padding: 0.1rem 0.2rem;
  color: #ffffff;
  width: 9.5rem;
  padding-bottom: 0.5rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  position: relative;
  margin-left: 50%;
  margin-top: 25%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0.3rem #0f0f0f;
}

.all div:nth-child(1) {
  margin-top: 0.3rem;
}

.all div:nth-child(2) {
  margin-top: 0.3rem;
}

p {
  height: 0.2rem;
  margin: 0.3rem 0.3rem 0 3.3rem;
  color: #ff0005;
  font-size: 0.26rem;
  text-align: left;
}

.el-button {
  padding: 0.18rem 0.46rem;
  margin-top: 0.3rem;
  font-size: 0.3rem;
}

.el-input {
  padding: 0 0.1rem;
  height: 0.6rem;
  width: 4rem;
}
</style>

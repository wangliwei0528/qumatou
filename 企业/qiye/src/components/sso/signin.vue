<template>
	<div class="sso-box" v-layout data-bg="sso">
		<div class="centered-box">
			<div class="userlogin">用户登录</div>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="手机" prop="mobile">
					<el-input v-model.trim="form.mobile" clearable placeholder="请输入手机号码" :maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input type="password" v-model.trim="form.pwd" clearable placeholder="请输入帐号密码" :maxlength="20" @keyup.enter.native='handleSignin()'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSignin()" style='width:100%'>登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
// import sso from '@/apis/sso.js'
export default {
	name: 'signin',
	data() {
		return {			
			form: {
				mobile: '',
				pwd: ''
			},
			rules: {
				mobile: [
					{ required: true, message: '手机不能为空', trigger: 'blur' },
					{ min: 11, max: 11, message: '长度 11 个字符', trigger: 'blur' }
				],
				pwd: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			}
		}
	},
	methods:{
		handleSignin(){
			let data={
				mobile:this.form.mobile,
				pwd:this.form.pwd
			}
			this.$axios({
				method:'post',
				url:'/api/company/login',
				data:data
			})
			.then(res=>{
				console.log(res)
				if (res.data.status == 1) {
                this.$router.push("/home");
                localStorage.setItem('token',res.data.token)
                localStorage.setItem('date',res.data.date)
                this.$message({
                    message: res.data.message,
                    type: "success"
                  });
              } else {
                this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
              }
			})
			.catch(err=>{
				console.log(err)
			})
		}
	},
}
</script>

<style scoped>
</style>
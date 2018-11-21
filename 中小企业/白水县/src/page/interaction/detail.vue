<template>
  <div>
    <el-form  label-width="80px" :model="detaildata" style="width:60%;margin:50px auto;background:#fff;padding:50px;position:relative">
      <el-form-item label="企业名称">
        <el-input v-model="detaildata.enter_name"></el-input>
      </el-form-item>
      <el-form-item label="营业执照">
        <img :src="detaildata.business_img" alt="" style="width:178px;height:178px;border:1px solid #ccc">
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="detaildata.detailed_address"></el-input>
      </el-form-item>
      <el-form-item label="留言标题">
        <el-input v-model="detaildata.title"></el-input>
      </el-form-item>
      <el-form-item label="留言内容">
        <textarea v-model="detaildata.content" type="textarea"></textarea>
      </el-form-item>
      <i class="el-icon-close" @click="cancle"></i>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detaildata: {}
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
    cancle() {
      this.$router.push("/interaction");
    },
    getData() {
      this.$axios
        .get("/api/admins/lnteract_info/" + this.$route.params.id,)
        .then(res => {
          this.detaildata = res.data.lnteraction;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
<style>
.el-icon-close {
  font-size: 20px;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
textarea {
  width: 100%;
  min-height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}
</style>



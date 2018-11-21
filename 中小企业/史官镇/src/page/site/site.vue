<template>
  <div class="site">
    <div v-for="val in data">
      <div>
        <span>{{val.name}}：</span>

        <span v-if="val.dom_type == 2">
          <el-radio v-model="val.value" label="1">是</el-radio>
          <el-radio v-model="val.value" label="0">否</el-radio>
        </span>

        <label v-else-if="val.dom_type == 1">
          <el-input style="width: 50%;" type="text" :rows="2"
                    v-model="val.value"></el-input>
        </label>

        <label v-else-if="val.dom_type == 3">
          <el-input placeholder="请选择图片" style="width: 40%" v-model="val.value" ref="image"></el-input>
          <input type=file @change="getFile($event,val)">
        </label>

        <el-form ref="form" label-width="50px" v-else-if="val.dom_type == 4">
          <quill-editor class="appwrapper" v-model="val.value">
          </quill-editor>
        </el-form>

        <label v-else-if="val.dom_type == 5">
          <el-input style="width: 50%;" type="textarea" :rows="2"
                    v-model="val.value"></el-input>
        </label>

      </div>

    </div>


    <div class="but">
      <el-button type="primary" @click="submit($event)">保存提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "site",
  data() {
    return {
      data: [],
      hide: false,
      hide1: false,
      hide3: false,
      inputSite: "",
      imageCollection: {}
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.date();
  },
  methods: {
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/sgzadmin/sonconfig",
       
      }).then(res => {
        this.data = res.data.configs;
      });
    },
    //上传头像
    getFile(event, val) {
      this.imageCollection[val.type] = event.target.files[0].name;
    },
    submit() {
      var formData = {};
      this.data.forEach(item => {
        formData[item.type] = item.value;
      });
      let formData1 = { ...formData, ...this.imageCollection };
      this.$axios({
        method: "POST",
        url: "/api/sgzadmin/add_sonconfig",
       
        data: formData1
      }).then(res => {
        this.getData();
        if (res.data.status == 1) {
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
      });
    }
  }
};
</script>

<style scoped>
.site div {
  font-size: 0.28rem;
  padding: 0.2rem 0;
}

.but {
  text-align: center;
  padding-top: 1.5rem;
}

span {
  display: inline-block;
  width: 3rem;
}

input {
  line-height: 0.3rem;
}

.appwrapper {
  height: 3rem;
  margin-bottom: 0.8rem;
  width: 17rem;
}
</style>

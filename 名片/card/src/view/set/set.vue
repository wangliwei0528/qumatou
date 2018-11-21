<template>
    <div class="set">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>站点设置</span>               
            </div>            
                <div
                :label="item.name"  
                v-for='item in data' 
                :key='item.id'
                style='margin-top:30px;margin-left:30px'> 
                <div style='width:100%;display:flex;just-content:space-between;'>
                    <el-tag>{{item.name}}</el-tag>
                    <span v-if='item.type=="set1"'>
                        <el-input v-model="item.value" :placeholder="item.name" style='margin-left:50px'></el-input>
                    </span>
                    <span v-if='item.type=="set2"' style='margin-top:8px;margin-left:50px;width:100%;'>                      
                        <el-radio v-model="item.value" label="1" :value="item.value">是</el-radio>
                        <el-radio v-model="item.value" label="0" :value="item.value">否</el-radio>       
                    </span>
                    <span v-if='item.type=="set3"' style='vertical-align:middle;margin-left:50px'>                                             
                        <div class="fileBox">
                            <span class="fileinput-button"> 
                            <img :src="srcOthers" alt="" width="80px" height="80px">
                            <input type="file" name="set3" id="photo" ref='avatar' @change="getFile($event,item)" style='display:block;width:80px;height:80px;'>
                            </span>
                        </div>
                    </span>
                    <span v-if='item.type=="set4"' style='vertical-align:middle;margin-left:20px;margin-top:-20px'>                                                                        
                        <quill-editor class="appwrapper1" v-model="item.value" style='height:260px;margin-top:20px'>
					              </quill-editor>
                    </span>
                </div>                                      
            </div>  
            <div class="but">
                 <el-button type="primary" @click="onSubmit($event)" style='margin-top:100px'>保存提交</el-button>
            </div>                        
        </el-card>
    </div>
</template>
<script>
export default {
  name: "set",
  data() {
    return {
      data: [],
      srcOthers:'',
      img:{}
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
  },
  methods: {
    getData() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$axios
        .get("/api/admin/config", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          }
        })
        .then(res => {
          if(res){
            loading.close()
          }
          this.data = res.data.data;
          // this.srcOthers = res.data.value;
          if (res.data.total < res.data.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.total;
          this.per_page = res.data.per_page;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFile(event,item) {
      let _this = this;
      var files=this.set3 = event.target.files[0];
      if (!event || !window.FileReader) return;
      let reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = function() {
        _this.srcOthers = this.result;        
      };
    },
    //提交
    onSubmit(event,item) {
      var formData = new FormData();                             
      this.data.forEach(item => {
        formData[item.type] = item.value;       
      });
      formData.append("set3", this.set3);     
      let formData1 = { ...formData} 
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });            
      this.$axios({
        method: "POST",
        url: "/api/admin/add_config",
        headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
        data: formData1
      })
        .then(res => {
          loading.close()
          if (res.data.status == 1) {            
            this.$message({
              message: res.data.message,
              type: "success"
            });
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
    handleClick() {}
  }
};
</script>
<style>
</style>

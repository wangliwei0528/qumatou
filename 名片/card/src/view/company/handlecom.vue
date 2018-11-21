<template>
    <div class="company">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{this.$route.params.id?'编辑企业':'添加企业'}}</span>               
            </div> 
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="名称" prop='title'>
                    <el-input v-model="form.title" style='width:40%'></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="封面图" style="width:35%" prop='cover_url'>
                    <div class="fileBox">
                        <span class="fileinput-button"> 
                        <img :src="srcOthers" alt="" width="80px" height="80px">
                        <input type="file" name="cover_url" id="photo" ref='cover_url' @change="getFile($event)" style='display:block;width:80px;height:80px;'>
                        </span>
                    </div>
                    </el-form-item>
                </div>
                <el-form-item label='手机号' prop='mobile'>
                    <el-input v-model="form.mobile" style='width:40%'></el-input>
                </el-form-item> 
                <el-form-item label='电话' prop='tel'>
                    <el-input v-model="form.tel" style='width:40%'></el-input>
                </el-form-item> 
                <el-form-item label='详细地址' prop='address'>
                    <el-input v-model="form.address" style='width:40%'></el-input>
                </el-form-item>
                <el-form-item label='地址' prop='address'>
                    <el-input v-model="form.addres" style='width:40%'></el-input>
                     <input type="hidden" ref="lng" name="lng">
                     <input type="hidden" ref="lat" name="lat">
                    <el-button id="getMap"  type="button" @click='getmap'>获取坐标</el-button>
                    <div id="container" style='width:300px;height:300px'></div>
                </el-form-item>
                <el-form-item label="描述" prop='introduction'>
                        <!-- <el-input :rows="4" type="textarea" v-model="form.introduction" style='width:40%'></el-input> -->
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
                              v-model="form.introduction"
                              ref="myQuillEditor"
                              :options="editorOption"
                              @change="onEditorChange($event)"
                            >
                            </quill-editor>  
                      </div>
                </el-form-item>                               
                <el-form-item>
                   <el-button type="primary" @click="onSubmit($event)" class='el-icon-edit-outline' style='margin-top:50px'>提交保存</el-button>
                    <el-button @click='cancle'>取消</el-button>
                </el-form-item>
                </el-form>
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
  name: "handlecom",
  data() {
    return {
      lng: "",
      lat: "",
      srcOthers: "",
      id: "",
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
        lng: "",
        lat: "",
        address: "",
        cover_url: "",
        introduction: "",
        mobile: "",
        tel: "",
        title: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        address: [
          { required: true, message: "请输入企业地址", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        cover_url: [
          { required: true, message: "请上传封面图", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        tel: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            // pattern: /0\d{2,3}-\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
            message: "不允许输入空格等特殊符号"
          }
        ]
      }
    };
  },
  created() {
    //获取token
    this.token = localStorage.getItem("token");
    this.group_id = localStorage.getItem("id");
    if (this.group_id != 1 || this.$route.params.id) {
      this.getData();
    }
    this.getheader();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var myLatlng = new qq.maps.LatLng(39.897445, 116.331398);
      var myOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      };
      var map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );
      //添加监听事件
      qq.maps.event.addListener(map, "click", function(event) {
        console.log(
          "您点击的位置为: [" +
            event.latLng.getLat() +
            ", " +
            event.latLng.getLng() +
            "]"
        );
      });
    },

    getmap() {
      let that = this;
      let address = this.form.addres;
      let geocoder = new qq.maps.Geocoder(); //对指定地址进行解析
      geocoder.getLocation(address); //设置服务请求成功的回调函数
      geocoder.setComplete(function(result) {
        that.form.lat = result.detail.location.lat;
        that.form.lng = result.detail.location.lng;
        console.log(that.form.lat)
      }); //若服务请求失败，则运行以下函数
      geocoder.setError(function() {
        alert("出错了，请输入正确的地址！！！");
      });
      let markersArray = [];
      let myLatlng = new qq.maps.LatLng(this.form.lat, this.form.lng);
      let myOptions = {
        zoom: 18,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      };
      let map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );
      let marker = new qq.maps.Marker({
        position: myLatlng,
        map: map
      });
      markersArray.push(marker);
    },
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
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$axios({
        method: "get",
        url: "/api/admin/merchant_info",
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1_json"
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
          this.srcOthers = res.data.cover_url;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFile(event) {
      let _this = this;
      var files = (this.form.cover_url = event.target.files[0]);
      if (!event || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        _this.srcOthers = this.result;
      };
    },
    onSubmit(event) {
      let formData = new FormData(this.$refs.form);
      formData.append("title", this.form.title);
      formData.append("mobile", this.form.mobile);
      formData.append("tel", this.form.tel);
      formData.append("cover_url", this.form.cover_url);
      formData.append("address", this.form.address);
      formData.append("introduction", this.form.introduction);
      formData.append("lng", this.form.lng);
      formData.append("lat", this.form.lat);
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
              method: "post",
              url: "/api/admin/edit_merchant/" + this.$route.params.id,
              headers: {
                Authorization: "Bearer " + this.token,
                Accept: "application/vnd.myapp.v1_json"
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
                  this.$router.push("/company"), this.getData();
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
              method: "post",
              url: "/api/admin/add_merchant",
              headers: {
                Authorization: "Bearer " + this.token,
                Accept: "application/vnd.myapp.v1_json"
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
                  this.$router.push("/company"), this.getData();
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
          return false;
        }
      });
    },
    cancle() {
      this.$router.push("/company");
    }
  }
};
</script>
<template>
    <div class="user">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="标题"  prop="title">
                <el-input v-model='form.title' style="width:35%"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content" >
                <div style='height:300px'>
                    <quill-editor
                        class="editor"
                        style='height:300px;width:60%'
                        v-model="form.content"
                        ref='myQuillEditor'
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                        >
                    </quill-editor>
                </div>                
            </el-form-item>
            <el-form-item class="btn" style='margin-top:150px'>
                <el-button type="primary" @click="onSubmit">立即添加</el-button>
                <el-button @click="cancle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import * as Quill from "quill"; //引入编辑器
//quill图片可拖拽改变大小
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
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
  data() {
    return {
      form: {
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: "", // 这里写你要上传的图片服务器地址
      header: { token: localStorage.getItem("token") }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      detailContent: "", // 富文本内容
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              // image: function(value) {
              //   if (value) {
              //     console.log(value);
              //     document.querySelector(".avatar-uploader input").click();
              //   } else {
              //     this.quill.format("image", false);
              //   }
              // }
            }
          }
        }
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.$axios.get("api/sgzadmin/introduce_Info").then(res => {
        console.log(res);
        this.form = res.data.introduce;
      });
    },
    onEditorReady() {},
    onEditorFocus() {},
    onEditorBlur() {},
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
      console.log(res);
      console.log(this.$refs);
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
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
    // getheader() {
    //   this.header = {
    //     Authorization: "Bearer " + this.token
    //   };
    // },
    onSubmit() {
      let data = {
        title: this.form.title,
        content: this.form.content
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/api/sgzadmin/edit_introduce",
            data: data
          })
            .then(res => {
              console.log(res);
              if (res.data.status == 1) {
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.getdata();
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
    },
    cancle() {}
  }
};
</script>


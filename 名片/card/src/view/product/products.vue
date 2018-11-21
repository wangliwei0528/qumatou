<template>
    <div class="company">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="box">
                    <div class="add">
                        <el-button type="primary" icon="el-icon-edit" @click='add'>添加</el-button>  
                    </div> 
                    <div class='inputbox'>                  
                        <span class='search'>
                          <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            v-model="title"
                            @keyup.enter.native="getData">
                          </el-input>
                        </span>                        
                    </div>                                
                </div>                               
            </div>
             <el-table
              ref="testTable"
              :data="data"
              style="width:100%;"
              border
              :default-sort = "{prop: 'id', order: 'ascending'}" >

        <el-table-column
          fixed="right"
          label="排序"
          width="150"
          align="center">
          <template slot-scope="scope">            
            <span class='iconfont icon-up' v-if="scope.$index!=0"
              @click="move(scope.$index, scope.row,scope.up)" style='font-size:24px'></span>
            <span class='iconfont icon-down' v-if="scope.$index!=(data.length-1)"
              @click="move(scope.$index, scope.row,scope.down)" style='font-size:24px'></span>
          </template>
        </el-table-column>
                <el-table-column
                  prop="title"
                  label="标题"       
                  align="center">
                </el-table-column>                
                <el-table-column
                  prop="content"
                  label="内容"               
                  align="center"
                  :show-overflow-tooltip="true" >
                  <template slot-scope="scope">
                      <div v-html="scope.row.content" ></div>
                </template>
                </el-table-column>
                <el-table-column
                    prop="cover"
                    label="封面"                  
                    align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" style='width:50px;height:50px;'>
                    </template>
                </el-table-column> 
                <el-table-column
                  prop="title"
                  label="企业名称"       
                  align="center"
                  v-if='group_id==1'>
                </el-table-column>  
                <el-table-column
                  prop="dateline"
                  label="创建时间"                  
                  align="center">
                </el-table-column>                
                <el-table-column
                  fixed="right"
                  label="操作"                
                  align="center">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">编辑</el-button>
                  <el-button @click="handleDel(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">删除</el-button>        
                </template>
            </el-table-column>
        </el-table>
            <!-- 分页设置 -->
            <div class="block" v-if="pagination">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[per_page]"
                :page-size="per_page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :background="true">
              </el-pagination>
            </div>                     
        </el-card>
    </div>
</template>
<script>
export default {
  name: "products",
  data() {
    return {
      //表格数据
      data: [],
      //总数
      total: 0,
      //当前页
      currentPage: 1,
      //每页显示的数据
      pagesize: 10,
      //当前页
      page: 1,
      per_page: 0,
      pagination: true,
      //搜索
      title: "",
      group_id: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
    this.group_id = localStorage.getItem("id");
  },
  methods: {
    getData() {
      this.$axios
        .get("/api/admin/product", {
          params: {
            page: this.page,
            title: this.title
          },
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          }
        })
        .then(res => {
          console.log(res);
          // if(res){
          //     loading.close()
          // }
          this.data = res.data.data;
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
    handleCurrentChange: function(currentPage) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.currentPage = currentPage;
      this.$axios
        .get("/api/admin/product", {
          params: {
            page: currentPage
          },
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          }
        })
        .then(res => {
          if (res) {
            loading.close();
          }
          this.data = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    add() {
      this.$router.push("/handlepro");
    },
    handleEdit(index, row) {
      this.$router.push("/handlepro/" + row.id);
    },
    handleDel(index, row) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$axios({
        method: "post",
        url: "/api/admin/del_products/" + row.id,
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1+json"
        }
      })
        .then(res => {
          loading.close();
          if (res.data.status == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.$router.push("/products"), this.getData();
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
    },
    //排序
    move(index, row, word) {
      this.id = row.id;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$axios({
        method: "POST",
        url: "/api/admin/products_seq/" + row.id,
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1+json"
        },
        data: {
          id: this.id,
          page: this.page,
          p: word
        }
      })
        .then(res => {
          if (res.data.status == 1) {
            loading.close();
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
    }
  }
};
</script>


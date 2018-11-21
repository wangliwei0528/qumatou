<template>
  <div>
    <div class="search">
      <!--<el-button type="primary" class="addbtn"> <router-link :to="{name:'addUser'}">添加用户信息</router-link></el-button>-->
      <el-button type="text" @click="addInfo" class="addbtn" icon="el-icon-plus">添加资讯</el-button>
      <el-select v-model="value" placeholder="请选择发布状态" style="float:left;margin-left:20px;width:200px" @change="getInvestInfo()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value1" placeholder="请选择分类" style="float:left;margin-left:20px;width:200px" @change="getInvestInfo1()">
        <el-option
          v-for="item in cagetories"
          :key="item.id"
          :label="item.cate_name"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="searchinput">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model.trim="name"
          @keyup.enter.native="getData"
        >
        </el-input >
      </div>
      <el-button icon="el-icon-search" type="primary" class="searchbtn" @click=getData>搜索</el-button>
    </div>
    <el-table
      ref="testTable"
      :data="data"
      style="width:100%;color:#000"
      border
      :default-sort = "{prop: 'id', order: 'ascending'}" >
      <el-table-column label="资讯列表" style="color:#000">
        <!-- <el-table-column
                prop="content"
                label="内容"
                width="180"
                class='content'
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                      <div v-html="scope.row.content"></div>
                </template>
        </el-table-column>                            -->
        <el-table-column
          prop="id"
          label="ID"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column prop="status" label="发布状态" align="center">
          <template slot-scope="scope">
            <div  :style="{color: scope.row.status==1?'#4F4F4F':'red'}">{{scope.row.status == 1?'已发布':'未发布'}}</div>
            <!-- <code>{{scope.row.status==1?'已发布':'未发布'}}</code> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="carete_time"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="cateid" label="分类" align="center">
          <template slot-scope="scope">
            <code v-if="scope.row.cateid == 1">通知公告</code>
            <code v-if="scope.row.cateid == 2">行业动态</code>
            <code v-if="scope.row.cateid == 3">招商引资</code>
            <code v-if="scope.row.cateid == 4">政务公开</code>
            <code v-if="scope.row.cateid == 5">政策法规</code>
            <code v-if="scope.row.cateid == 10">融资服务</code>
            <code v-if="scope.row.cateid == 11">最新资讯</code>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">编辑</el-button>
            <!-- <el-button @click="handleDelete(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">删除</el-button> -->
            <el-button type="text" size="small">
              <el-dropdown>
                          <span class="el-dropdown-link" style="font-size:12px;color:#409EFF">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text" @click="release(scope.$index, scope.row)">{{scope.row.status==1?'取消发布':'发布'}}</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "information",

  data() {
    return {
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
      //搜索框
      name: "",
      cateid1: "",
      //select
      options: [
        {
          value: "1",
          label: "已发布"
        },
        {
          value: "0",
          label: "未发布"
        }
      ],
      value: "",
      value1: "",
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
      //发布状态
      status: 1,
      cagetories: "",
      id: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.$axios
      .get("/api/admins/cate_list", {
        
        params: {
          type: 1
        }
      })
      .then(res => {
        this.cagetories = res.data.cagetories;
        this.getData();
      });
    this.getData();
  },
  mounted() {
    this.date();
  },
  methods: {
    //发布状态切换
    getInvestInfo() {
      this.status = this.value;
    },
    getInvestInfo1() {
      this.id = this.value1;
    },
    //编辑资讯
    handleEdit(index, row) {
      this.$router.push("/editInfo/" + row.id);
    },
    //发布资讯
    release(index, row) {
      if (row.status == 1) {
        this.status = 0;
      } else {
        this.status = 1;
      }
      this.$axios({
        method: "post",
        url: "/api/admins/news_release/" + row.id,
        
        data: {
          status: this.status
        }
      })
        .then(res => {
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
    //删除资讯
    handleDelete(index, row) {
      let id = row.id;
      this.token = localStorage.getItem("token");
      this.$axios({
        method: "POST",
        url: "/api/admins/del_news/" + id,
        
      })
        .then(res => {
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
        .catch(erer => {
          console.log(err);
        });
    },
    //获取数据
    getData() {
      this.token = localStorage.getItem("token");
      this.getInvestInfo();
      this.getInvestInfo1();
      this.$axios
        .get("/api/admins/news", {
          
          params: {
            page: this.page,
            name: this.name,
            status: this.status,
            cat_id: this.id
          }
        })
        .then(res => {
          this.data = res.data.data;
          if (res.data.total < res.data.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.total;
          this.per_page = res.data.per_page;
        })
        .catch(err => console.log(err));
    },
    //页码变更显示当前页的数据
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.$axios
        .get("/api/admins/news", {
          
          params: {
            page: currentPage
          }
        })
        .then(res => {
          this.data = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    //添加资讯
    addInfo() {
      this.$router.push("/addInfo");
    }
  }
};
</script>

<style scoped>
.search {
  width: 80%;
  height: 50px;
  margin-bottom: 10px;
}
.addbtn {
  margin-bottom: 20px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  float: left;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.searchinput {
  width: 300px;
  float: left;
  margin-left: 30px;
}
.searchbtn {
  float: left;
  margin-left: 2px;
}
.el-input__inner {
  height: 42px;
  line-height: 42px;
}
.el-pagination {
  margin-top: 20px;
}
table td {
  font-weight: bold;
  color: #000;
}
.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.img {
  width: 100px;
  height: 10px;
}
.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}
</style>


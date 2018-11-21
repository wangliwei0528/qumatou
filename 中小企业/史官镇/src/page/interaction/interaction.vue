<template>
  <div>
    <div>
      <el-button
        :label="item.cate_name"
        v-for='(item,index) in typeValue'
        :key='index'
        @click='choose(item.id)'
        :data-id="item.id"
        :class=" {active:index==dynamic}"
        style='margin-bottom:30px;margin-left:3px'
      >
        {{item.cate_name}}
      </el-button>
    </div>
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
    <!--表格数据  -->
    <el-table
      ref="testTable"
      :data="data"
      style="width:100%;"
      border
      :default-sort = "{prop: 'id', order: 'ascending'}" >
      <el-table-column label="政企互动列表" style="color:#000">
        <el-table-column
          prop="id"
          label="ID"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="enter_name"
          label="企业名称"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="留言标题"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="留言内容"
          width="300"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handledel(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">删除</el-button>
            <el-button @click="handledetail(scope.$index, scope.row)" type="text" size="small" style="font-size:12px;color:#409EFF">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
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
  data() {
    return {
      dynamic: 0,
      detaildata: {},
      centerDialogVisible: false,
      typeValue: [],
      cate_id: "",
      firstid: "",
      data: [],
      name: "",
      //总数
      total: 0,
      //当前页
      currentPage: 1,
      //每页显示的数据
      pagesize: 10,
      //当前页
      page: 1,
      per_page: 0,
      pagination: true
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getData();
    this.getType();
  },
  mounted() {
    this.date();
  },
  methods: {
    //获取分类
    getType() {
      this.$axios
        .get("/api/sgzadmin/lnteract_cate",)
        .then(res => {
          console.log(res);
          this.typeValue = res.data;
          this.firstid = res.data[0].id;
          this.getData(); // 保证上一个接口调用完成所以在这里调用获取数据的方法
        })
        .catch(err => {
          console.log(err);
        });
    },
    choose(key, index) {
      if (index == 1) {
        this.dynamic = index;
      }
      //点击添加字体颜色，其他的删除class名称
      this.dynamic = index;
      this.cate_id = key;
      // console.log(this.cate_id);
      this.getData();
    },
    //获取数据
    getData() {
      this.$axios
        .get("/api/sgzadmin/lnteract", {
          
          params: {
            page: this.page,
            name: this.name,
            cate_id: this.cate_id ? this.cate_id : this.firstid
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
        .get("/api/sgzadmin/lnteract", {
          
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
    handledel(index, row) {
      this.$axios({
        method: "post",
        url: "/api/sgzadmin/del_lnteract/" + row.id,
        
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
    handledetail(index, row) {
      this.$router.push("/detail/" + row.id);
    }
  }
};
</script>
<style scoped>
.searchinput {
  width: 300px;
  float: left;
  margin-bottom: 30px;
}
.searchbtn {
  float: left;
  margin-left: 2px;
}
.active {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}
</style>



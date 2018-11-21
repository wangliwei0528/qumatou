<template>
  <div class="user">
    <div class="search">
      <el-button type="primary" class="addbtn" @click="addrole()">
        +添加角色
      </el-button>
      <div class="searchinput">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="name"
          @keyup.enter.native="getTableData"
        >
        </el-input>
      </div>
      <el-button icon="el-icon-search" type="primary" class="searchbtn" @click=getTableData>搜索</el-button>
    </div>

    <el-table
      :data="data"
      border
      style="width:100%;">
      <el-table-column label="角色管理列表">
        <el-table-column
          prop="group_id"
          label="角色ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="group_name"
          label="创建者"
          align="center">
        </el-table-column>
        <el-table-column
          prop="user.name"
          label="角色"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="editClick(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table-column>

    </el-table>

    <!--<div class="mask" v-if="mask" @click="mask1"></div>-->
    <!--<div class="editrole" v-if="mask">-->
    <!--<div>-->
    <!--<div class="role"><span style="color: red;">*</span> 角色名称 ：</div>-->
    <!--<el-input-->
    <!--placeholder="请输入角色名称" style="width: 60%" v-model="inputRole">-->
    <!--</el-input>-->
    <!--</div>-->
    <!--<el-button @click="submission()" type="primary" size="big" style="margin-top: 0.6rem;">保存提交</el-button>-->
    <!--<el-button @click="cancel">取消</el-button>-->
    <!--</div>-->
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
import axios from "axios";

export default {
  data() {
    return {
      data: [],
      mask: false,
      inputRole: "",
      token: "",
      total: 0,
      currentPage: 1,
      page: 1,
      group_id: "",
      name: "",
      per_page: 0,
      id: 0,
      pagination: true
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getTableData();
  },
  mounted() {
    this.date();
  },
  methods: {
    getTableData() {
      axios
        .get("/api/sgzadmin/groups", {
          
          params: {
            page: this.page,
            name: this.name
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
        });
    },
    addrole() {
      this.$router.push("/addTo");
    },
    editClick(index, row) {
      this.$router.push({
        path: "/addTo",
        query: { Id: row.group_id, inputRole: this.inputRole }
      });
    },
    mask1() {
      this.mask = false;
    },
    cancel() {
      this.mask = false;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      axios
        .get("/api/sgzadmin/groups", {
         
          params: {
            page: currentPage
          }
        })
        .then(res => {
          this.data = res.data.data;
          this.total = res.data.total;
        });
    }
  }
};
</script>
<style scoped>
.user {
  text-align: center;
}

.search {
  /*width:600px;*/
  margin-bottom: 20px;
}

.addbtn {
  margin-bottom: 30px;
  float: left;
}

.searchinput {
  width: 300px;
  float: left;
  margin-left: 30px;
}

.searchbtn {
  float: left;
  margin-left: 5px;
}

th {
  font-weight: bold;
  color: #000;
}

.el-table th > .cell {
  position: relative;
  word-wrap: normal;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 24px;
}

.role {
  font-size: 0.3rem;
  display: inline;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.editrole {
  width: 10rem;
  padding: 0.6rem 0.2rem;
  background: #ffffff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  border-radius: 0.1rem;
}

.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}
</style>
<style>
.el-table__empty-block {
  min-height: 600px;
}
</style>

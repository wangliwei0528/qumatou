<template>
  <div>
    <ul>
      <el-table
        :data="data"
        border
        center
        style="width: 100%">
        <el-table-column label="日志管理列表" style="color:#000">
          <el-table-column
            prop="user.name"
            label="用户"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="log_info"
            label="操作"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="ip_address"
            label="IP地址"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="add_time"
            label="日期"
            width="200"
            align="center">
          </el-table-column>
        </el-table-column>
      </el-table>
    </ul>
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
    name: "log",
    data() {
      return {
        data: [],
        pagination: true,
        total:0,
        page: 1,
        per_page: 0,
        currentPage:1
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
      getData() {
        this.$axios
          .get("/api/sgzadmin/log", {
            
            params: {
              page: this.page,
            }
          })
          .then(res => {
            this.data = res.data.data;
            this.total = res.data.total;
            this.per_page = res.data.per_page;
          })
          .catch(err => {
            console.log(err);
          });
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.$axios
          .get("api/sgzadmin/log", {
            
            params: {
              page: currentPage,
            }
          })
          .then(res => {
            this.data = res.data.data;
            this.total = res.data.total;
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>
<style>
  .block {
    margin-top: 0.8rem;
    width: 100%;
    text-align: center;
  }
</style>



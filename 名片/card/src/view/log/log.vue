<template>
    <div class="set">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>日志列表</span>               
            </div>
            <el-table
              ref="testTable"
              :data="data"
              style="width:100%;"
              border
              :default-sort = "{prop: 'id', order: 'ascending'}" >
        
                <el-table-column
                  prop="id"
                  label="ID"       
                  align="center">
                </el-table-column>                
                <el-table-column
                  prop="ip_address"
                  label="IP"               
                  align="center">
                </el-table-column>
                <el-table-column
                    prop="log_info"
                    label="日志信息"                  
                    align="center">                    
                </el-table-column> 
                <el-table-column
                  prop="add_time"
                  label="创建时间"                  
                  align="center">
                </el-table-column> 
                <el-table-column
                  prop="log_type"
                  label="日志类型"                  
                  align="center">
                </el-table-column>                 
                <el-table-column
                  prop="merchants.title"
                  label="企业ID"                  
                  align="center">
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
  name: "log",
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
      pagination: true
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
        .get("/api/admin/log", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.myapp.v1+json"
          },
          params: {
            page: this.page
          }
        })
        .then(res => {
          if(res){
            loading.close()
          }
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
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.currentPage = currentPage;
      this.$axios
        .get("/api/admin/log", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            Accept: "application/vnd.myapp.v1+json"
          },
          params: {
            page: currentPage
          }
        })
        .then(res => {
          if(res){
            loading.close()
          }
          this.data = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
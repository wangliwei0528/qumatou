<template>
  <div class="configure">
<div class="service">服务器信息</div>
    <el-table
      :data="resultData"
      border
      :show-header="false"
      style="width:100%;">
      <el-table-column
        prop="key"
        align="center">
      </el-table-column>
      <el-table-column
        prop="value"
        align="center">
      </el-table-column>


    </el-table>


  </div>

</template>

<script>
export default {
  data() {
    return {
      data: {},
      resultData: []
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
        url: "/api/sgzadmin/demolist",        
      }).then(res => {
        this.data = res.data;
        for (let i in this.data) {
          this.resultData.push({
            key: i,
            value: this.data[i]
          });
        }
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
  width: 500px;
  height: 50px;
  margin-bottom: 20px;
}

.addbtn {
  margin-bottom: 30px;
  float: left;
}

.searchinput {
  width: 300px;
  float: left;
}

.searchbtn {
  float: left;
  margin-left: 5px;
}

/* th {
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
} */

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

.editrole1 {
  width: 10rem;
  padding: 0.6rem 0.6rem;
  background: #ffffff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  border-radius: 0.1rem;
}

/*.editrole1 div {*/
/*margin-top: 0.2rem;*/
/*}*/

.block {
  margin-top: 0.8rem;
}

.editrole1 p {
  text-align: left;
  margin-left: 3.1rem;
  width: 6rem;
  font-size: 0.3rem;
  height: 0.6rem;
  line-height: 0.6rem;
}
.service {
  font-size: 0.32rem;
  padding: 0.2rem 0;
}
</style>

<template>
  <el-container class="public-box">
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">操作日志</div>
      </el-row>
    </el-header>

    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="contentTable">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column  label="序号">
                <template slot-scope="scope">{{serialNumber(scope.$index,page.pageIndex,page.pageSize)}}</template>
              </el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="workerName" label="员工姓名"></el-table-column>
            <el-table-column prop="modelName" label="操作模块"></el-table-column>
            <el-table-column prop="content" label="操作内容"></el-table-column>
            <el-table-column prop="time" label="操作时间">
              <template slot-scope="scope">{{scope.row.time | filterTime}}</template>
            </el-table-column>
          </el-table>
          <Pagination
            :total="total"
            @pagination="handlePage"
            :pageSize="page.pageSize"
            :pageNum="page.pageIndex"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {serialNumber} from '@/views/AttendanceManagement/mixins';
export default {
  mixins:[serialNumber],
  data() {
    return {
      tableData: [],
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    //列表渲染
    getter() {
      let obj = {};
      Object.assign(obj, this.page);
      obj.workerId = sessionStorage.getItem("workerId");
      axios({
        url: `${this.tong}/log/allLog`,
        method: "post",
        headers: {
          Authorization: "Bearer" + sessionStorage.getItem("accessToken")
        },
        params: obj
      }).then(res => {
        if (res.data.code == 1) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total
        } else {
          this.$message.error("请求失败");
        }
      });
    },
    //分页多条书
    handlePage(page) {
      this.page.pageIndex = page.pageNum;
      this.page.pageSize = page.pageSize;
      this.getter();
    }
  },
  created() {
    this.getter();
  },
  filters: {
    filterTime(val) {
      return moment(val).format("YYYY/MM/DD");
    }
  }
};
</script>

<style scoped lang="scss">
@import '~@/styles/public.scss';
</style>

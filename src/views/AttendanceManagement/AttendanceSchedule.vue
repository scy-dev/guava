<template>
  <el-container class="public-box" id="AttendanceSchedule">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">班次设置</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-button
          type="primary"
          @click="$router.push({name:'新增班次',params:{status:1}})"
          style="margin-bottom:40px"
        >新增班次</el-button>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="attendanceShifts.shiftsName" label="班次名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="idcard" label="考勤时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.attendanceShiftsTime | attendanceShiftsTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="使用的排班规则">
            <template slot-scope="scope">
              <span>{{scope.row.attendanceShifts.scheduRuleName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="compony" label="是否允许加班">
            <template slot-scope="scope">
              <span>{{scope.row.attendanceShifts.overFlag==1?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                style="color:#3C62D0;cursor: pointer"
                @click="$router.push({name:'修改班次',params:{status:2,id:scope.row.attendanceShifts.id}})"
              >编辑</span>
              <span style="color:#E9E9E9">|</span>
              <span style="color:#D31919;cursor: pointer;" @click="deletes(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          @pagination="pagination"
          :pageSize="page.pageSize"
          :pageNum="page.pageNum"
        />
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { index,serialNumber} from "./mixins";
import {attendanceShiftsTime} from '@/plugin/filterFunction'
export default {
  name: "AttendanceSchedule",
  mixins: [index,serialNumber],
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/schedule/editSchedule") {
      // this.$destroy();
      Object.assign(this.$data, this.$options.data());
    }
    next();
  },
  data() {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      }
    };
  },
  methods: {
    getList() {
      this.loading = false;
      axios({
        url: "/AttendanceShifts/listFindAttendanceShifts",
        method: "post",
        data: this.page
      }).then(res => {
        if (res.data.code == 200) {
          this.loading = false;
          this.total = res.data.total;
          this.tableData = res.data.data;
        }
      });
    },
    //分页
    pagination(val) {
      Object.assign(this.page, val);
      this.getList();
    },
    afterDelete(num) {
      //删除后的计算页码请求
      if (num == 0) {
        if (this.page.pageNum > 1) {
          this.page.pageNum -= 1;
        }
      }
      this.getList();
    },
    deletes(row) {
      //删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            url: "/AttendanceShifts/deleteAttendanceShifts",
            method: "get",
            params: { id: row.attendanceShifts.id }
          }).then(res => {
            if (res.data.code == 200&&res.data.meaasge=='success') {
               this.$message.success('删除成功');
              //删除后的计算页码请求
              if (this.tableData.length - 1 == 0) {
                if (this.page.pageNum > 1) {
                  this.page.pageNum -= 1;
                };
              };
              this.getList();
            } else {
              this.$message.warning(res.data.meaasge);
            };
          });
        })
        .catch(() => {});
    }
  },
    filters: {
      attendanceShiftsTime:attendanceShiftsTime
  },
  activated() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/public.scss";
</style>


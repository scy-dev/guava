<template>
  <el-container class="public-box" id="attendanceRule">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">排班规则</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-button type="primary" @click="addNew">新增排班</el-button>
        <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-top:40px;">
          <el-table-column label="序号" width="200">
            <template slot-scope="scope">
              <span>{{serialNumber(scope.$index,obj.pageNum,obj.pageSize)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="schedulingName" label="排班名称"></el-table-column>
          <el-table-column prop="attendanceName" label="打卡规则"></el-table-column>
          <el-table-column label="工作日" width="300">
            <template slot-scope="scope">
              <span>{{scope.row.weekdayTime | weekdayFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="300"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span style="color:#3C62D0;cursor: pointer;" @click="goDetail(scope.row.id)">查看</span>
              <span style="color:#E9E9E9">|</span>
              <span style="color:#3C62D0;cursor: pointer;" @click="goEdit(scope.row.id)">编辑</span>
              <span style="color:#E9E9E9">|</span>
              <span style="color:#D31919;cursor: pointer;" @click="del(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" @pagination="handlePage"></pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import Pagination from "@/components/Pagination";
import { weekdayFilter } from "./../../plugin/filterFunction";
import {serialNumber} from '@/views/AttendanceManagement/mixins';
import { store } from "@/plugin/observable";
export default {
  filters: {
    weekdayFilter(val) {
      return weekdayFilter(val);
    }
  },
  mixins:[serialNumber],
  name: "",
  data() {
    return {
      tableData: [],
      total: 0,
      obj: {
        pageNum: 1,
        pageSize: 10,
        projectId:store.projectId
      },
      loading: false
    };
  },
  components: { Pagination },
  created() {
    this.Busmethod();
  },
  methods: {
    Busmethod() {
      axios({
        method: "post",
        url: "ScheduRule/listFindScheduRule",
        data: this.obj
      }).then(res => {
        this.loading = false;
        if (res.data.meaasge == "success") {
          this.total = res.data.total;
          this.tableData = res.data.data;
        } else {
          
          this.$message.error("请求失败");
        }
        console.log(res);
      });
    },
    handlePage(page) {
      Object.assign(this.obj,page)
      this.Busmethod();
    },
    addNew() {
      this.$router.push({ path: "/rule/newrule" });
    },
    goDetail(id) {
        this.$router.push({ path: "/rule/ruledetail", query: { id: id } });
    },
    goEdit(id){
      this.$router.push({ path: "/rule/editrule", query: { id: id } });
    },
    del(id) {
      this.$confirm("您是否确定删除该排班规则？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warning"
      }).then(() => {
        axios({
          url: "ScheduRule/deleteScheduRule",
          method: "get",
          params: {
            id: id
          }
        }).then(res => {
          if (res.data.meaasge == "success") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            if (this.tableData.length - 1 == 0) {
              if (this.obj.pageNum > 1) {
                this.obj.pageNum -= 1;
              }
            }
            this.Busmethod();
          } else {
            this.$alert("", {
              message:
                "<i class='el-icon-warning'></i><span>该排班规则已有工作人员在使用，您无法删除该排班规则。请清掉使用该排班规则的人员再删除</span>",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true,
              showClose: false,
              customClass: "refuse"
            });
          }
        });
      });
    },
  }
};
</script>

<style scoped lang="scss">
@import "~@/styles/public.scss";
#attendanceRule {
  .public-header-title {
    margin-top: 10px;
  }
}
</style>
<style lang="scss">
#attendanceRule {
  .cell {
    padding-left: 30px;
  }
}
.refuse {
  width: 433px;
  padding-bottom: 24px;
  .el-message-box__content {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    p {
      text-align: center;
    }
    i {
      color: red;
      font-size: 22px;
      margin-right: 8px;
    }
    span {
      display: inline-block;
      width: 306px;
      vertical-align: top;
      text-align: left;
    }
  }
  .el-button--primary {
    width: 64px;
    height: 32px;
  }
}
</style>

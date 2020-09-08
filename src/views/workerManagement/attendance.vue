<template>
  <div id="attendance">
    <div class="search">
      <div>
        <span>考勤月份：</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy/MM/dd"
         
          @change="getTime"
        ></el-date-picker>
      </div>
      <div>
        <el-button type="primary" @click="Search">查询</el-button>
        <el-button @click="Reset">重置</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
         <el-table-column label="序号" align="center">
                <template slot-scope="scope">
                   <span>{{serialNumber(scope.$index,searchObj.pageNum,searchObj.pageSize)}}</span>
                </template>
          </el-table-column>
        <el-table-column align="center" prop="fullName" label="姓名"></el-table-column>     
        <el-table-column align="center" prop="attendanceShiftsName" label="班次名称" width="340">
          <template slot-scope="scoped">
            <span>水电1班</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="time" label="班次时间" width="340">
          <template  slot-scope="scoped">
            <span> {{ scoped.row.time | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡时间" width="380" prop="time">
          <template slot-scope="scoped">
            {{scoped.row.time | timestampToTime}}
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :pageSize="limit" @pagination="handlePage"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from "@/components/Pagination";
import {attendanceShiftsTime} from '@/plugin/filterFunction';
import { formatDate,formatTime } from '@/plugin/formRules';
import {serialNumber} from '@/views/AttendanceManagement/mixins';
import { store } from "@/plugin/observable";
import { recordList } from '@/api/api'
export default {
  name: "",
  mixins:[serialNumber],
  data() {
    return {
      searchObj: {
        pageNum: 1,
        pageSize: 10
      },
      time: "",
      tableData: [],
      total: 0,
      limit:10,
      loading:true
    };
  },
  components: { Pagination },
  created() {
    this.BusMethod();
  },
  filters:{
    attendanceShiftsTime(val){
      return attendanceShiftsTime(val)
    },
    formatDate(val){
      return formatDate(val);
    },
    formatTime(val){
      return formatTime(val);
    }
  },
  methods: {
    BusMethod() {
      // console.log(this.$$route.query.id);
      let basicInfo = JSON.parse(this.$route.query.id);
      this.$set(this.searchObj, "userId", basicInfo.id);
      this.$set(this.searchObj, "projectId", store.projectId);
      this.$set(this.searchObj, "userName", sessionStorage.getItem("mateName"));
      let param = {
        pageNum: this.searchObj.pageNum,
        pageSize: this.searchObj.pageSize,
        personId: this.searchObj.userId,
      };
      recordList(param).then(res=>{
        if(res.err_CODE === 0){
          this.loading = false;
          this.tableData = res.data.list;
          console.log(res.data.list);
          this.total = res.data.total;
        }else{
          this.loading = false;
          this.$message.error(res.err_MESSAGE);
        }
      })
      // axios({
      //   url: "Personnel/person/personAttendance",
      //   method: "post",
      //   transformRequest: this.transformRequest,
      //   data: this.searchObj
      // }).then(res => {
      //   this.loading = false;
      //   this.total = res.data.data.total;
      //   this.tableData = res.data.data.list;
      //   console.log(res);
      // });
    },
    getTime(val) {
       this.$set(this.searchObj, "startDate", moment(val[0]).format("YYYY-MM-DD"));
       this.$set(this.searchObj, "endDate",  moment(val[1]).format("YYYY-MM-DD"));
      console.log(val)
    },
    handlePage(page) {
      this.limit = page.pageSize;
      this.$set(this.searchObj, "pageNum", page.pageNum);
      this.$set(this.searchObj, "pageSize", page.pageSize);
      this.BusMethod();
    },
    Search(){
      this.BusMethod();
    },
    Reset(){
      this.searchObj=this.$options.data().searchObj;
      this.time = '';
      this.limit=10;
      this.BusMethod();
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/public";
#attendance {
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  .search {
    display: flex;
    flex-wrap: wrap;
    width: 68%;
    div {
      margin-bottom: 10px;
    }
    div:nth-of-type(2) {
      margin-left: 64px;
    }
    span {
      color: #333333;
      font-size: 16px;
    }
  }
  .content {
    margin-top: 30px;
  }
}
</style>
<style lang="scss">
#attendance {
  .search {
    .el-range-editor.el-input__inner {
      width: 280px;
      position: relative;
      .el-icon-date {
        position: absolute;
        right: 10px;
        top: 2px;
      }
      .el-range-input {
        width: 30%;
      }
      .el-range__close-icon {
        display: none;
      }
    }
    .el-select {
      width: inherit;
      .el-input--suffix {
        width: 280px;
      }
    }
  }

  .el-table .cell,
  .el-table th div {
    padding-left: 40px;
  }
  .el-table th div {
    font-size: 16px;
    font-family: PingFangSC-Medium;
  }
  .el-pagination__sizes{
    .el-select--mini{
      .el-input{
        display: inline-block;
        width: 100px;
      }
    }
  }
  .el-pagination__jump{
    .el-input{
      display: inline-block;
    }
  }
}
</style>

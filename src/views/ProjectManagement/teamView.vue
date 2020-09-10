<template>
  <div id="teamView">
    <!-- 小块 -->
        <div class="public-main-content radius public-padding" style="overflow:auto;margin:-40px -40px 0 -40px">
          <span style="color:#666666;white-space: nowrap;" ><i class="el-icon-warning" style="color:#3C62D0">&nbsp;</i>班次说明：{{explain}} / 休息 / 请假</span>
        </div>
    <div style="height:30px;background:#f0f2f5;margin:0 -40px"></div>
    <div class="role-main">
      <div class="ming" style="display:inline-block">
        <span>姓名：</span>
        <el-input v-model="searchForm.username" placeholder="请输入姓名" style="width:280px"></el-input>
      </div>
      <div class="ming" style="display:inline-block;margin-left:64px">
        <span>选择日期：</span>
        <el-date-picker
          v-model="searchForm.attendanceMonth"
          type="month"
          value-format="yyyy-MM"
          :picker-options="pickerOptions"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div class="role-search">
        <el-button type="primary" @click="search" style="color:#fff">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <PublicTable
      @hehe='getList'
        :column="tableData" 
        :month="page.attendanceMonth"
        :loading="loading"
        :popoverList='popoverList'
        :popover="popover"
        :left="left"
      />
      <div class="contentTable">
        <Pagination
          @pagination="pagination"
          :total="total"
          :pageSize="page.pageSize"
          :pageNum="page.pageNum"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PublicTable from "../AttendanceManagement/component/PublicTable";
import {scrollTable,listAllAttendanceShifts} from "@/views/AttendanceManagement/mixins";
import { store } from "@/plugin/observable";
export default {
  components: { PublicTable },
  mixins:[scrollTable,listAllAttendanceShifts],
  data() {
    return {
      model:'teamView',
      name: "",
      explain:null,
      loading: false,
      popover: true,
      month: "",
      searchForm: {
        attendanceMonth: "",
        username: ""
      },
      page: {
        username:'',
        projectId:store.projectId,
        attendanceMonth: "",
        teamId: this.$route.query.teamId,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      popoverList:null,
      left: [{ label: "姓名", prop: "userName" }],
      tableData:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= new Date().getTime();
        }
      }
    };
  },
  methods: {
    //请求列表
    getList() {
      console.log(9)
      this.loading = true;
      axios({
        // url: " /Projectmanager/project/ScheduleView",
        url: "http://192.168.0.110:7710/SchedulingView/findSchedulingViewTo",
        method: "post",
        // transformRequest: this.transformRequest, //axios请求需求，main.js中改变了
        data: this.page
      }).then(res => {
        this.loading = false;
        if (res.data.code == 200) {
          this.total = res.data.total;
         res.data.data?this.handle(res.data.data,true):this.handle([],true);
        }
      });
    },
    //重置
    reset() {
      this.page = this.$options.data().page;
      this.searchForm = this.$options.data().searchForm;
      this.monthchange();
    },
    //搜索
    search() {
      Object.assign(this.page, this.searchForm);
      this.getList();
    },
    //分页
    pagination(val) {
      Object.assign(this.page, val);
      this.getList();
    },
    //日期
    monthchange() {
      this.searchForm.attendanceMonth = this.page.attendanceMonth = moment().format("YYYY-MM"); //初始渲染和重置选择当前月份
      this.getList(); //请求数据
    },
    //  //班次说明
    // listAllAttendanceShifts(){
    //   axios({
    //     url:'http://192.168.0.110:7710/AttendanceShifts/listAllAttendanceShifts',
    //     method:'post'
    //   }).then(res=>{
        
    //     let data = res.data.data;
    //     let arr = [];
    //     let popoverListCopy = [];
    //     let timeSlot = ["morning", "afternoon", "night", "lateNight"];
    //     data.forEach(e=>{
    //       let str = '';
    //       let name = e.attendanceShifts.shiftsName;
    //       let obj = {
    //         name:name,
    //         id:e.attendanceShifts.id
    //       }
    //       popoverListCopy.push(obj)
    //       let time = e.attendanceShiftsTime;
    //       if(!time.morningCommute){

    //        str= `${name}\t${time.morningWork}-${time.afternoonCommute}`;
    //       }else{
    //         let newarr = [];
    //         timeSlot.forEach(element => {
               
    //           newarr.push(`${time[element + "Work"]}-${time[element + "Commute"]}`);
    //         });
    //         let newstr = newarr.filter(e =>{return !e.includes("null")&&e!=='-'}).join(" , ");
    //         str  = `${name}\t${newstr}`
    //       }
    //       arr.push(str);
    //     })
    //     this.explain = arr.join(' / ');
    //     this.popoverList = [...popoverListCopy,{name:'休息',id:0},{name:'请假',id:0}];
    //   })
    // },
  },
  mounted() {
    this.listAllAttendanceShifts()
    this.monthchange();

  },
  created(){
    //console.log(this.$route.query.teamId)
  }
};
</script>
<style scoped lang="scss">
#teamView .role-main {
  margin: -40px;
  padding: 40px;
  border-radius: 10px;
  margin-top:0; 
  background: white;
  span {
    font-size: 16px;
    color: #333333;
  }
  // div {
  //   margin-bottom: 10px;
  // }
  .ming .el-input {
    width: 280px;
  }
  .el-select {
    width: 280px;
  }
  .role-search {
    display: inline-block;
    margin-left: 64px;
  }
  .contentTable {
    margin-top: 40px;
  }
}
</style>



<template>
  <el-container class="public-box" id="attendanceView">
    <!-- 这里是头部-->
    <!-- 有标题和按钮的用这种 -->
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">排班视图</div>
      </el-row>
    </el-header>
    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      <el-row class="public-main-content radius public-padding" style="margin-bottom:40px;width:100%;overflow:auto">
                <span style="white-space: nowrap;" ><i class="iconfont icon-xiuxiqu">&nbsp;</i><i class="iconfont icon-shangban"></i> / 休息 / 请假</span>
        <!-- <span style="color:#666666;white-space: nowrap;" ><i class="el-icon-warning" style="color:#3C62D0">&nbsp;</i>{{explain}} / 休息 / 请假</span> -->
      </el-row>
      <div class="public-main-content radius public-padding">
         <PublicForm @search="search" :teamOption='teamOption' :subcontractOption='subcontractOption' @teamOptionEmit='teamOptionEmit'/>
        <el-row >
          <PublicTable
            style="margin-top:-20px;"
            :column="tableData"
            :left="left"
            :right="right"
            :month="formInline.attendanceMonth"
            :loading="loading"
            @excelCenter="excelCenter"
          />
        </el-row>
        <Pagination
          :total="tableData.length"
          @pagination="pagination"
          :pageSize="formInline.pageSize"
          :pageNum="formInline.pageNum"
        />
      </div>
    </el-main>
  </el-container>
</template>
<script>
import PublicForm from "./component/PublicForm";
import PublicTable from "./component/PublicTable";
import { index,scrollTable,teamListOrSubcontract,listAllAttendanceShifts} from "./mixins";
export default {
  mixins: [index,scrollTable,teamListOrSubcontract,listAllAttendanceShifts],
  components: {
    PublicForm,
    PublicTable
  },
  data() {
    return {
      explain:null,
      left: [
        { label: "姓名", prop: "name" },
        { label: "分包单位", prop: "company" },
        { label: "班组名称", prop: "className" }
      ],
      right:[
        { label: "周一", prop: "mon" },
        { label: "周二", prop: "tue" },
        { label: "周三", prop: "wed" },
        { label: '周四', prop: 'thur'},
        { label: '周五', prop: 'fir'},
        { label: '周六', prop: 'sat'},
        { label: '周日', prop: 'sun'}
      ],
      tableData:[
        { 
          name: '笋子', 
          company: '河北建业地产公司', 
          className: '水电1组',
          mon:1,
          tue:1,
          wed:0,
          thur:0,
          fir:1,
          sat:0,
          sun:1
        },
        { name: '张克辉', company: '河北建业地产公司', className: '水电2组'}
      ]
    };
  },
  methods: {
    getList() {
      this.loading = true;
      // axios({
      //   url: "/SchedulingView/findSchedulingViewTo",
      //   method: "post",
      //   data: this.formInline
      // }).then(res => {
      //   this.loading = false;
      //   if (res.data.code == 200) {
          
      //     this.total = res.data.total;
      //     this.handle(res.data.data,true);
      //   }else{
      //     this.$message.error('获取数据失败');
      //   };
      // });
    },
    // listAllAttendanceShifts(){
    //   axios({
    //     url:'/AttendanceShifts/listAllAttendanceShifts',
    //     method:'post'
    //   }).then(res=>{
    //     let data = res.data.data;
    //     let arr = [];
    //     let timeSlot = ["morning", "afternoon", "night", "lateNight"];
    //     data.forEach(e=>{
    //       let str = '';
    //       let name = e.attendanceShifts.shiftsName;
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
    //     this.explain = arr.join(' / ')
    //   })
    // }
    // handle(val) {
    //   let special = val.projectMangerList; //特殊情况的数组
    //   let data = val.schedulingViewToList; //人员列表
    //   if (!Array.isArray(data) || data.length === 0) {
    //     //如果没有数据 进行拦截
    //     this.tableData = [];
    //     return false;
    //   }
    //   //数据处理函数
    //   let arr = [];
    //   let newarr = [];
    //   data.forEach(e => {
    //     if (arr.indexOf(e.userId) == -1) {
    //       //返回数据的userId去重放到新数组中
    //       arr.push(e.userId);
    //     }
    //   });
    //   arr.sort((n1, n2) => n1 - n2);
    //   arr.forEach(element => {
    //     let specialcopy = special.filter(e => e.userId == element); //过滤出当前id的请假的数组
    //     let arrcopy = data.filter(e => e.userId == element); //过滤出当前id的用户的当月的信息列表
    //     let obj = Object.assign({}, arrcopy[0]); //将字段拷贝进去
    //     arrcopy.forEach(e => {
    //       obj[e.createTime] = this.time(e.createTime, specialcopy, obj); //判断当天的具体情况
    //       newarr.push(obj);
    //     });
    //   });
    //   this.tableData = newarr;
    // },
    // time(val, specialcopy, obj) {
    //   let filter = specialcopy.filter(e => e.workTime == val);
    //   if (filter.length > 0) {
    //     return "请假";
    //   } else {
    //     if (obj.weekday_time.includes(moment(val).day())) {
    //       return obj.attendanceShiftsName;
    //     } else {
    //         return '休息'
    //     };
    //   };
    // }
  },
  mounted() {
    // this.listAllAttendanceShifts();
    this.formInline.attendanceMonth = moment().format("YYYY-MM"); //初始渲染选择当前月份
    // this.getList(); //请求数据
    //  this.teamListOrSubcontract(
    //     "querySubContractCorpname", {
    //       projectId: sessionStorage.projectId
    //     },
    //     "subcontractOption"
    //   ); //获取分包下拉列表
  }
};
</script>
<style lang='scss'>
#attendanceView {
  .demo-form-inline {
    .el-form-item {
      margin-right: 64px;
    }
  }
  .iconfont{
    font-size: 18px;
  }
  .icon-xiuxiqu{
    color:#41dc6c;
  }
  .icon-shangban{
    color:#a051ea ;
  }  
  .public-main{
    display: flex;
    flex-direction: column;
  }
}
</style>

<template>
  <el-container class="public-box" id="attendanceReport">
    <!-- 这里是头部-->
    <el-header height="76px" class="public-header header-tabs">
      <el-row type="flex" align="center" justify="space-between">
        <el-row type="flex" align="center" class="header-tabs-box">
          <div
            class="tabs-main"
            v-for="(item,index) in tabs"
            :key="index"
            @click="tabSwitch(index)"
            :class="active == index? 'tabs-active':''"
          >{{item}}</div>
          <div class="tabs-border" :style="{left:px}"></div>
        </el-row>
      </el-row>
    </el-header>
    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <PublicForm @search="search" :teamOption='teamOption' :subcontractOption='subcontractOption' :key="formKey" @teamOptionEmit='teamOptionEmit' />
        <el-form :inline="true">
          <el-form-item label="展示:">
            <el-checkbox-group v-model="checkArr" @change="checkChange">
              <el-checkbox :label="item.label" v-for="(item,index) in checkBoxList" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <el-row>
          <!-- <el-button type="primary" @click="handleDownloadExcel" :loading="load">下载考勤报表</el-button> -->
          <el-table style="width: 100%;margin-top:40px" :data="tableData">
            <el-table-column align="center" label="姓名" prop="userName"></el-table-column>
            <el-table-column align="center" label="分包单位" prop="subcontractName"></el-table-column>
            <el-table-column align="center" label="班组名称" prop="teamName"></el-table-column>
            <el-table-column align="center" label="考勤记录">
              <el-table-column align="center" prop="normalCount" label="应勤天数"></el-table-column>
              <el-table-column align="center"  prop="attendanceCount" label="实勤天数"></el-table-column>
              <el-table-column align="center"  prop="missTime" label="漏打卡次数"></el-table-column>
              <el-table-column align="center"  prop="lateCount" label="迟到天数"></el-table-column>
              <el-table-column align="center"  prop="earlyLeaveCount" label="早退天数"></el-table-column>
              <el-table-column align="center"  prop="absenteeismCount" label="旷工天数"></el-table-column>
              <el-table-column align="center"  prop="leaveCount" label="请假天数"></el-table-column>
            </el-table-column>
          </el-table>
        </el-row>
        <Pagination :total='tableData.length' @pagination='pagination' :pageSize='formInline.pageSize' :pageNum='formInline.pageNum' />
      </div>
    </el-main>
  </el-container>
</template>
<script>
import PublicForm from "./component/PublicForm";
import PublicTable from "./component/PublicTable";
import downloadExcel from "@/plugin/downloadExcel";
import { throttle } from "@/plugin/throttle";
import {index,scrollTable,teamListOrSubcontract} from "./mixins";
import { store } from "@/plugin/observable";
export default {
    mixins:[index,scrollTable,teamListOrSubcontract],
  components: {
    PublicForm,
    PublicTable
  },
  data() {
    return {
      px: 0,
      active: 0,
      tabs: ["在职", "离职", "全部"],
      checkBoxList: [
        { label: "应勤天数", prop: "normalCount" },
        { label: "实勤天数", prop: "attendanceCount" },
        { label: "漏打卡次数", prop: "missTime" },
        { label: "迟到天数", prop: "lateCount" },
        { label: "早退天数", prop: "earlyLeaveCount" },
        { label: "旷工天数", prop: "absenteeismCount" },
        { label: "请假天数", prop: "leaveCount" }
      ],
      checkArr: [],
      checkArrCopy: [],
      left: [
        { label: "姓名", prop: "userName" },
        { label: "分包单位", prop: "subcontractName" },
        { label: "班组名称", prop: "teamName" }
      ],
      right: [{ label: "累计时长", prop: "cumulative" }],
      excelLeftMain: {
        excelLeftHeader: ["姓名", "分包单位", "班组名称"],
        excelLeftProp: ["userName", "subcontractName", "teamName"]
      },
      excelCenterMain: {},
      formKey:0,
      tableData:[
        {
          userName: '笋子',
          subcontractName: '河北建业地产公司',
          teamName: '水电1组',
          normalCount: 30,
          attendanceCount: 28,
          missTime: 0,
          lateCount: 1,
          earlyLeaveCount: 0,
          absenteeismCount: 0,
          leaveCount: 1
        },
        {
          userName: '张克辉',
          subcontractName: '河北建业地产公司',
          teamName: '水电2组',
          normalCount: 30,
          attendanceCount: 29,
          missTime: 0,
          lateCount: 0,
          earlyLeaveCount: 0,
          absenteeismCount: 0,
          leaveCount: 1                 
        }
      ]
    };
  },
  methods: {
    getList() {
      this.loading = true;
      axios({
        url: "/SchedulingView/listAttendanceReport",
        method: "post",
        data: this.formInline
      }).then(res => {
          this.loading = false;
        if(res.data.code==200){
        this.total = res.data.total || 0;
        this.handle(res.data.data); //后端返回数据处理的函数
        }else{
          this.$message.error('获取数据失败')
        };
      });
    },
    //全选框变化的回调
    checkChange(newvalue) {
      this.checkArrCopy = this.checkBoxList.filter(
        i => newvalue.indexOf(i.label) >= 0
      ); //排序顺序与原始保持一致
      this.left = [...this.$options.data().left, ...this.checkArrCopy]; //左侧根据点击全选按钮随时变化
    },
    //tab切换的函数 里面的px是底边框移动
    tabSwitch(index) { 
      if(index===this.active){
        //如果相等 就是没切换tab 不需要请求
        return false;
      };
      this.left = this.$options.data().left;
      this.active = index;
      this.px = index * 112 + "px";
     
      this.activeChange(index);//页面头部tab切换
    },
    excelCenter(val) {
      //子组件返回的中间excel表需要的信息
      this.excelCenterMain = val;
      //this.excelCenterMain.excelCenterHeader 不固定的表头
      //this.excelCenterMain.excelCenterProp 不固定的字段名
    },
    //下载excel表
    handleDownloadExcel: throttle(
      function() {
        this.load = true;
         let arrheader = this.$options.data().excelLeftMain.excelLeftHeader;
      //获取左侧表头原始值
      let arrmain = this.$options.data().excelLeftMain.excelLeftProp;
      //获取左侧prop原始值
      this.checkArrCopy.forEach(e => {
        arrheader.push(e.label);
        arrmain.push(e.prop);
        //全选框-赋值
      });
      this.excelLeftMain.excelLeftHeader = arrheader;
      //左侧动态不固定的表头
      this.excelLeftMain.excelLeftProp = arrmain;
      //左侧动态不固定的prop
        downloadExcel(
          [
            ...this.excelLeftMain.excelLeftHeader,
            ...this.excelCenterMain.excelCenterHeader,
            "累计时长"
          ], //头
          this.tableData, //主体
          [
            ...this.excelLeftMain.excelLeftProp,
            ...this.excelCenterMain.excelCenterProp,
            "cumulative"
          ], //prop
          "考勤报表"
        ).then(() => {
          this.load = false;
        });
      },
      2000,
      1000
    ),
    //搜索函数
    // search(val){
    //     if(val){
    //      Object.assign(this.formInline, val);
    //     }else{
    //        this.formInline = this.$options.data().formInline;
    //         this.formInline.attendanceMonth = moment().format("YYYY-MM");
    //     }
    //     this.getList();
  
    // },
    // pagination(val){
    //   Object.assign(this.formInline,val);
    //   this.getList();
    // },
       // handle(data) {
        //   if(!Array.isArray(data)||data.length===0){
        //     //如果没有数据 进行拦截
        //     this.tableData = [];
        //     return false;
        //   };
        //   //数据处理函数
        //   let arr = [];
        //   let newarr = [];
        //   data.forEach(e => {
        //     if (arr.indexOf(e.userId) == -1) {
        //       //返回数据的userId去重放到新数组中
        //       arr.push(e.userId);
        //     }
        //   });
        //   arr.sort((n1, n2) => n1 - n2); //userId排序
        //   arr.forEach((element, index) => {
        //     let arrcopy = data.filter(e => e.userId == element);
        //     //过滤出返回数据中和arr每一项的userId相等的数组
        //     let obj = Object.assign({}, arrcopy[0]); //将字段拷贝进去
        //     let missTime = 0;
        //     let cumulative = 0;
        //     //定义漏卡次数
        //     arrcopy.forEach(ele => {
        //       //时间字段名和字段值一致是因为和表格的prop对应
        //       if(ele.status==1){
        //         //状态1对应漏卡次数
        //         missTime += 1;
        //       };
        //       if(typeof ele.countMinutes === "number"){
        //         //累积时长的结算
        //         cumulative += ele.countMinutes;
        //       };
        //       obj[ele.createTime] = this.vacation(ele.status);//状态switch因为excel
        //     });
        //     obj['missTime'] = missTime;
        //     obj['cumulative'] = cumulative;
        //     newarr.push(obj);
        //     //表格显示数据的格式
        //   });
        //   this.tableData = newarr;
        // },
    vacation(val) {
      switch (val) {
        case 0:
          return "旷工";
          break;
        case 1:
          return "漏卡";
          break;
        case 2:
          return "休息";
          break;
        case 3:
          return "早退";
          break;
        case 4:
          return "白班";
          break;
        case 5:
          return "夜班";
          break;
        case 6:
          return "迟到";
          break;
      }
    },
    activeChange(index){
     this.formInline = this.$options.data().formInline;//数据重置
     this.teamOption = false;
     this.formInline.projectId = store.projectId;
     this.checkArr = this.checkArrCopy = [];//数据重置
      this.formInline.attendanceMonth = moment().format("YYYY-MM");//初始渲染选择当前月份
      this.formKey+=1;//搜索表单重新渲染
      this.formInline.status = index!==2?index:''
     this.getList();//请求数据
    }
  },
  mounted(){
    this.activeChange(0);//页面头部tab切换
      this.teamListOrSubcontract(
        "querySubContractCorpname", {
          projectId: store.projectId
        },
        "subcontractOption"
      ); //获取分包下拉列表
  }
};
</script>
<style lang='scss'>
#attendanceReport {
  .demo-form-inline {
    .el-form-item {
      margin-right: 64px;
    }
  }
}
</style>

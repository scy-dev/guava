<template>
  <el-container class="public-box">
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
          >{{item.name}}</div>
          <div class="tabs-border" :style="{left:px}"></div>
        </el-row>
      </el-row>
    </el-header>

    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="search-content-main">
          <span>班组：</span>
          <el-select v-model="formInline.teamId" placeholder="请选择班组">
            <el-option
              v-for="item in options"
              :key="item.teamId"
              :label="item.teamName"
              :value="item.teamId"
            ></el-option>
          </el-select>

          <span>薪资月份：</span>
          <el-date-picker
            v-model="formInline.attendanceMonth"
            @change="selectTime"
            :clearable='false'
            value-format="yyyy-MM"
            type="month"
            placeholder="请选择"
             :picker-options="pickerOptions"
          ></el-date-picker>

          <span>分包单位：</span>
          <el-select v-model="formInline.subcontractId" placeholder="请选择分包单位">
            <el-option
              v-for="item in options2"
              :key="item.subContractId"
              :label="item.corpname"
              :value="item.subContractId"
            ></el-option>
          </el-select>
        </div>

        <div class="search-content-main-margin">
          <span>姓名：</span>
          <el-input v-model="formInline.userName" placeholder="请输入姓名"></el-input>
          <el-button type="primary" @click="search(formInline)">搜索</el-button>
          <el-button @click="search(null)">重置</el-button>
        </div>

        <el-button type="primary" style="margin-top:40px;" @click="handleDownloadExcel" :loading='load'>导出Excel表</el-button>
        <!-- <Switchoverone
          :tableData="tableData"
          :left="left"
          :right="right"
          :loading="loading"
          @selectionChange = 'selectionChange'
        ></Switchoverone> -->
        <div id="public-table" style="margin-top: 40px;">
          <el-table :data="tableData" style="width: 100%" :key="key" @selection-change='selectionChange'>
            <el-table-column fixed type="selection"  min-width="60"></el-table-column>
            <el-table-column fixed type="index" label="序号" width="80"></el-table-column>
            <el-table-column fixed :prop="item.prop" :label="item.label" v-for="(item,index) in left" :key="index" :width="right.length>0?item.label.length*16+32:'auto'"></el-table-column>
            <el-table-column :prop="item.prop" :label="item.label" v-for="(item,index) in right" :key="index" :width="item.label.length*16+32"></el-table-column>
          </el-table>
          <div class="none-list" v-show="tableData.length==0">暂无数据</div>
        </div>

         <Pagination :total='total' @pagination='pagination' :pageSize='formInline.pageSize' :pageNum='formInline.pageNum' />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { throttle } from "@/plugin/throttle";
import downloadExcel from "@/plugin/downloadExcel";
import { index } from "../AttendanceManagement/mixins/index";
export default {
  mixins:[index],
  props: {
      tableData: {
        //表格数据
        type: Array,
        default: []
      },
      left: {
        //左侧的表格头
        type: Array,
        default: []
      },
      right: {
        //右侧的表格头
        type: Array,
        default: []
      },
    },
  data() {
    return {
      key:0,
      activeName: "second",
      active: null,
      px: 0,
      load:false,
      options: [],
       options2: [],
      name: "",
      tabs: [{ name: "时薪" }, { name: "日薪" }, { name: "月薪" }],
      left: [
        { label: "姓名", prop: "userName" },
        { label: "身份证号码", prop: "idCard" },
        { label: "工种", prop: "workType" }
      ],
      right: [
        { prop: "attendanceShouldBe", label: "应出勤天数", },
        { prop: "actualAttendance", label: "实际出勤天数" },
        { prop: "salaryHour", label: "基本薪资/小时" },
        { prop: "salary", label: "基本薪资" },
        { prop: "workingOvertime", label: "工作日加班时长"},
        { prop: "workingOvertimeSalary", label: "工作日加班薪资" },
        { prop: "WeekendOvertime", label: "周末加班时长" },
        { prop: "restDaySalary", label: "休息日加班薪资" },
        { prop: "holidayOvertime", label: "节假日加班时长" },
        { prop: "holidayOvertimeSalary", label: "节假日加班薪资" },
        { prop: "wagesPayable", label: "应发薪资" }
      ],
      selectionArr:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= new Date().getTime();
        }
      }
    };
  },
   watch:{
     tableData(){
       this.key+=1;
     }
   },
  methods: {
    selectionChange(val){
        this.$emit('selectionChange',val)
      },
    //分页
        pagination(val){
          Object.assign(this.formInline,val);
          this.getList();
        },
    //tab切换的函数 里面的px是底边框移动
    tabSwitch(index) {
      this.search();
      if (index === this.active) {
        //如果相等 就是没切换tab 不需要请求
        return false;
      }
      this.active = index;
      this.px = index * 112 + "px";
      // this.getList();
    },
    tabProp(index) {
      switch (index) {
        case 0:
          this.left = this.$options.data().left;
          this.right =this.$options.data().right ;
          break;
        case 1:
          this.left = [...this.$options.data().left,  { label: "应出勤天数", prop: "attendanceShouldBe" },
              { label: "实际出勤天数", prop: "actualAttendance" },
              { label: "基本薪资/天", prop: "salaryDay" },
              { label: "加班天数", prop: "jiaBanCount" },
              { label: "应发薪资", prop: "wagesPayable" }];
          this.right = [];
          break;
        case 2:
          this.left = this.$options.data().left;
          let copy = [...this.$options.data().right];
          copy[2] =  { prop: "salaryDay", label: "基本薪资/天" };
          this.right = copy;
          break;
      };
      
    },
    //表格渲染
   async getList() {
     let obj = Object.assign({},this.formInline)
        obj.status= this.active + 1;
     await axios({
        url: `${this.tianweiyao}/SalaryManagement/listSalaryManagement`,
        method: "post",
        params: obj
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
      this.tabProp(this.active);
    },
    //重置
    empty(){
      // this.$options.data()

    },
    selectionChange(val){
      this.selectionArr = val;
    },
    //导出下载excel表
    handleDownloadExcel: throttle(
      function() {
        this.load = true;
        let left = {};
        let right = {};
        excel(left,this.left);
        excel(right,this.right);

        function excel(data,arr){
          data.label = [];
          data.prop = [];
          arr.forEach(e => {
              data.label.push(e.label);
              data.prop.push(e.prop);
          });
        };
        downloadExcel(
          [...left.label,...right.label], //头
          this.selectionArr, //主体
          [
            ...left.prop,
            ...right.prop], //prop
          "考勤报表"
        ).then(() => {
          this.load = false;
        });
      },
      2000,
      1000
    ),
    selectTime(val) {
      this.timevalue = val;
    },
    down(url, obj, data) {
      axios({
        url: `${this.liuxiancai}`+url,
        method: "post",
        params: obj
      }).then(res => {
        if (res.data.code == 200) {
          this[data] = res.data.data;
        }
      });
    }
  },
  created() {
    this.formInline.attendanceMonth = moment().format("YYYY-MM");
    this.tabSwitch(0);
    this.down("/Projectmanager/project/queryTeamName", { subcontractId: 1 }, "options");
    this.down("/Projectmanager/project/querySubContractCorpname", { projectId: 1 }, "options2");
  }
};
</script>

<style scoped lang="scss">
  .is-leaf{
    background:#EEF1FB;
  }

.search-content-main {
  span:first-child {
    margin-left: 0px;
  }
  span {
    font-size: 16px;
    color: #333333;
    margin-left: 64px;
  }
  .el-select {
    width: 280px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 280px;
  }
  .el-input {
    width: 280px;
  }
}
.search-content-main-margin {
  font-size: 16px;
  color: #333333;
  margin-top: 30px;
  .el-button--primary {
    margin-left: 64px;
  }
  .el-input {
    width: 280px;
  }
}
</style>
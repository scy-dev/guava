<template>
  <div id="public-formInlines">
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline inline-form"
      label-width="72px"
    >
    <el-form-item label="姓名:">
        <el-input v-model="formInline.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="考勤月份:">
        <el-date-picker
          :editable="false"
          :clearable='false'
          v-model="formInline.attendanceMonth"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分包单位:" prop="mobile">
        <el-select v-model="formInline.subcontractId" placeholder="请选择分包单位" @change="subcontractOptionChange">
          <el-option
            :label="item.corpname"
            :value="item.subContractId"
            v-for="(item,index) in subcontractOption"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="班组:" v-show="teamOption">
        <el-select v-model="formInline.teamId" placeholder="请选择班组" >
          <el-option
            :label="item.teamName"
            :value="item.teamId"
            v-for="(item,index) in teamOption"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form>
  </div>
</template>
<script>
import { throttle } from "@/plugin/throttle";
import {teamListOrSubcontract} from "../mixins";
export default {
  mixins:[teamListOrSubcontract],
  props:{
    teamOption:{
      type:[Array,Boolean],
      default:false
    },
    subcontractOption:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      formInline: {
        teamId: "", //班组id
        subcontractId: "", //分包单位id
        attendanceMonth: moment().format("YYYY-MM"), //查询的月份
        userName: "" //用户姓名
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= new Date().getTime();
        }
      }
    };
  },
  methods: {
    subcontractOptionChange(val){
      this.formInline.teamId = null;
       this.teamListOrSubcontract(
        "queryTeamName", {
          subcontractId: val
        },
        "teamOption",true
      ); //获取班组下拉列表
    },
    //搜索
    search:throttle(function(){
       this.$emit("search", this.formInline);
    },2000,1000),
      //重置
    reset:throttle(function(){
       Object.assign(this.formInline, this.$options.data().formInline);
      this.$emit("search", null);
    },2000,1000)
  }
};
</script>
<style lang="scss">
#public-formInlines {
  .el-form-item__label {
    text-align: left;
  }
}
</style>

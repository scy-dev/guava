<template>
  <el-container class="public-box" id="AttendanceRecords">
    <!-- 这里是头部-->
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">考勤记录</div>
      </el-row>
    </el-header>
    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-row>
          <el-table :data="tableData" style="width: 100%;margin-top:20px" v-loading='loading'>
                <el-table-column align="center" prop="personId" label="员工ID">
                </el-table-column>
                <el-table-column align="center" prop="fullName" label="姓名" width="200">
                </el-table-column>
                <el-table-column align="center" prop="type" label="出入类型">
                  <template slot-scope="scope">
                    {{scope.row === 1 ? '出' : '入'}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="time" label="出入时间">
                  <template slot-scope="scope">
                    <div>{{scope.row.time|timestampToTime}}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column align="center" prop="image" label="出入图像">
                  <template slot-scope="scope">
                    <a :href="scope.row.image">图像链接</a>
                  </template>
                </el-table-column> -->
                <!-- <el-table-column align="center" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="详情" placement="top">
                      <i class="icon el-icon-document" @click="handleDetail(scope.row)"></i>
                    </el-tooltip>
                  </template>
                </el-table-column> -->
          </el-table>
        </el-row>
        <!-- 分页组件 -->
        <template>
          <el-row type="flex" justify="end" id="pagination-containers">
            <el-pagination class="page-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
            </el-pagination>            
          </el-row>
        </template>
      </div>
    </el-main>
    <!-- 考勤记录详情 -->
    <el-dialog class="dialog" v-if="deviceDetail != null" title="设备详情" :visible.sync="deviceVisible" width="700px" @click='deviceVisible = false'>
      <div class="content">
        <el-divider content-position="left">设备基本信息</el-divider>
        <div class="base-info">
          <ul>
            <li>
              <span class="box">
                <i class="label">设备ID：</i>
                <i class="value">{{deviceDetail.shadowId}}</i>
              </span>
              <span class="box">
                <i class="label">设备名：</i>
                <i class="value">{{deviceDetail.deviceName}}</i>
              </span>
            </li>
            <li>
              <span class="box">
                <i class="label">关联IoT设备名：</i>
                <i class="value">{{deviceDetail.iotVenderBrandName}}</i>
              </span>
              <span class="box">
                <i class="label">设备所在位置：</i>
                <i class="value">{{deviceDetail.deviceAddress}}</i>
              </span>
            </li>
            <li>
              <span class="box">
                <i class="label">关联IoT设备型号：</i>
                <i class="value">{{deviceDetail.productModel}}</i>
              </span>
              <span class="box">
                <i class="label">关联IoT品牌/型号：</i>
                <i class="value">{{deviceDetail.productTypeCategory}}</i>
              </span>
            </li>
            <li>
              <span class="box">
                <i class="label">固件版本：</i>
                <i class="value">{{deviceDetail.firmwareVersion}}</i>
              </span>
              <span class="box">
                <i class="label">最后上线时间：</i>
                <i class="value">{{deviceDetail.onlineTime}}</i>
              </span>
            </li>
          </ul>
        </div>
        <el-divider content-position="left">设备状态</el-divider>
        <div class="device-status">
          <ul>
            <li>
              <span class="box">
                <i class="label">健康状态：</i>
                <i class="value">{{deviceDetail.status}}</i>
              </span>
              <span class="box">
                <i class="label">安全状态：</i>
                <i class="value">{{deviceDetail.seStatus}}</i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>    
  </el-container>
</template>
<script>
import PublicForm from './component/PublicForm'
import PublicTable from './component/PublicTable'
import {index,teamListOrSubcontract} from "./mixins";
import { recordList } from '@/api/api';
export default {
  data(){
    return{
      tableData:[
        {
          id: 1,
          enableFlag: null,
          creatorId: null,
          createTime: null,
          updaterId: null,
          updateTime: null,
          ids: null,
          personId: 1,
          fullName: 'dsa',
          type: 1,
          img: 'ftp://10.22.0.18:8010/IdentifyRecords/2020-08-05/14/spot-20200805_145105_523_123.jpg',
          time: 1596610265526
        }
      ],
      page:{
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }, 
      loading: false,
      deviceDetail:null,        
      deviceVisible: false
    }
  },
  components:{
    PublicForm,
  },
  mixins: [index,teamListOrSubcontract],
  methods:{
    handleDetail(data){
      /**
       * @description 设备详情展示
       */
      this.deviceDetail = JSON.parse(JSON.stringify(data));
      this.deviceVisible = true;
    },
    handleSizeChange(val){
      /**
       * @description 分页
       */
      this.page.pageSize = val;
      this.getRecordHandle();
    },
    handleCurrentChange(val){
      /**
       * @description 当前页
       */
      this.page.pageNum = val;
      this.getRecordHandle();
    },
    getRecordHandle(){
      /**
       * @description 获取记录列表
       * @param {Number} pageSize
       * @param {Number} pageNum
       */
      let param = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      };
      this.loading = true;
      recordList(param).then(res=>{
        if(res.err_CODE === 0){
          this.loading = false;
          this.tableData = res.data.list;
          res.data.list.length > 0 ? this.page.total = res.data.list.length : this.page.total = 0;
        }else{
          this.$message.error(res.err_MESSAGE);
        }
      })
    }
  },
  mounted(){
    this.getRecordHandle();
  }

}
</script>
<style lang='scss'>
#AttendanceRecords {
  .demo-form-inline {
    .el-form-item {
      margin-right: 64px;
    }
  } 
 
}
</style>

<style lang="scss" scoped>
#AttendanceRecords .dialog .content{
  height: 340px;
  box-sizing: border-box;

  .base-info,.device-status{
    ul>li{
      height: 40px;
      line-height: 40px;

      span.box {
        display: inline-block;
        width: 49%;
        i{
          display: inline-block;
          font-style: normal;
          font-size: 12px;
        }
        i.label{
          margin-right: 10px;
        }
        i.value{
          font-weight: bolder;
        }
      }
    }
  }
}
</style>
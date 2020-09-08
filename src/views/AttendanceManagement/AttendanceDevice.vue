<template>
  <el-container class="public-box" id="attendanceDevice">
    <el-header height="25px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">设备信息</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="contentTable">
            <!--列表-->
            <el-table size="small" class="userTab"  :data="deviceList" highlight-current-row border element-loading-text="拼命加载中" style="width: 100%;">
              <el-table-column align="center" prop="deviceName" label="设备名">
              </el-table-column>
              <el-table-column align="center" prop="deviceKey" label="设备标识" width="300">
              </el-table-column>
              <el-table-column align="center" prop="location" label="位置">
                <template slot-scope="scoped">
                 {{scoped.row.location == null ? '暂无' : scoped.row.location}}
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" prop="iotVenderBrandName" label="关联IoT设备名">
              </el-table-column>
              <el-table-column align="center" prop="productTypeCategory" label="关联IoT品牌/型号" width="250">
              </el-table-column> -->
              <!-- <el-table-column align="center" prop="status" label="设备状态">
                <template slot-scope="scoped">
                  {{scoped.row.status == 1 ? '离线' : '在线'}}
                </template>
              </el-table-column> -->
              <!-- <el-table-column align="center" prop="seStatus" label="安全状态">
              </el-table-column> -->
              <!-- <el-table-column align="center" prop="onlineTime" label="最后上线时间" width="200">
              </el-table-column> -->
              <!-- <el-table-column align="center" prop="firmwareVersion" label="固件版本">
              </el-table-column> -->
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="详情" placement="top">
                    <i class="icon el-icon-document" @click="handleDetail(scope.row)"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="icon el-icon-edit" @click="handleEdit(scope.row)"></i>
                  </el-tooltip>                  
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <template>
              <el-row type="flex" justify="end" id="pagination-containers">
                <el-pagination class="page-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
                </el-pagination>            
              </el-row>
            </template>
            <!-- 设备详情页 -->
            <el-dialog id="system-con" class="dialog" v-if="deviceDetail != null" title="设备详情" :visible.sync="deviceVisible" width="700px" @click='deviceVisible = false'>
              <div class="content">
                <el-divider content-position="left">设备基本信息</el-divider>
                <div class="base-info">
                  <ul>
                    <li>
                      <span class="box">
                        <i class="label">设备ID：</i>
                        <i class="value">{{deviceDetail.id}}</i>
                      </span>
                      <span class="box">
                        <i class="label">设备名：</i>
                        <i class="value">{{deviceDetail.deviceName}}</i>
                      </span>
                    </li>
                    <li>
                      <span class="box">
                        <i class="label">设备SN：</i>
                        <i class="value">{{deviceDetail.deviceKey}}</i>
                      </span>
                      <span class="box">
                        <i class="label">设备所在位置：</i>
                        <i class="value">{{deviceDetail.location}}</i>
                      </span>
                    </li>
                    <!-- <li>
                      <span class="box">
                        <i class="label">设备状态：</i>
                        <i class="value">{{deviceDetail.status == 1 ? '离线' : '在线'}}</i>
                      </span>
                      <span class="box">
                        <i class="label">关联IoT品牌/型号：</i>
                        <i class="value">{{deviceDetail.status == 1 ? '离线' : '在线'}}</i>
                      </span>
                    </li> -->
                    <!-- <li>
                      <span class="box">
                        <i class="label">固件版本：</i>
                        <i class="value">{{deviceDetail.firmwareVersion}}</i>
                      </span>
                      <span class="box">
                        <i class="label">最后上线时间：</i>
                        <i class="value">{{deviceDetail.onlineTime}}</i>
                      </span>
                    </li> -->
                  </ul>
                </div>
                <el-divider content-position="left">设备状态</el-divider>
                <div class="device-status">
                  <ul>
                    <li>
                      <span class="box">
                        <i class="label">健康状态：</i>
                        <i class="value">{{deviceDetail.status == 1 ? '离线' : '在线'}}</i>
                      </span>
                      <!-- <span class="box">
                        <i class="label">安全状态：</i>
                        <i class="value">{{deviceDetail.seStatus}}</i>
                      </span> -->
                    </li>
                  </ul>
                </div>
              </div>
            </el-dialog>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import { deviceList } from '@/api/api';
export default {
  data() {
    return {
      deviceVisible:　false,
      deviceList:[
        {
          shadowId: 1,
          deviceName: '闸机1',
          productModel: 'SD0601.10',
          productTypeCategory: 'xx品牌/SD0604.10',
          deviceAddress: '东岸尚景东门',
          iotVenderBrandName: '闸机',
          status: '正常',
          seStatus: '正常',
          onlineTime: '2020.08.02 10:30',
          firmwareVersion: '1.0.0.2',
        },
        {
          shadowId: 2,
          deviceName: '闸机2',
          productModel: 'SD0601.11',
          productTypeCategory: 'xx品牌/SD0605.22',
          deviceAddress: '东岸尚景东门',
          iotVenderBrandName: '闸机',
          status: '离线',
          seStatus: '--',
          onlineTime: '2020.08.02 04:30',
          firmwareVersion: '1.0.0.2',
        },
        {
          shadowId: 3,
          deviceName: '西门-闸机1',
          productModel: 'SD0601.11',
          productTypeCategory: 'xx品牌/SD0605.22',
          deviceAddress: '东岸尚景西门',
          iotVenderBrandName: '闸机',
          status: '正常',
          seStatus: '正常',
          onlineTime: '2020.08.02 04:30',
          firmwareVersion: '1.0.0.1',
        }
      ],
      deviceDetail:null,
      page:{
        pageNum: 1,
        pageSize: 10,
        total: 0,
        search: null
      }
    }
  },
  watch: {},
  created() {
  },
  mounted(){
    this.handleList();
    // this.deviceList.length > 0 ? this.page.total = this.deviceList.length : this.page.total = 0;
  },
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
       * @description 分页大小改变
       */
      this.page.pageSize = val;
      this.handleList();
    },
    handleCurrentChange(val){
      /**
       * @description 当前页改变
       */
      this.page.pageNum = val;
      this.handleList();
    },
    handleEdit(data){
      this.$router.push({path: '/device/editequipment',query:{param: JSON.stringify(data)}})
    },
    handleList(){
      /**
       * @description 获取设备信息列表
       * @param {String} deviceName 设备名称
       * @param {Number} pageNum 页码
       * @param {Number} pageSize 每页显示条数
       */
      let param = {
        deviceName: this.page.search,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      };
      deviceList(param).then(res=>{
        if(res.err_CODE === 0){
          res.data.list.length > 0 ? this.deviceList = res.data.list : this.deviceList = [];
          this.page.total = res.data.total;
        }else{
          this.$message.error(res.err_MESSAGE);
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#attendanceDevice {
  .public-header-title {
    margin-top: 10px;
  }
  .search {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 40%;
    div {
      margin-bottom: 10px;
    }
    span {
      font-size: 16px;
      margin-left: 32px;
      color: #333333;
    }
    span:nth-of-type(1) {
      margin-left: 0;
    }
    .el-input {
      width: 280px;
    }
  }
  .content {
    margin-top: 30px;
    .el-table {
      margin-top: 40px;
      .icon {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background-color: #3c62d0;
      }
    }
  }
 #system-con .content{
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
}
</style>
<style lang="scss">
#attendanceDevice {
  .el-table {
    .cell {
      padding-left: 30px;
    }

    .icon{
      margin-right: 10px;
      font-size: 16px;
    }
  }
}
</style>

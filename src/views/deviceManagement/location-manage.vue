<template>
  <el-container class="public-box" id="workerList">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">位置管理</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="content">
          <div class="search">
            <el-col :span="16" class="fl">
              <span>关键字：</span>
              <el-input size="small" @change="Busmethod()" v-model="searchObj.locationName"  placeholder="请输入关键字查询" maxlength="20"></el-input>                        
            </el-col>
            <el-col :span="8" class="fr">
              <el-button size="small" type="primary" @click="handleLocation">添加位置</el-button>              
            </el-col>
          </div>
          <div class="contentTable">
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <el-table-column align="center" prop="locationName" label="位置名称"></el-table-column>
              <el-table-column align="center" prop="locationType" label="通行用途">
              </el-table-column>
              <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="icon el-icon-edit" @click="handleEdit(scope.row)"></i>
                  </el-tooltip>   
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="icon el-icon-delete" @click="handleDel(scope.row.id)"></i>
                  </el-tooltip>                                    
                </template>
              </el-table-column>
            </el-table>
            <pagination :total="total" :pageSize="searchObj.pageSize" :pageNum='searchObj.pageNum' @pagination="handlePage"></pagination>
          </div>
        </div>
      </div>
    </el-main>
    <!-- 去认证 -->
        <el-dialog
          title="实名认证"
          id="cerDialog"
          :visible.sync="cerVisible"
          v-if="workerInfo != null"
          width="700px"
          custom-class="addWorker addDialog"
          @click='closeDialog("add")'
        >
          <div class="dialogContent">
            <div class="headPic">
              <img src="../../assets/images/header.png" alt>
            </div>
            <div class="status">
              <div class="cerStatu">
                <ul>
                  <li>
                    <span class="label">姓名：</span>
                    <span class="value">{{workerInfo.fullName}}</span>
                  </li>
                  <li>
                    <span class="label">性别：</span>
                    <span class="value">{{workerInfo.sex == 0 ? '男' : '女'}}</span>                    
                  </li>
                  <li>
                    <span class="label">证件号码：</span>
                    <span class="value">{{workerInfo.idCard}}</span>                    
                  </li>    
                  <li>
                    <span class="label">状态：</span>
                    <span class="value">{{workerInfo.verified == 0 ? '未认证' : '已认证'}}</span>              
                  </li>                                   
                </ul>
              </div>
            </div>
          </div>
          <span slot="footer" style="text-align:center" class="dialog-footer">
            <el-button v-if="!validStatu" type="primary" @click="mqttHandle" :loading="btnLoading">{{btnLoading ? '认证中' : '开始认证'}}</el-button>
            <el-button v-else type="primary" @click="cerVisible = false">关 闭</el-button>
          </span>
      </el-dialog>
  </el-container>
</template>

<script>
import { locationList,editLocation } from '@/api/api';
import Pagination from "@/components/Pagination";
import AddWorker from "@/components/addWorker";
import { statusFilter, contractFilter } from "@/plugin/filterFunction";
import {serialNumber} from '@/views/AttendanceManagement/mixins';
import { store } from "@/plugin/observable";
export default {
  provide(){
    return{
      BusMethod:this.Busmethod
    }
  },
  name: "",
  mixins:[serialNumber],
  data() {
    return {
      cerVisible: false,
      active: null,
      btnLoading: false,
      searchObj: {
        locationName: "",
        pageNum: 1,
        pageSize: 10
      },
      status: "0",
      total: 0,
      options: [],
      tableData: [
        {
          id: 1,
          locationName: '南门',
          type: '入场'
        }    
      ],
      dialogVisible: false, //新增弹窗
      mateName: "", //面包屑
      activeName: "second",
      px: 0,
      workerInfo: null,
      tabs: [
        {
          name: "在职",
          status: "0"
        },
        {
          name: "离职",
          status: "1"
        },
        {
          name: "全部",
          status: ""
        }
      ],
      validStatu: false,
      loading: true,
      baseurl: "",
      projectId:store.projectId,
    };
  },
  components: { Pagination, AddWorker },
  filters: {
    statusFilter(val) {
      return statusFilter(val);
    },
    contractFilter(val) {
      return contractFilter(val);
    }
  },
  created() {
    // this.tabSwitch(0,"0");
    // this.Busmethod();
    // axios({
    //   url: "Projectmanager/project/querySubContractCorpname",
    //   method: "post",
    //   data: {
    //     projectId: this.projectId
    //   },
    //   transformRequest: this.transformRequest
    // }).then(res => {
    //   this.options = res.data.data;
    // });
  },
  mounted(){
    this.Busmethod();
  },
  methods: {
    // 公共请求方法
    Busmethod() {
      /**
       * @description 获取位置信息列表
       * @param {String} locationName 位置名称
       * @param {Number} pageNum 页码
       * @param {Number} pageSize 每页显示条数
       */
      let param = {
        locationName: this.searchObj.locationName,
        pageNum: this.searchObj.pageNum,
        pageSize: this.searchObj.pageSize,
      };
      this.tableData = [];
      locationList(param).then(res=>{
        if(res.err_CODE === 0){
          res.data.list.length > 0 ? this.tableData = res.data.list : this.tableData = [];
          this.total = res.data.list.length;
          this.loading = false;
        }else{
          this.loading = false;
          this.$message.error(res.err_MESSAGE);
        }
      })
    },
    handleCertificate(data){
      /**
       * @description 认证
       */
      this.cerVisible = true;
      this.workerInfo = JSON.parse(JSON.stringify(data));
    }, 
    //处理分页
    handlePage(page){
      Object.assign(this.searchObj,page)
      this.Busmethod();
    },
    //选择分包单位
    selectSub(val) {
      this.$set(this.searchObj, "subContractId", val);
    },
    //点击搜索
    Search() {
      this.Busmethod();
    },
    handleLocation(){
      this.$router.push({path: '/device/location/add'});
    },
    handleDel(id){
      /**
       * @description 删除位置
       * @param {Number} ids 位置ID集合
       * @param {Number} enableFlag 删除接口enableFlag传0
       */
      let param = {
        ids: [],
        enableFlag: 0,
        id: null,
        locationName: null,
        locationType: null
      };
      param.ids.push(id);

      this.$confirm('确定要删除吗，删除后将不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editLocation(param).then(res=>{
          if(res.err_CODE === 0){
            this.$message.success("删除成功");
            this.Busmethod();
          }else{
            this.$message.error("删除失败");
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleEdit(data){
      /**
       * @description 编辑信息页面展示
       * @param {String} type
       */
      this.$router.push({path: '/device/location/add',query:{type:'编辑',param: JSON.stringify(data)}})
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../styles/public.scss';
#workerList {
  .content {
    background-color: #fff;
    border-radius: 10px;
    .search {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      align-items: center;
      .fr{
        text-align: right;
      }
      span{
        margin-right: 5px;
      }

      .el-input {
        width: 280px;
      }
      .el-select {
        width: 280px;
      }
    }
    .contentTable {
      margin-top: 40px;
    }
  }
}
</style>
<style lang="scss">
@import "~@/styles/public.scss";
#workerList {
  .el-table {
    thead tr th {
      background-color: #fafafa;
    }
    .icon {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 100%;
    }
    .no {
      color: #f5222d;
      text-decoration: underline;
      font-weight: bold;
      cursor: pointer;
    }
    .yes {
      background-color: #3c62d0;
    }
    .cell {
      white-space: nowrap;
    }
  }
  .el-table th div {
    font-size: 16px;
    font-family: PingFangSC-Medium;
  }
  #cerDialog{
    .dialogContent{
      height: 300px;
      display: flex;
      flex-direction: row;
      .headPic,.status{
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .headPic{
        width: 300px;
        img{
          width: 184px;
          height: 184px;
        }
      }
      .status{
        flex: 1;
        ul>li{
          height: 40px;
          line-height: 40px;
          margin-left: 20px;

          span.label{
            display: inline-block;
            width: 80px;
          }
          span.btn{
            cursor: pointer;
            display: inline-block;
            width:60px;
            text-align: center;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            color: #fff;
            background: #3c62d0;
          }

          span.loading{
            color:#3c62d0;
            // font-weight: ;
          }
        }
      }     
    }
  }
}
.public-box {
  height: 100%;
  .tabs-active {
    color: #3c62d0;
  }
  .header-title-button {
    width: 100%;
    padding: 0 40px !important;
    .el-button + .el-button {
      margin-left: 16px;
    }
    .public-header-title {
      padding-top: 10px;
      font-size: 18px;
      height: 24px;
      line-height: 24px;
      font-weight: 900;
      color: #3e3e3e;
    }
  }
  .public-header {
    background: white;
    box-shadow: 0px 3px 22px -9px #ccc;
  }
  .public-main {
    box-sizing: border-box;
    padding: 40px;
    background: #f0f2f5;
    overflow: auto;
    .public-padding {
      padding: 40px;
    }
    .public-main-content {
      background: white;
      box-sizing: border-box;
    }
  }
}
</style>

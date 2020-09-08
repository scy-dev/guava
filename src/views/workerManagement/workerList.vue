<template>
  <el-container class="public-box" id="workerList">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">工人列表</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="content">
          <div class="search">
            <el-col :span="16" class="fl">
              <span>姓名：</span>
              <el-input size="small" v-model="searchObj.name" @change="Busmethod"  placeholder="请输入姓名" maxlength="20"></el-input>    
              <span class="mg20">身份证号码：</span>
              <el-input size="small" v-model="searchObj.idcard"  placeholder="请输入身份证号码" maxlength="18"></el-input>                        
            </el-col>
            <el-col :span="8" class="fr">
              <el-button size="small" type="primary" @click="handleAdd">新增工人</el-button>              
            </el-col>
          </div>
          <div class="contentTable">
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <!-- <el-table-column label="序号" width="100">
                <template slot-scope="scope">
                  <span>{{serialNumber(scope.$index,searchObj.pageNum,searchObj.pageSize)}}</span>
                </template>
              </el-table-column> -->
              <el-table-column align="center" prop="fullName" label="姓名"></el-table-column>
              <el-table-column align="center" prop="idCard" label="身份证号码"></el-table-column>
              <el-table-column align="center" prop="telephone" label="手机号码"></el-table-column>
              <el-table-column align="center" prop="address" label="居住地"></el-table-column>
              <el-table-column align="center" prop="createTime" label="录入时间">
                <template slot-scope="scope">
                  <div>{{scope.row.createTime|timestampToTime}}</div>
                </template>                
              </el-table-column>
              <el-table-column align="center" prop="verified" label="实名认证状态">
                <template slot-scope="scope">
                  <span class="statu" v-if="scope.row.verified != 0">已认证</span>
                  <span class="statu no" v-else @click="handleCertificate(scope.row)">未认证</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <span
                    style="color:#3C62D0;cursor: pointer;"
                    @click="goDetail(scope.row.fullName,scope.row.idCard,scope.row)"
                  >查看</span>
                  <!-- <span style="color:#E9E9E9">|</span>
                  <span
                    style="color:#F6C361;cursor: pointer;"
                    @click="leave(scope.row.idcard,scope.row.id)"
                  >离职</span> -->
                </template>
              </el-table-column>
            </el-table>
            <pagination :total="total" :pageSize="searchObj.pageSize" :pageNum='searchObj.pageNum' @pagination="handlePage"></pagination>
          </div>
        </div>
        <add-worker :dialogVisible="dialogVisible" @dialog="handleDia"></add-worker>
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
          @close='closeDialog("add")'
        >
          <div class="dialogContent">
            <div class="headPic">
              <img v-if="idImage == null" src="../../assets/images/header.png" alt="">
              <img v-else :src="idImage" alt>
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
                    <span class="value">{{workerInfo.verified == 0 ? '未认证' : validStatu ? '认证通过':'认证失败'}}</span>              
                  </li>                                   
                </ul>
              </div>
            </div>
          </div>
          <span slot="footer" style="text-align:center" class="dialog-footer">
            <el-button v-if="!validStatu" type="primary" @click="mqttHandle" :loading="btnLoading">{{btnLoading ? '认证中' : '开始认证'}}</el-button>
            <el-button v-else type="primary" @click="handleClose">关 闭</el-button>
          </span>
      </el-dialog>
  </el-container>
</template>

<script type="text/ecmascript-6">
import Pagination from "@/components/Pagination";
import AddWorker from "@/components/addWorker";
import { statusFilter, contractFilter } from "@/plugin/filterFunction";
import {serialNumber} from '@/views/AttendanceManagement/mixins';
import { store } from "@/plugin/observable";
import { workersList } from '@/api/api';
import { mqttConfig } from '../../../static/mqtt-config.js'
var mqtt = require('mqtt')
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
        name: "",
        idcard: "",
        subContractId: "",
        pageNum: 1,
        pageSize: 10
      },
      idImage: null,
      status: "0",
      total: 0,
      pageSize: 10,
      pageNum: 1,
      options: [],
      tableData: [],
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
      client: mqtt.connect(mqttConfig.url,{
        username: mqttConfig.userName,
        password: mqttConfig.password
      }),
    }
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
    console.log(mqttConfig);
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
    // this.Busmethod();

    // this.mqttHandle();
    
    // this.client =  MQTT.connect('mqtt://192.144.132.78:8083/mqtt');
    // console.log(MQTT);
  },
  mounted(){  
    this.Busmethod();
  },
  methods: {
    closeDialog(formName){
      if(formName == 'add'){
        this.cerVisible = false;
        this.validStatu = false;
        this.btnLoading = false;
        this.Busmethod();
      }
    },
    // 公共请求方法
    Busmethod() {
      /**
       * @description 获取工人信息列表
       * @param {String} fullName 姓名
       * @param {String} idCard 身份证号
       * @param {Number} verified 是否实名认证 0-未认证 1-已认证
       * @param {Number} pageNum 页码
       * @param {Number} pageSize 每页显示条数
       */
      let param = {
        fullName:this.searchObj.name,
        id: null,
        verified: null,
        pageNum: this.searchObj.pageNum,
        pageSize: this.searchObj.pageSize
      }; 

      workersList(param).then(res=>{
        if(res.err_CODE === 0){
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.list.length;
        }else{
          this.$message.error(res.err_MESSAGE);
        }
      })
    },
    mqttHandle(){
      /**
       * @description 使用mqtt进行实名认证
       */
      this.btnLoading = true;
      // this.client.on('connect',()=>{
      //   this.client.subscribe(`userId_${this.workerInfo.id}`,err=>{
      //     // 订阅成功后，进入第二步“认证中...”
      //     console.log("订阅：",err);
      //     console.log(`userId_${this.workerInfo.id}`);
      //     setTimeout(()=>{
      //       this.active = 2;
      //     },3000)
      //   })
      // })
      this.client.subscribe(`userId_${this.workerInfo.id}`,err=>{
        // 订阅成功后，进入第二步“认证中...”
        console.log(`userId_${this.workerInfo.id}`);
        setTimeout(()=>{
          this.active = 2;
        },3000)
      })
      // 接收消息
      this.client.on('message',(topic,message)=>{
        this.btnLoading = false;
        console.log(message.toString());
        if(message.toString().length > 0){
          this.validStatu = true;
          this.workerInfo.verified = 1;

          // 判断接收的message是否为空来控制页面认证后的展示信息及状态改变
          console.log(JSON.parse(message.toString()));
          if(JSON.parse(message.toString()).success){
            this.idCardInfo = JSON.parse(message.toString());
            this.idImage = 'data:image/png;base64,'+JSON.parse(message.toString()).idImage;
            this.validStatu = true;
            // console.log(this.idCardInfo);
          }else{
            this.validStatu = false;
          }

          setTimeout(()=>{
            // this.isShow = false;
          },1500)
        }
      })
      // 重连
      this.client.on('reconnect',err=>{
        console.log('重连机制')
      })
      // this.client.close();
    },    
    handleCertificate(data){
      /**
       * @description 认证
       */
      console.log(data);
      this.cerVisible = true;
      this.workerInfo = JSON.parse(JSON.stringify(data));
    }, 
    handleClose(){
      this.cerVisible = false;
      this.Busmethod();
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
    //点击重置
    Reset() {
      this.searchObj = this.$options.data().searchObj;
      this.Busmethod();
    },
    //设置离职
    leave(idcard, id) {
      this.$confirm("您是否确定设置该员工离职？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warning"
      }).then(() => {
        axios({
          url: "Personnel/person/leaveSetting",
          method: "post",
          transformRequest: this.transformRequest,
          data: {
            idcard: idcard,
            id: id
          }
        }).then(res => {
          if (res.data.message == "成功") {
            this.$message({
              message: "设置成功",
              type: "success"
            });
            if (this.tableData.length - 1 == 0) {
                if (this.searchObj.pageNum > 1) {
                  this.searchObj.pageNum -= 1;
                }
              }
            this.Busmethod();
          }
        });
      });
    },
    ChangeActive(active) {
      this.active = active;
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    handleDia(val){
      this.dialogVisible = val;
    },
    goDetail(name, idcard, id) {
      this.mateName = name;
      sessionStorage.setItem("mateName", name);
      this.$router.push({
        path: "/workerlist/detail",
        query: { idcard: idcard, id: JSON.stringify(id) }
      });
    },
  }
}
</script>

<style scoped lang="scss">
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

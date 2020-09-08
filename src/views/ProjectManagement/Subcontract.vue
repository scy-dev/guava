<template>
  <el-container class="public-box" id="sub">
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">分包单位</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="role-main">
          <span>单位名称：</span>
          <el-input v-model="corpname" placeholder="请输入分包单位" style="width:280px"></el-input>
          <div class="role-search">
            <el-button type="primary" @click="search" style="color:#fff">查询</el-button>
            <el-button @click="chongzhi">重置</el-button>
          </div>
          <div>
            <el-button type="primary" style="margin-top:40px;"><!--  @click="AddWorker" -->
              <router-link to="/subcontract/subcontractAdd" style="color:#fff">新增分包</router-link>
            </el-button>
          </div>
          <div class="contentTable">
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <el-table-column prop="subContractId" label="编号" width="100"></el-table-column>
              <el-table-column prop="corpname" label="分包单位" width="280"></el-table-column>
              <el-table-column prop="type" label="分包类型" width="180">
                <template slot-scope="scope">
                  <!-- {{scope.row}} -->
                  {{scope.row.type=='001'?'专业分包':''}}
                  {{scope.row.type=='002'?'设备分包':''}}
                  {{scope.row.type=='003'?'材料分包':''}}
                  {{scope.row.type=='004'?'后勤服务':''}}
                  {{scope.row.type=='005'?'特殊设备':''}}
                  {{scope.row.type=='006'?'劳务分包':''}}
                  {{scope.row.type=='007'?'监理':''}}
                  {{scope.row.type=='008'?'建设单位':''}}
                  {{scope.row.type=='009'?'总承包单位':''}}
                  {{scope.row.type=='010'?'勘察':''}}
                  {{scope.row.type=='011'?'设计单位':''}}
                </template>
              </el-table-column>
              <el-table-column prop="creditCode" label="信用代码" width="180"></el-table-column>
              <el-table-column prop="account" label="项目账号" width="180"></el-table-column>
              <el-table-column prop="principal" label="负责人员" width="180"></el-table-column>
              <el-table-column prop="phoneNumber" label="联系方式" width="180"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    style="border:0; color:#3C62D0"
                    @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    style="border:0;color:#3C62D0"
                    @click="handlechongzhi(scope.$index, scope.row)"
                  >重置密码</el-button>
                  <!-- <el-button
                                  type="text"
                                  size="mini"
                                  style="border:0;color:#D31919"
                                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="tkk">
              <el-dialog
                title="编辑分包信息"
                :visible.sync="diaVisible"
                width="28%"
                top="40px"
                :before-close="handleClose"
              >
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                  <el-form-item label="公司名称：" prop="corpname">
                    <el-input v-model="ruleForm.corpname" placeholder="什么什么公司" readonly class="ys"></el-input>
                  </el-form-item>
                  <el-form-item label="信用代码：" prop="creditCode">
                    <el-input v-model="ruleForm.creditCode" placeholder="1356654865468" readonly class="ys"></el-input>
                  </el-form-item>
                  <el-form-item label="分包类型" prop="type">
                     <el-input v-model="hehe" placeholder="总分包类型" readonly class="ys"></el-input>
                  </el-form-item>
                  <el-form-item label="负责人员：" prop="principal">
                    <el-input v-model="ruleForm.principal" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式：" prop="phoneNumber">
                    <el-input v-model="ruleForm.phoneNumber" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="分包内容：" class="hehe" prop="content">
                    <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入分包内容"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="quxiao">取 消</el-button>
                  <el-button type="primary" @click="queding('ruleForm')">确 定</el-button>
                </span>
              </el-dialog>
            </div>
            <!-- 重置密码双重弹框 -->
            <el-dialog :visible.sync="dVisible" width="28%" :show-close="false">
              <i class="el-icon-question" style="font-size:24px;color:rgba(250,173,20,1);"></i>
              <span
                style="font-size:16px;font-weight:500;color:rgba(0,0,0,0.85);line-height:24px;padding-left:5px;"
              >你确定重置该账号的密码？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dVisible = false">取 消</el-button>
                <el-button type="primary" @click="pass">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog :visible.sync="dVisible2" width="28%" :show-close="false">
              <i
                class="el-icon-success"
                style="font-size:24px;color:rgba(82,196,26,1);position:absolute;left:100px;top:60px"
              ></i>
              <div style="margin-left:105px">
                <span
                  style="font-size:16px;font-weight:500;color:rgba(0,0,0,0.85);line-height:24px;padding-left:10px;"
                >密码重置成功</span>
                <br>
                <span
                  style="font-size:14px;font-weight:400;color:rgba(0,0,0,0.65);margin-top:8px;padding-left:10px;"
                >新密码：</span>
                {{newPassword}}
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ok">确 定</el-button>
              </span>
            </el-dialog>
            <Pagination @pagination='pagination' :total='total' :pageSize='form.pageSize' :pageNum='form.pageNum' />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { throttle } from "@/plugin/throttle";
import {store} from '@/plugin/observable'
export default {
  data() {
    return {
      total:0,
      diaVisible: false,
      dVisible: false,
      dVisible2: false,
      loading: false, //加载
      hehe:'',
      workerId:'',
      ruleForm: {
        corpname: "",
        subContractId:'',
        creditCode: "",
        type: "",
        principal: "",
        phoneNumber: "",
        content: ""
      },
      corpname: "", //单位名称
      form: {
        projectId: '',
        pageNum: 1,
        pageSize: 10
      },
      account:'',//密码重置参数
      newPassword: "", //密码
      tableData: [], //列表
      rules: {
        principal: [
          { required: true, message: "请输入负责人员", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入分包内容", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //分页
     pagination(val){
       Object.assign(this.form,val);
       this.getList();
     },
    //请求列表
    getList() {
      this.loading = false;
      axios({
        url: "/Projectmanager/project/querySubContractInfo",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: this.form
      }).then(res => {
        this.loading = false;
        //判断有无数据;加载中
        if (res.data.code == 200) {
          this.total = res.data.data.total; 
          this.tableData = res.data.data.list;
        }
      });      
    },
    //加载
    loading: {
      type: Boolean,
      default: false
    },
    //搜索
    search:throttle(function() {
      this.form.corpname = this.corpname;
      this.form.pageNum = 1;
      this.getList();
    },2000,1000),
    //重置
    chongzhi:throttle(function() {
      /*this.form = this.$options.data().form;   
      this.corpname = "" 对象内清除搜索的对象，方法1 */ 
      this.corpname = "";
      this.form.corpname = "";       
      this.getList();
    },2000,1000),

    //编辑 弹框
    handleEdit(index, row) {
      this.diaVisible = true;
      //console.log(row);
      Object.assign(this.ruleForm, row);
      switch (this.ruleForm.type) {
        case '001':this.hehe='分包类型';break;
        case '002':this.hehe='专业分包';break;
        case '003':this.hehe='设备分包';break;
        case '004':this.hehe='材料分包';break;
        case '005':this.hehe='后勤服务';break;
        case '006':this.hehe='特殊设备';break;
        case '007':this.hehe='劳务分包';break;
        case '008':this.hehe='监理';break;
        case '009':this.hehe='建设单位';break;
        case '010':this.hehe='总承包单位';break;
        case '011':this.hehe='勘察';break;
        case '012':this.hehe='设计单位';break;
        default:
          break;
      }
    },
    //编辑分包
    getSub() {
      axios({
        url: "/Projectmanager/project/editSubContractInfo",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: {
          subContractId: this.ruleForm.subContractId, 
          principal: this.ruleForm.principal,
          phoneNumber: this.ruleForm.phoneNumber,
          content: this.ruleForm.content,
          workerId:store.workerId
        }
      }).then(res => {
        //this.state =  res.data.data
        this.getList();
        //console.log(res);
      });
    },
    //编辑弹框
    quxiao() {
      this.$refs.ruleForm.resetFields();
      this.diaVisible = false;
    },
    //编辑验证
    queding(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.diaVisible = false;
          this.getSub();
        } else {
          return false;
        }
      });
    },
    //重置
    handlechongzhi(index, row) {
      this.account=row.account
      this.dVisible = true;
    },
    //重置密码接口
    getWord(){
      axios({
        url: "/Projectmanager/project/resetpassword",
        method: "get",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        params:{account:this.account}
      }).then(res => {
        this.newPassword=res.data.data.newPassword
        //console.log(res.data.data.newPassword);
      });
    },
    //重置密码的确定按键
    pass() {
      this.dVisible2 = true;
      this.getWord()
    },
    ok() {
      this.dVisible = false;
      this.dVisible2 = false;
    }
  },
  mounted() {
    this.getList();
  },
  created() {
    this.form.projectId=store.projectId
    //console.log(this.form.projectId)
  }
};
</script>
<style scoped lang="scss">
@import '~@/styles/public.scss';
.role-main {
  span { 
    font-size: 16px;
    color: #333333;
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
<style lang="scss">
#sub .el-dialog__header {
  border: 0;
}
#sub .ys .el-input__inner{background-color: #D9D9D9}
</style>

<template>
  <el-container class="public-box" id="sub">
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">班组管理</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="role-main">
          <span>班组名称：</span>
          <el-input v-model="teamName" placeholder="请输入班组名称" style="width:280px"></el-input>
            <span style="margin-left:64px">分包单位：</span>
            <el-select v-model="teamState" placeholder="请选择分包单位" style="width:280px">
              <el-option
                  v-for="item in danwei"
                  :key="item.subContractId"
                  :label="item.corpname"
                  :value="item.corpname"
              ></el-option>
            </el-select>
          <div class="role-search">
            <el-button type="primary" @click="search" style="color:#fff">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
          <div>
            <el-button type="primary" style="margin-top:40px;" @click="AddBz">新增班组</el-button>
          </div>
          <div class="contentTable">
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <el-table-column prop="id" label="编号"></el-table-column>
              <el-table-column prop="teamName" label="班组名称"></el-table-column>
              <el-table-column prop="leaderName" label="班组长"></el-table-column>
              <el-table-column prop="corpname" label="分包单位"></el-table-column>
              <el-table-column prop="total" label="人数"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                  <span style="color:#3C62D0;cursor: pointer;font-size:14px"   @click="handlechakan(scope.row.name,scope.row)">查看</span>
                  <span style="color:#E9E9E9">|</span>
                  <span style="color:#3C62D0;cursor: pointer;font-size:14px" @click="handleEdit(scope.$index, scope.row)">编辑</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 新增弹框 -->
            <el-dialog
              class="bj"
              title="新增班组"
              :visible.sync="diVisible"
              width="28%"
              :before-close="handleClose"
            >
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item label="分包单位：" prop="subcontractId">
                  <el-select
                    v-model="ruleForm.subcontractId"
                    placeholder="请选择分包单位"
                    style="width:503px"
                  >
                    <el-option
                      v-for="item in danwei"
                      :key="item.subContractId"
                      :label="item.corpname"
                      :value="item.subContractId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="班组名称：" prop="teamName">
                  <el-input v-model="ruleForm.teamName" placeholder="请输入班组名称"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="quxiao">取 消</el-button>
                <el-button type="primary" @click="queding('ruleForm')">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 编辑弹框 -->
            <el-dialog
              class="bj bj2"
              title="编辑班组"
              :visible.sync="bjdiVisible"
              width="28%"
              :close="closed"
            >
              <el-form :model="ruleform" :rules="rules" ref="ruleform" class="demo-ruleForm">
                <el-form-item label="分包单位：" class="bs">
                  <!-- 禁止编辑 -->
                  <el-input v-model="ruleform.corpname" placeholder="请选择分包单位" readonly></el-input>
                </el-form-item>
                <el-form-item label="班组名称：" prop="teamName">
                  <el-input v-model="ruleform.teamName" placeholder="请输入班组名称"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="qx">取 消</el-button>
                <el-button type="primary" @click="qd('ruleform')">确 定</el-button>
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
      diVisible: false, //新增
      bjdiVisible: false, //编辑
      loading: false, //加载
      teamName: "",//搜索
      teamState: "",//分包单位
      //新增班组
      ruleForm: {
        teamName: "",
        subcontractId: ""
      },
      danwei: [], //新增班组的分包下拉
      //编辑班组
      ruleform: {
        teamName: "",
        corpname: ""
      },
      //传值参数  列表
      form: {
        corpname: "", //单位名称   可传可不传
        projectId: store.projectId, //session里面传值
        teamName: "", //班组名称   可传可不传
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      rules: {
        subcontractId: [
          { required: true, message: "请选择分包类型", trigger: "change" }
        ],
        teamName: [
          { required: true, message: "请输入班组名称", trigger: "blur" }
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
    //搜索
    search:throttle(function(){
      this.form.teamName = this.teamName;
      this.form.corpname = this.teamState;
      this.form.pageNum = 1;
      this.getList();
    },2000,1000),
    //重置
    reset:throttle(function(){
      this.teamName = "";
      this.form.teamName = ""; 
      this.teamState = "";
      this.form.corpname = "";       
      this.getList();
    },2000,1000),
    //请求列表
    getList() {
      this.loading = false;
      axios({
        url: "/Projectmanager/project/queryTeam",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: this.form
      }).then(res => {
        this.tableData = res.data.data.list;
        //判断有无数据;加载中
        if (res.data.code == 200) {
          this.total = res.data.data.total;
          this.loading = false;          
        }
        //console.log(res.data.data.list);
      });      
    },
    //加载
    loading: {
      type: Boolean,
      default: false
    },
    //新增
    AddBz() {
      this.diVisible = true;
      this.dw();
    },
    //新增分包下拉请求
    dw() {
      axios({
        url: "/Projectmanager/project/querySubContractCorpname",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        method: "post",
        data: {
          projectId: this.form.projectId
        }
      }).then(res => {
        this.danwei = res.data.data;
        //console.log(res.data.data);
      });
    },
    //查看
    handlechakan(data,row) {
      this.mateName = data;
      sessionStorage.setItem("mateName", data);
      this.$router.push({ 
        path: "/team/teamQuery",
        query: {
          name: row.name,//姓名
          teamId: row.teamId,//班组ID
          corpname:row.corpname//单位名称
        }
      });
    },
    //编辑
    handleEdit(index, row) {
      this.bjdiVisible = true;
      Object.assign(this.ruleform, row);
    },
    //编辑班组
    bianJ() {
      axios({
        url: "/Projectmanager/project/editTeam",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: {
          teamId:this.ruleform.teamId, 
          teamName: this.ruleform.teamName
        }
      }).then(res => {
        //this.state =  res.data.data
        this.getList();
        //console.log(res);
      });
    },
    //新增弹框关闭
    quxiao() {
      this.$refs.ruleForm.resetFields();
      this.diVisible = false;
    },
    //新增请求
    addBz() {
      axios({
        url: "/Projectmanager/project/addTeam",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: this.ruleForm
      }).then(res => {
        this.getList();
        //console.log(res.data.data);
      });
    },
    //新增验证
    queding(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.diVisible = false;
          this.addBz();
          this.getList()
        } else {
          return false;
        }
      });
    },
    //编辑弹框关闭
    qx() {
      this.$refs.ruleform.resetFields();
      this.bjdiVisible = false;
    },
    qd(ruleform) {
      this.$refs[ruleform].validate(valid => {
        if (valid) {
          this.bjdiVisible = false;
          this.bianJ()
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getList();
  },
  created() {
    this.dw();
    
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
.bj .el-form-item .el-form-item__content .el-input--suffix .el-input__inner {
  width: 492.83px;
}
.bj .el-input__suffix {
  right: 15px;
}
#sub .bj .el-dialog__header{padding: 20px 20px;}
#sub .bj2 .bs .el-input__inner{background-color:#D9D9D9}
</style>
<template>
  <el-container class="public-box" id="NewRule">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">{{$route.name}}</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="addNewRule">确定</el-button>
          <el-button @click="Cancel">取消</el-button>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main" style="flex-direction: column;">
      <div class="public-main-content radius public-padding">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          :inline="true"
        >
          <el-form-item label="排班名称：" prop="schedulingName">
            <el-input v-model="ruleForm.schedulingName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="班次规则：" prop="attendanceId">
            <el-select
              v-model="ruleForm.attendanceId"
              placeholder="请选择班次规则"
              @change="getAttendaceId"
            >
              <el-option
                :label="item.attendanceShifts.shiftsName"
                :value="item.attendanceShifts.id"
                v-for="(item,index) in options"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="public-main-content radius public-padding" style="margin-top:40px;flex:1">
        <div class="title">
          <span>工人：</span>
          <p>
            <span style="margin-right:8px;">已选择{{tags.length}}个员工</span>
            <el-button type="primary" @click="addWorker">添加工人</el-button>
          </p>
        </div>
        <div class="selectContant">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            closable
            type="info"
            @close="handleClose(tag)"
          >{{tag.name}}</el-tag>
        </div>
        <div class="title" style="margin-top:20px;">
          <span>设置工作日：</span>
        </div>
        <div style="margin:20px 0px 0px 15px;">
          <el-checkbox-group v-model="checkList" @change="checkChange">
            <el-checkbox label="1">周一</el-checkbox>
            <el-checkbox label="2">周二</el-checkbox>
            <el-checkbox label="3">周三</el-checkbox>
            <el-checkbox label="4">周四</el-checkbox>
            <el-checkbox label="5">周五</el-checkbox>
            <el-checkbox label="6">周六</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-dialog title="添加员工" :visible.sync="dialogTableVisible" custom-class="addWork">
          <div class="search">
            <div>
              <span>分包单位：</span>
              <el-select
                v-model="searchWorker.subContractId"
                placeholder="请选择分包单位"
                @change="selectComp"
              >
                <el-option
                  v-for="item in comp"
                  :key="item.subContractId"
                  :label="item.corpname"
                  :value="item.subContractId"
                ></el-option>
              </el-select>
            </div>
            <div v-if="visit">
              <span>班组：</span>
              <el-select v-model="searchWorker.teamId" placeholder="请选择班组">
                <el-option
                  v-for="item in team"
                  :key="item.teamId"
                  :label="item.teamName"
                  :value="item.teamId"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-button type="primary" @click="SearchWorker">查询</el-button>
              <el-button @click="Reset">重置</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-top:30px;"
            height="300"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            
          >
            <el-table-column type="selection" width="70" :selectable="select"></el-table-column>
            <el-table-column label="序号" width="100">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="idcard" label="身份证号码" width="220" show-overflow-tooltip></el-table-column>
            <el-table-column prop="corpname" label="分包单位" width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="teamName" label="班组名称" show-overflow-tooltip></el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="SelectWorker">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import { setTimeout } from "timers";
import { store } from "@/plugin/observable";
export default {
   beforeRouteEnter (to, from, next) {
    to.name==='编辑排班'? to.query.id?next():next({path:'/'}):next()
  },
  name: "",
  data() {
    return {
      ruleForm: {
        schedulingName: "",
        attendanceId: "",
        status: 1,
        projectId:store.projectId
      },
      //左侧表单验证
      rules: {
        schedulingName: [
          { required: true, message: "请输入排班名称", trigger: "blur" }
        ],
        attendanceId: [
          { required: true, message: "请选择班次规则", trigger: "change" }
        ]
      },
      options: [],
      tags: [],
      comp: [],
      team: [],
      searchWorker: {
        teamId: "",
        projectId:store.projectId,
        subContractId: "",
        type:2
      },
      tableData: [],
      multipleSelection: [],
      checkList: [],
      dialogTableVisible: false,
      loading:true,
      visit:false
    };
  },
  components: {},
  created() {
    //如果id存在，则是编辑
    if (this.$route.query.id) {
      axios({
        url: "ScheduRule/findScheduRule",
        method: "get",
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        Object.assign(this.ruleForm, res.data.data.scheduRule);
        this.$set(this.ruleForm, "status", 2);
        this.checkList = this.ruleForm.weekdayTime.split(",");
        this.tags = res.data.data.list;
      })
      .then(res=>{
        this.$refs['ruleForm'].clearValidate();
      });
    }
    //获取班次规则
    axios({
      url: "AttendanceShifts/listAllAttendanceShifts",
      method: "post"
    }).then(res => {
      console.log(res)
      this.options = res.data.data;
    });
  },
  methods: {
    //获取班次id
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    // 查询工人列表
    BusSearchWorker() {
      axios({
        url: this.liuxiancai+"/Personnel/person/queryWorkerList",
        method: "post",
        transformRequest: this.transformRequest,
        data: this.searchWorker
      }).then(res => {
        this.loading = false;
        this.tableData = res.data.data;
      })
      .then(res=>{
        for (var i = 0; i < this.tags.length; i++) {
            for (var index = 0; index < this.tableData.length; index++) {
              if (this.tags[i].id == this.tableData[index].id) {
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableData[index],
                  true
                );
              }
            }
          }
      });
    },
    select(row,index){
      if(row.status !== null){
        return this.tags.filter(e=>e.id==row.status).length>0?true:false;
      }else{
        return true;
      }
    },
    // 添加工人弹窗
    addWorker() {
      this.dialogTableVisible = true;
      this.BusSearchWorker();

      // 获取分包单位下拉
      axios({
        url:
          this.liuxiancai+"/Projectmanager/project/querySubContractCorpname",
        method: "post",
        transformRequest: this.transformRequest,
        data: {
          projectId: store.projectId
        }
      }).then(res => {
        this.comp = res.data.data;
      });
    },
    // 查询
    SearchWorker() {
      this.BusSearchWorker();
    },
    // 重置
    Reset() {
      this.visit = false;
      this.searchWorker = this.$options.data().searchWorker;
      this.BusSearchWorker();
    },
    // 选择分包单位
    selectComp(val) {
      this.visit = true;
      // 分包单位选择后请求分组
      axios({
        url: this.liuxiancai+"/Projectmanager/project/queryTeamName",
        method: "post",
        transformRequest: this.transformRequest,
        data: {
          subcontractId: val
        }
      }).then(res => {
        this.team = res.data.data;
      });
    },
    // 确定选择的工人
    SelectWorker() {
      this.tags = this.multipleSelection
      this.dialogTableVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 设置工作日
    checkChange(val) {
      console.log(val);
    },
    //添加
    addNewRule() {
      var arr = [];
      this.tags.forEach(val => {
        arr.push(val.id);
      });
      this.$set(this.ruleForm, "userId", arr);
      this.$set(this.ruleForm, "weekdayTime", this.checkList.join(","));
      console.log(this.ruleForm)
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios({
            url: "ScheduRule/saveScheduRule",
            method: "post",
            data: this.ruleForm
          }).then(res => {
            if (res.data.meaasge == "success" && this.ruleForm.id) {
              this.$message({
                message: "编辑成功",
                type: "success",
                onClose:()=>{
                  this.$router.push({ path: "/rule" });
                }
              });
            }else if(res.data.meaasge == "success"){
              this.$message({
                message: "新增成功",
                type: "success",
                onClose:()=>{
                  this.$router.push({ path: "/rule" });
                }
              });
            }else{
              this.$rmessage.error('失败，请检查')
            }
            console.log(res);
          });
        } else {
          return false;
        }
      });
    },
    Cancel() {
      this.$router.push({ path: "/rule" });
    }
  }
};
</script>

<style scoped lang="scss">
#NewRule {
  .public-main{
    
  }
  .public-header-title {
    margin-top: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    width: 60%;
    span {
      line-height: 40px;
    }
  }
  .selectContant {
    width: 60%;
    border-radius: 4px;
    padding-bottom: 10px;
    min-height: 120px;
    border: 1px solid rgba(217, 217, 217, 1);
    margin-top: 8px;
  }
  .el-tag {
    margin-left: 8px;
    margin-top: 8px;
  }
}
</style>
<style lang="scss">
#NewRule {
  .el-form-item {
    width: 32%;
    .el-form-item__content {
      display: block;
      width: 84%;
      .el-select {
        width: 100%;
      }
    }
    .el-form-item__label {
      color: #333333;
    }
    .el-form-item__label::before {
      top: 2px;
      right: -2px;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }
  .is-checked {
    span {
      color: #2e61d7;
    }
  }
  .addWork {
    .search {
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
      margin-top: 30px;
      > div:nth-of-type(2),
      > div:nth-of-type(1) {
        width: 40%;
        .el-select {
          width: 75%;
        }
      }
      > div:nth-of-type(2) {
        margin-left: 20px;
      }
      .el-button--primary {
        span {
          color: white;
        }
      }
      span {
        color: #333333;
        font-size: 16px;
      }
    }
  }
  .el-dialog__body {
    padding: 10px 40px;
  }
  .el-dialog {
    width: 53%;
  }
}
</style>

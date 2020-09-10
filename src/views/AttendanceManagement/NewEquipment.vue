<template>
  <el-container class="public-box" id="NewEquipment">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">{{$route.name}}</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="handleEdit('editForm')">确定</el-button>
          <el-button @click="Cancel">取消</el-button>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editForm"
          class="demo-ruleForm"
          :inline="true"
        >
          <el-form-item label="设备名称：" prop="deviceName">
            <el-input v-model="editForm.deviceName" placeholder="请输入设备名称" maxlength="20"></el-input>
          </el-form-item>
          <!-- <el-form-item label="设备类型：" prop="deviceType">
            <el-select v-model="ruleForm.deviceType" placeholder="请选择设备类型">
              <el-option label="人脸考勤机K系列" :value="1"></el-option>
              <el-option label="人脸考勤机S系列" :value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="序列号：" prop="deviceKey">
            <el-input v-model="editForm.deviceKey" disabled placeholder="请输入序列号" maxlength="20"></el-input>
          </el-form-item>
          <!-- <el-form-item label="设备品牌：" prop="equipmentBrand">
            <el-select v-model="ruleForm.equipmentBrand" placeholder="请选择设备品牌">
              <el-option label="小麦品牌" value="小麦品牌"></el-option>
              <el-option label="合作商品牌" value="合作商品牌"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="位置：" prop="location">
            <el-select v-model="editForm.locationId" placeholder="请选择安装位置">
              <el-option maxlength="20" v-for="(item,index) in location" :key="index" :label="item.locationName" :value="item.id"></el-option>
            </el-select>            
          </el-form-item>
          <el-form-item label="设备状态" prop="status" >
            <el-select v-model="editForm.status" placeholder="请选择设备状态" disabled>
              <el-option label="在线" :value="0"></el-option>
              <el-option label="离线" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="public-main-content radius public-padding" style="margin-top:40px;">
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
import { store } from "@/plugin/observable";
import { editDevice,locationList } from '@/api/api';
export default {
  // beforeRouteEnter (to, from, next) {
  //   to.name==='编辑设备'? to.query.id&&to.query.type?next():next({path:'/'}):next()
  // },
  name: "",
  data() {
    return {
      ruleForm: {
        deviceName: "",
        deviceType: "",
        deviceKey: "",
        equipmentBrand: "",
        location: "",
        generalPurpose: "",
        userId: [],
        projectId:store.projectId,
      },
      //左侧表单验证
      rules: {
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "change" }
        ],
        deviceKey: [
          { required: true, message: "请输入设备序列号", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择设备状态", trigger: "change" }
        ],
        location: [
          { required: true, message: "请输入安装位置", trigger: "blur" }
        ]
      },
      searchWorker: {
        teamId: "",
        projectId:store.projectId,
        subContractId: "",
        type:1
      },
      editForm:{
        id: null,
        deviceName: null,
        deviceKey: null,
        location: null,
        status: null,
        locationId: null
      },
      location:null,
      tags: [],
      tableData: [],
      multipleSelection: [],
      dialogTableVisible: false,
      comp: "",
      team: [],
      visit: false,
      loading: true
    };
  },
  components: {},
  created() {
    console.log(this.$route.query.param);
    this.getLocation();
    let deviceInfo = JSON.parse(this.$route.query.param);
    this.editForm = JSON.parse(JSON.stringify(deviceInfo));
    // if (this.$route.query.type) {
    //   axios({
    //     url: "AttendanceCheckWork/selectDeviceMangent",
    //     method: "get",
    //     params: {
    //       id: parseInt(this.$route.query.id)
    //     }
    //   }).then(res => {
    //     Object.assign(this.ruleForm,res.data.data.deviceManagement);
    //     this.ruleForm.deviceKey = res.data.data.deviceManagement.serialNumber
    //     this.tags = res.data.data.deviceUserList;
    //   })
    //   .then(res=>{
    //     this.$refs['ruleForm'].clearValidate();
    //   })
    // }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    // 工人列表是否禁选
    select(row,index){
      if(row.status !== null){
        return this.tags.filter(e=>e.id==row.status).length>0?true:false;
      }else{
        return true;
      }
    },
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
    // 确定选择的工人
    SelectWorker() {
      this.tags = this.multipleSelection;
      this.dialogTableVisible = false;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addNewEquip() {
      var arr = [];
      if (this.tags == []) {
        this.$set(this.ruleForm, "userId", "null");
      } else {
        this.tags.forEach(val => {
          arr.push(val.id);
        });
        this.$set(this.ruleForm, "userId", arr);
      }
      var URL = "";
      if(this.$route.query.id && this.ruleForm.deviceType == 1){
        URL = "AttendanceCheckWork/updataEquipment100K";
       this.$delete(this.ruleForm,'online')
      }else if (this.$route.query.id && this.ruleForm.deviceType == 2){
        URL = "AttendanceCheckWork/updateEquipment100S";
       this.$delete(this.ruleForm,'online')
      }else if(this.ruleForm.deviceType == 1){
        URL = "AttendanceCheckWork/addEquipment100K";
      } else {
        URL = "AttendanceCheckWork/addEquipment100S";
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios({
            url: URL,
            transformRequest: this.transformRequest,
            method: "post",
            data: this.ruleForm
          }).then(res => {
            if(this.ruleForm.id && res.data.meaasge == "修改成功"){
              this.$message({
                message: "编辑成功",
                type: "success",
                onClose:()=>{
                  this.$router.push({ path: "/device" });
                }
              });
            }else if ((res.data.meaasge == "100s添加人员授权成功" || res.data.meaasge == "暂无用户，设备添加完成！！") || res.data.meaasge == '添加100K系列设备成功') {
              this.$message({
                message: "添加设备成功",
                type: "success",
                onClose:()=>{
                  this.$router.push({ path: "/device" });
                }
              });
            }else if(res.data.meaasge == "添加100K系列的用户照片失败" || res.data.meaasge == '100s添加人员照片失败'){
              this.$message({
                message: "设备添加成功，员工添加失败",
                type: 'warning',
                onClose:()=>{
                  this.$router.push({ path: "/device" });
                }
              });
            }else{
              this.$message.error("添加失败")
            }
          });
        } else {
          return false;
        }
      });
    },
    handleEdit(formName){
      /**
       * @description 编辑设备信息
       * @param {Number} id 设备ID
       * @param {String} location 位置
       * @param {String} deviceName 设备名称
       */
      let param = {
        id: this.editForm.id,
        location: this.editForm.location,
        deviceName: this.editForm.deviceName
      };

      this.$refs[formName].validate(valid =>{
        if(valid){
          editDevice(param).then(res=>{
            if(res.err_CODE === 0){
              this.$message.success('设备信息修改成功');
              this.$router.push({path: '/device/list'})
            }else{
              this.$message.error(res.err_MESSAGE);
            }
          })
        }
      })
    },
    Cancel() {
      this.$route.push({ path: "/device" });
    },
    getLocation(){
      /**
       * @description 获取位置列表
       * @param {String} locationName 位置名称
       * @param {Number} pageNum 0-默认查全部
       * @param {Number} pageSize 0-默认查全部
       */

      let param = {
        locationName: null,
        pageNum: 0,
        pageSize: 0
      };

      locationList(param).then(res=>{
        if(res.err_CODE === 0){
          this.location = res.data.list;
        }else{
          this.$message.error(res.err_MESSAGE);
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
#NewEquipment {
  .public-main{
    display: flex;
    flex-direction: column;
    
    .public-main-content:last-child{
      flex: 1;
    }
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
@import "~@/styles/public.scss";
#NewEquipment {
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
    padding: 10px 20px;
  }
}
</style>

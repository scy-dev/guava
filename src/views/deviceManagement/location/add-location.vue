<template>
  <el-container class="public-box" id="add-location">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">{{$route.query.type && $route.query.type == '编辑' ? '编辑位置' : '添加位置'}}</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="handleAdd('addForm')">确定</el-button>
          <el-button @click="Cancel">取消</el-button>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addForm"
          class="demo-ruleForm"
          :inline="true"
        >
          <el-form-item label="位置名称：" prop="locationName">
            <el-input v-model="addForm.locationName" placeholder="请输入位置名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="通行用途：" prop="locationType">
            <el-select v-model="addForm.locationType" placeholder="请选择通行用途">
              <el-option label="入场" value="入场"></el-option>
              <el-option label="出场" value="出场"></el-option>
              <el-option label="入场/出场" value="入场/出场"></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="备注" prop="description">
              <el-input v-model="addForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="public-main-content radius public-padding" style="margin-top:40px;">
        <div class="title">
          <span>已选择项目：</span>
          <p>
            <span style="margin-right:8px;">已选择{{tags.length}}个项目</span>
            <el-button type="primary" @click="addWorker" disabled>添加项目</el-button>
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
        <el-dialog title="添加项目" :visible.sync="dialogTableVisible" custom-class="addWork">
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
import { addLocation,editLocation } from '@/api/api';
import { store } from "@/plugin/observable";
export default {
  beforeRouteEnter (to, from, next) {
    to.name==='编辑设备'? to.query.id&&to.query.type?next():next({path:'/'}):next()
  },
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
      addForm:{
        id: null,
        locationName: null,
        locationType: null,
        description: null
      },
      addRules:{
        locationName:[
          { required: true, message: '请输入位置名称',  trigger: "blur"}
        ],
        locationType:[
          { required: true, message: '请输入位置类型', trigger: 'change'}
        ],
        description:[
          { required: false}
        ]
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
        equipmentBrand: [
          { required: true, message: "请选择设备品牌", trigger: "change" }
        ],
        location: [
          { required: true, message: "请输入安装位置", trigger: "blur" }
        ],
        generalPurpose: [
          { required: true, message: "请选择通行用途", trigger: "change" }
        ]
      },
      searchWorker: {
        teamId: "",
        projectId:store.projectId,
        subContractId: "",
        type:1
      },
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
    let data = JSON.parse(this.$route.query.param);
    this.$route.query.type && this.$route.query.type == '编辑' ? this.addForm = JSON.parse(JSON.stringify(data)) : this.addForm = this.addForm;
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
    handleAdd(formName){
      /**
       * @description 添加位置
       * @param {String} locationName 位置名称
       * @param {String} locationType 位置类型
       */
      let param = {
        locationName: this.addForm.locationName,
        locationType: this.addForm.locationType,
        description: this.addForm.description
      };

      this.$refs[formName].validate(valid=>{
        if(valid){
          if(this.$route.query.type && this.$route.query.type == '编辑'){
            this.$set(param,'id',this.addForm.id);
            editLocation(param).then(res=>{
              if(res.err_CODE === 0){
                this.$message.success('修改成功');
                this.$router.push({path: '/device/location'});
                this.$refs[formName].resetFields()
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            })
          }else{
            addLocation(param).then(res=>{
              if(res.err_CODE === 0){
                this.$message.success('添加成功');
                this.$router.push({path: '/device/location'});
                this.$refs[formName].resetFields()
              }else{
                this.$message.error(res.err_MESSAGE);
              }
            })
          }

        }
      })
    },
    handleEdit(formName){
      /**
       * @description 编辑工地信息
       * @param {String} id 位置ID
       * @param {String} locationName 位置名称
       * @param {String} locationType 位置类型
       */
      let param = {
        id: null,
        locationName: null,
        locationType: null
      };
      this.$refs[formName].validate(valid=>{
        if(valid){
          editLocation(param).then(res=>{
            if(res.err_CODE === 0){
              this.$message.success('修改成功');
              this.$route.push({path: '/device/list'});
              this.$refs[formName].resetFields();
            }else{
              this.$message.error(res.err_MESSAGE);
            }
          })
        }else{
          return false;
        }
      })
    },
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
    Cancel() {
      this.$router.push({ path: "/device/location" });
    }
  }
};
</script>

<style scoped lang="scss">
@import '~@/styles/public.scss';
#add-location {
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
#add-location {
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

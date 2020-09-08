<template>
  <el-container class="public-box" id="EquipmentDetail">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">班次人员</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="search">
          <div>
            <span>姓名：</span>
            <el-input v-model="searchObj.userName" placeholder="请输入姓名"></el-input>
          </div>
          <div>
            <span>分包单位：</span>
            <el-select v-model="searchObj.subcontractId" placeholder="请选择分包单位"  @change="SelectCom">
              <el-option
                v-for="item in subcontract"
                :key="item.subContractId"
                :label="item.corpname"
                :value="item.subContractId"
              ></el-option>
            </el-select>
          </div>
          <div v-if="visit">
            <span>班组：</span>
            <el-select v-model="searchObj.teamId" placeholder="请选择班组">
              <el-option
                 v-for="item in team"
                :label="item.teamName"
                :value="item.teamId"
                :key="item.teamId"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button type="primary" @click="Search">查询</el-button>
            <el-button @click="Reset">重置</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%;margin-top:30px;" v-loading="loading">
          <el-table-column label="序号" width="100">
            <template slot-scope="scope">
              <span>{{serialNumber(scope.$index,searchObj.pageNum,searchObj.pageSize)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="idCard" label="身份证号码"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="corpName" label="分包单位"></el-table-column>
          <el-table-column prop="workType" label="工种"></el-table-column>
          <el-table-column prop="teamName" label="班组名称"></el-table-column>
        </el-table>
        <pagination :total="total" :pageSize="searchObj.pageSize" :pageNum='searchObj.pageNum' @pagination="handlePage"></pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import PublicTable from "./component/PublicTable";
import Pagination from "@/components/Pagination";
import { serialNumber } from "@/views/AttendanceManagement/mixins";
import { store } from "@/plugin/observable";
export default {
  name: "",
  mixins: [serialNumber],
  data() {
    return {
      tableData: [],
      searchObj: {
        pageNum: 1,
        pageSize: 10,
        userName: "",
        subcontractId: "",
        teamId: ""
      },
      total: 0,
      subcontract: [],
      team: [],
      loading:true,
      visit:false,
    };
  },
  components: { PublicTable, Pagination },
  created() {
    this.Busmethod();
    // 请求分包
    axios({
      url:
       this.liuxiancai+ "/Projectmanager/project/querySubContractCorpname",
      method: "post",
      data: {
        projectId: store.projectId
      },
      transformRequest: this.transformRequest
    }).then(res => {
      this.subcontract = res.data.data;
    });
  },
  methods: {
    Busmethod() {
      this.$set(this.searchObj, "projectId", this.$route.query.id);
      axios({
        url: "ScheduRule/selectUserUtil",
        transformRequest: this.transformRequest,
        method: "post",
        data: this.searchObj
      }).then(res => {
        this.loading = false;
        this.tableData = res.data.data;
        this.total = res.data.total;
        console.log(res);
      });
    },
    SelectCom(val) {
      this.visit = true;
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
    Search(){
      this.Busmethod();
    },
    Reset(){
      this.visit = false;
      this.searchObj=this.$options.data().searchObj;
       this.Busmethod();
    },
    handlePage(page) {
      Object.assign(this.searchObj, page);
      this.Busmethod();
    }
  }
};
</script>

<style scoped lang="scss">
#EquipmentDetail {
  .public-header-title {
    margin-top: 10px;
  }
  .search {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    width: 90%;
    div {
      margin-bottom: 10px;
      margin-right:20px;
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
    .el-select {
      width: 280px;
    }
  }
}
</style>
<style lang="scss">
#EquipmentDetail {
}
</style>


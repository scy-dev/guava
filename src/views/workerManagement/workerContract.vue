<template>
  <el-container class="public-box" id="workerContract">
    <el-header height="76px" class="public-header header-tabs">
      <el-row type="flex" align="center" justify="space-between">
        <el-row type="flex" align="center" class="header-tabs-box">
          <div
            class="tabs-main"
            v-for="(item,index) in tabs"
            :key="index"
            @click="tabSwitch(index,item.status)"
            :class="active == index? 'tabs-active':''"
          >{{item.name}}</div>
          <div class="tabs-border" :style="{left:px}"></div>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="content">
          <div class="search">
            <div>
              <span>姓名：</span>
              <el-input v-model="searchObj.name" placeholder="请输入姓名"></el-input>
            </div>
            <div>
              <span>身份证号码：</span>
              <el-input v-model="searchObj.idcard" placeholder="请输入身份证号码"></el-input>
            </div>
            <div>
              <span>分包单位：</span>
              <el-select v-model="searchObj.subContractId" placeholder="请选择分包单位">
                <el-option
                  v-for="item in options"
                  :key="item.subContractId"
                  :label="item.corpname"
                  :value="item.subContractId"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-button type="primary" @click="Search">查询</el-button>
              <el-button @click="Reset">重置</el-button>
            </div>
          </div>
          <div>
            <el-button type="primary" style="margin-top:30px" @click="Formation">生成合同</el-button>
            <div class="contentTable">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="loading"
                @selection-change="handleSelectionChange"
              >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="序号" width="70">
                  <template slot-scope="scope">
                   <span>{{serialNumber(scope.$index,searchObj.pageNum,searchObj.pageSize)}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="idcard" label="身份证号码" width="180"></el-table-column>
                <el-table-column align="center" prop="corpname" label="分包单位" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="workerType" label="工种" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="合同期限类型" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.type | contractTypeFilter}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="开始结束日期" width="210" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.startDate"
                    >{{scope.row.startDate | arrivalDateFilter}} ~ {{scope.row.finishDate | arrivalDateFilter}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="计薪方式">
                  <template slot-scope="scope">
                    <span>{{scope.row.payableType | payTypeFilter}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="合同文件" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span
                      style="color:#3C62D0;cursor: pointer;"
                      @click="check(scope.row.contractUrl)"
                      v-if="scope.row.code && scope.row.code!='null'"
                    >{{scope.row.code}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip width="150">
                  <template slot-scope="scope">
                    <span
                      style="color:#3C62D0;cursor:pointer;"
                      @click="setupContract(scope.row.name,scope.row.idcard)"
                    >设置合同</span>
                    <span style="color:#E9E9E9">|</span>
                    <span
                      style="color:#3C62D0;cursor:pointer;"
                      @click="uploadContract(scope.row.name,scope.row.idcard,scope.row.contractUrl)"
                    >上传合同</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :total="total"
                :pageSize="searchObj.pageSize"
                :pageNum="searchObj.pageNum"
                @pagination="handlePage"
              ></pagination>
            </div>
            <el-dialog title="上传合同文件" :visible.sync="dialogVisible" width="30%" :before-close="cancel">
              <div>
                <p style="color:#3E3E3E">姓名：</p>
                <p style="color:#666666;margin:25px 0px 0px 16px;">{{uploadObj.name}}</p>
                <p style="color:#3E3E3E;margin-top:40px;">身份证号码：</p>
                <p style="color:#666666;margin:25px 0px 0px 16px;">{{uploadObj.idcard}}</p>
                <p style="color:#3E3E3E;margin-top:40px;">上传合同文件:</p>
                <p style="color:#666666;margin:25px 0px 0px 16px;">
                  <el-upload
                    class="avatar-uploader"
                    :action="baseurl+'Projectmanager/project/fileUpload'"
                    :data="{type:5}"
                    name="file"
                    :show-file-list="true"
                    :on-success="handleAvatarSuccess"
                    :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload"
                    :file-list="fileList"
                    :on-exceed="handleLimit"
                    :limit="1"
                  >
                    <el-button>
                      <i class="el-icon-upload2"></i> 上传文件
                    </el-button>
                    <span style="color:rgba(0,0,0,0.45);margin-left:20px;">仅支持PDF格式的文件，且文件大小不得超过20MB</span>
                    <img src alt>
                  </el-upload>
                </p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="SureUpload">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import Pagination from "@/components/Pagination";
import { beforeAvatarUpload } from "@/plugin/beforeUpload";
import {
  contractTypeFilter,
  arrivalDateFilter,
  payTypeFilter
} from "./../../plugin/filterFunction";
import {serialNumber} from '@/views/AttendanceManagement/mixins';
import { store } from "@/plugin/observable";
export default {
  name: "",
  mixins:[serialNumber],
  data() {
    return {
      searchObj: {
        pageNum: 1,
        pageSize: 10,
        idcard: "",
        subContractId: "",
        name: ""
      },
      status: "0",
      total: 0,
      tableData: [
        {
          name: '张泽宇',
          idcard: '140192199302301515',
          corpname: '中建X',
          workerType: '水电',
          startDate: 1596712389272,
          finishDate: 1596712389272,
          type: 0,
          payableType: 0,
          code:'合同',
          contractUrl: 'https://www.baidu.com'
        },
        {
          name: '贾珍',
          idcard: '140192199302301515',
          corpname: '中建X',
          workerType: '泥瓦',
          startDate: 1596712389272,
          finishDate: 1596712389272,
          type: 1,
          payableType: 1,
          code:'合同',
          contractUrl: 'https://www.baidu.com'
        },
        {
          name: '孙晓梅',
          idcard: '140192199302301515',
          corpname: '朝阳餐厅',
          workerType: '厨师',
          startDate: 1596712389272,
          finishDate: 1596712389272,
          type: 0,
          payableType: 0,
          code:'合同',
          contractUrl: 'https://www.baidu.com'
        }              
      ],
      active: null,
      px: 0,
      options: [],
      dialogVisible: false,
      uploadObj: {
        name: "",
        idcard: ""
      },
      baseurl: "",
      fileList: [],
      multipleSelection: [],
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
      loading: false,
      projectId:store.projectId
    };
  },
  components: { Pagination },
  filters: {
    contractTypeFilter(val) {
      return contractTypeFilter(val);
    },
    arrivalDateFilter(val) {
      return arrivalDateFilter(val);
    },
    payTypeFilter(val) {
      return payTypeFilter(val);
    }
  },
  created() {
    // 获取分包单位数据
    // axios({
    //   url: "Projectmanager/project/querySubContractCorpname",
    //   method: "post",
    //   transformRequest: this.transformRequest,
    //   data: {
    //     projectId: this.projectId
    //   }
    // }).then(res => {
    //   console.log(res);
    //   this.options = res.data.data;
    // });
    this.tabSwitch(0, "0");
  },
  methods: {
    BusMethod() {
      this.$set(this.searchObj, "projectId", this.projectId);
      this.$set(this.searchObj, "status", this.status);
      this.loading = false;
      this.total = this.tableData.length;
      // axios({
      //   url: "Personnel/person/queryContractInfo",
      //   method: "post",
      //   transformRequest: this.transformRequest,
      //   data: this.searchObj
      // }).then(res => {
      //   this.loading = false;
      //   this.baseurl = res.config.baseURL;
      //   this.total = res.data.data.total;
      //   this.tableData = res.data.data.list;
      //   console.log(res);
      // });
    },
    Search() {
      this.BusMethod();
    },
    Reset() {
      this.searchObj = this.$options.data().searchObj;
      this.BusMethod();
    },
    handlePage(page) {
      Object.assign(this.searchObj, page);
      this.BusMethod();
    },
    setupContract(name, idcard) {
      this.$router.push({
        path: "/workercontract/setupcontract",
        query: { id: idcard, name: name }
      });
    },
    check(imgurl) {
      // imgurl =
      //   "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80";
      this.$alert("", {
        message: "<img src=" + imgurl + " alt='图片找不到了'>",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        showClose: false,
        customClass: "see"
      });
    },
    tabSwitch(index, status) {
      if (index == this.active) {
        return false;
      }
      this.active = index;
      this.px = index * 112 + "px";
      this.searchObj = this.$options.data().searchObj;
      this.status = status;
      this.BusMethod();
    },
    uploadContract(name, idcard, contractUrl) {
      console.log(name, idcard, contractUrl);
      this.dialogVisible = true;
      this.$set(this.uploadObj, "name", name);
      this.$set(this.uploadObj, "idcard", idcard);
      if (contractUrl) {
        this.$set(this.uploadObj, "file", contractUrl);
        var arr = contractUrl.split("\\");
        var str = arr[arr.length - 1];
        if (this.fileList.length < 1) {
          this.fileList.push({ name: str, url: contractUrl });
        }
      }
    },
    SureUpload() {
      console.log(this.fileList.length);
      axios({
        url: "Personnel/person/uploadContractInfo",
        method: "post",
        transformRequest: this.transformRequest,
        data: this.uploadObj
      }).then(res => {
        if (res.data.message == "成功") {
          this.$message({
            message: "上传成功",
            type: "success"
          });
          this.dialogVisible = false;
          this.fileList = [];
          this.BusMethod();
        } else if(res.data.message == '缺少参数'){
          this.fileList = [];
          this.$message.error("上传失败,请上传合同文件");
        }
      });
    },
    cancel() {
      this.fileList = [];
      this.dialogVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 生成合同
    Formation() {
      var arr = [];
      this.multipleSelection.forEach(val => {
        arr.push(val.idcard);
      });
      axios({
        url: "Personnel/person/download",
        method: "get",
        responseType: "blob",
        transformRequest: this.transformRequest,
        params: {
          idcards: arr.join(",")
        }
      }).then(res => {
        console.log(res.data.code)
        var blob = new Blob([res.data], {type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"}); 
        var contentDisposition = res.headers["content-disposition"]; 
        var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        var result = patt.exec(contentDisposition);
        console.log(result)
        if(result !== null){
        var filename = result[1];
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.style.display = "none";
        downloadElement.href = href;
        downloadElement.download = filename; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
         }else{
           this.$message.error("生成合同失败，请检查")
         }
      });
    },
    handleAvatarSuccess(response, file, fileList) {
      console.log(response);
      this.$set(this.uploadObj, "file", response.data.url);
      this.pdf = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      let reg = beforeAvatarUpload(file,["application/pdf"],20)
      if(!reg.type){
        this.$message.error(reg.message)
      }
      return reg.type
    },
    handleLimit(files, fileList) {
      console.log(files, fileList);
      this.$message.error("只能上传一张附件，请先删除再上传");
    },
    handleRemove(file,fileList){
     this.uploadObj.file = '';
    }
  }
};
</script>
<style scoped lang="scss">
@import "~@/styles/public.scss";
#workerContract {
  .search {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 90%;
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
    .el-select {
      width: 280px;
    }
  }
  .contentTable {
    margin-top: 40px;
    .cha {
      color: #3c62d0;
    }
  }
  .avatar-uploader {
    display: inline-block;
  }
}
</style>
<style lang="scss">
#workerContract {
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #3c62d0;
    border-color: #3c62d0;
  }
  .search {
    .el-form-item__label {
      font-size: 16px;
      color: #333333;
    }
  }
  .el-icon-document:before {
    content: url("../../assets//images/hxj.png");
  }
}
</style>

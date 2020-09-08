<template>
  <div id="certificate">
    <div class="upload">
      <el-button type="primary" @click="uploadCertificate()">上传证书</el-button>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="序号" width="150">
          <template slot-scope="scope">
             <span>{{serialNumber(scope.$index,searchObj.pageNum,searchObj.pageSize)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="证书名称" width="250"></el-table-column>
        <el-table-column prop="certificateno" label="证书编号" width="250"></el-table-column>
        <el-table-column label="发证日期" width="200">
          <template slot-scope="scope">
            <span>{{arrivalDateFilter(scope.row.issueDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="issueUnit" label="证书签发单位" width="250"></el-table-column>
        <el-table-column label="证书附件" width="190">
          <template slot-scope="scope">
            <a :href="scope.row.annexUrl" target="_blank" style="color:#3C62D0;cursor: pointer;">查看</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <span style="color:#3C62D0;cursor: pointer;" @click="uploadCertificate(scope.row.id)">编辑</span>
            <span style="color:#E9E9E9">|</span>
            <span style="color:#D31919;cursor: pointer;" @click="del(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :pageSize="searchObj.pageSize" :pageNum='searchObj.pageNum' @pagination="handlePage"></pagination>
    </div>
    <div class="dialog">
      <el-dialog title="上传证书" :visible.sync="dialogVisible" width="30%" :before-close="cancle">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="证书名称：" prop="name">
            <el-input v-model="ruleForm.name" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="证书编号：" prop="certificateno">
            <el-input v-model="ruleForm.certificateno" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="发证日期：" prop="issueDate">
            <el-date-picker
              v-model="ruleForm.issueDate"
              type="date"
              placeholder="选择日期"
              format="yyyy / MM / dd "
              @change="selectData"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="签发单位：" prop="issueUnit">
            <el-input v-model="ruleForm.issueUnit" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="证书附件：" prop="annexUrl">
            <el-upload
              class="avatar-uploader"
              :action="baseurl+'Projectmanager/project/fileUpload'"
              :data="{type:4}"
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
              <span style="color:rgba(0,0,0,0.45);margin-left:20px;">支持扩展名：pdf，且不超过10MB</span>
              <img src alt>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle()">取 消</el-button>
          <el-button type="primary" @click="sureUpload">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from "@/components/Pagination";
import { beforeAvatarUpload } from "@/plugin/beforeUpload";
import {serialNumber} from '@/views/AttendanceManagement/mixins'
export default {
  name: "",
  mixins:[serialNumber],
  data() {
    return {
      searchObj: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        name: "",
        certificateno: "",
        issueDate: "",
        issueUnit: "",
        annexUrl: ""
      },
      rules: {
        name: [{ required: true, message: "请输入证书名称", trigger: "blur" }],
        certificateno: [
          { required: true, message: "请输入证书编号", trigger: "blur" }
        ],
        issueDate: [
          { required: true, message: "请输入发证日期", trigger: "blur" }
        ],
        issueUnit: [
          { required: true, message: "请输入签发单位", trigger: "blur" }
        ],
        annexUrl: [{ required: true, message: "请上传附件",trigger: "change" }]
      },
      fileList: [],
      pdf: "",
      baseurl: "",
      loading: false
    };
  },
  components: { Pagination },
  created() {
    this.BusMethod();
  },
  methods: {
    BusMethod() {
      this.$set(this.searchObj, "id", parseInt(this.$route.query.id));
      axios({
        url: "Personnel/person/queryCertificate",
        method: "post",
        transformRequest: this.transformRequest,
        data: this.searchObj
      }).then(res => {
        this.baseurl = res.config.baseURL;
        this.loading = false;
        this.total = res.data.data.total;
        this.tableData = res.data.data.list;

        console.log(res);
      });
    },
    // 过滤时间
    arrivalDateFilter(val) {
      return moment(val).format("YYYY/MM/DD");
    },
    handlePage(page) {
      Object.assign(this.searchObj,page)
      this.BusMethod();
    },
    // 选择发证日期
    selectData(val) {
      var str = val.toString();
      this.$set(this.ruleForm, "issueDate", str.substring(0, str.length - 9));
    },
    // 确定上传
    sureUpload() {
      this.$set(this.ruleForm, "workerId", this.$route.query.id);
      if (this.ruleForm.issueDate) {
        var str = moment(this.ruleForm.issueDate).toDate().toString();
        this.$set(this.ruleForm, "issueDate", str.substring(0, str.length - 9));
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios({
            url: "Personnel/person/uploadOrEditCertificate",
            method: "post",
            transformRequest: this.transformRequest,
            data: this.ruleForm
          }).then(res => {
            if (res.data.message == "成功") {
              this.$message({
                message: "上传成功",
                type: "success"
              });
              this.dialogVisible = false;
              this.ruleForm=this.$options.data().ruleForm
              this.$refs["ruleForm"].resetFields();
              this.fileList = [];
              this.BusMethod();
            } else {
              this.$message.error("证书编号已存在，请检查");
            }
            console.log(res);
          });
        } else {
          return false;
        }
      });
    },
    cancle() {
      this.dialogVisible = false;
      this.ruleForm=this.$options.data().ruleForm
       this.$refs["ruleForm"].resetFields();
      this.fileList = [];
    },
    //上传附件超过数量
    handleLimit(files, fileList) {
      console.log(files, fileList);
      this.$message.error("只能上传一张附件，请先删除再上传");
    },
    del(id) {
      this.$confirm("是否确定删除该证书", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warning"
      }).then(() => {
        axios({
          url: "Personnel/person/removeCertificate",
          method: "post",
          transformRequest: this.transformRequest,
          data: {
            id: id
          }
        }).then(res => {
          if (res.data.message == "成功") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
             if (this.tableData.length - 1 == 0) {
                if (this.searchObj.pageNum > 1) {
                  this.searchObj.pageNum -= 1;
                }
              }
            this.BusMethod();
          }
          console.log(res);
        });
      });
    },
    uploadCertificate(id) {
      if (id) {
        axios({
          url: "Personnel/person/queryCertificateInfo",
          method: "post",
          transformRequest: this.transformRequest,
          data: {
            id: id
          }
        }).then(res => {
          this.ruleForm = res.data.data;
          this.$delete(this.ruleForm, "createTime");
          this.$delete(this.ruleForm, "modityTime");
          if (res.data.data.annexUrl) {
            if(this.fileList.length <1){
               this.fileList.push({name: /[^\\]+(\.[A-z]+$)/.exec(res.data.data.annexUrl)[0],url:res.data.data.annexUrl});
            }
          }
        });
      }
      this.dialogVisible = true;
    },
    // 上传成功
    handleAvatarSuccess(response, file, fileList) {
      this.$set(this.ruleForm, "annexUrl", response.data.url);
      this.$refs['ruleForm'].validateField("annexUrl",()=>{});
      this.pdf = URL.createObjectURL(file.raw);
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      let reg = beforeAvatarUpload(file,["application/pdf"])
      if(!reg.type){
        this.$message.error(reg.message)
      }
      return reg.type
    },
    handleRemove(file,fileList){
     this.ruleForm.annexUrl = '';
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../styles/public";
#certificate {
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  .upload {
  }
  .content {
    margin-top: 40px;
  }
}
</style>
<style lang="scss">
@import "../../styles/public";
#certificate {
  .el-form-item {
    width: 100%;
  }
  .el-table .cell,
  .el-table th div {
    padding-left: 40px;
  }
  .el-table th div {
    font-size: 16px;
    font-family: PingFangSC-Medium;
  }
  .el-dialog__body {
    padding: 20px 40px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  }
  .el-dialog__footer {
    padding: 20px 20px 20px;
  }
  .el-form-item {
    .el-form-item__label {
      float: none;
    }
    .el-form-item__content {
      display: block;
      .el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
        .el-input__inner {
          width: 100%;
        }
      }
      .el-form-item__error {
        top: -75%;
        left: inherit;
        right: 5px;
      }
    }
  }
  .el-form-item__label {
    float: none;
  }
  .el-input__prefix {
    left: inherit;
    right: 15px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 15px;
  }
  .el-icon-circle-close {
    display: none;
  }
  .el-icon-document:before {
    content: url("../../assets//images/hxj.png");
  }
   .el-pagination__sizes{
    .el-select--mini{
      .el-input{
        display: inline-block;
        width: 100px;
      }
    }
  }
  .el-pagination__jump{
    .el-input{
      display: inline-block;
    }
  }
}

.see {
  .el-message-box__message {
    p {
      display: flex;
      justify-content: center;
    }
  }
}
</style>

<template>
  <div id="workerBasic"  v-if="baseInfo.fullName != null">
    <div class="basic common">
      <div class="header">
        <span>基本信息</span>
      </div>
      <div class="basicContent">
        <div class="divs">
          <ul>
            <li>
              <span>姓名：</span>
              <span>{{baseInfo.fullName}}</span>
            </li>
            <li>
              <span>出生日期：</span>
              <span>{{baseInfo.birthday}}</span>
              <!-- <span>{{arrivalDateFilter(baseInfo.birthday)}}</span> -->
            </li>
            <li>
              <span>年龄：</span>
              <span>{{baseInfo.idCard |discriCard}}</span>
            </li>
            <li>
              <span>签发机关：</span>
              <span>{{baseInfo.province}}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span>性别：</span>
              <span v-if="baseInfo.sex == 0">男</span>
              <span v-if="baseInfo.sex == 1">女</span>
            </li>
            <li>
              <span>民族：</span>
              <span>{{baseInfo.nation}}</span>
            </li>
            <li>
              <span>身份证号码：</span>
              <span>{{baseInfo.idCard}}</span>
            </li>
            <li>
              <span>籍贯：</span>
              <span>{{baseInfo.domicile}}</span>
            </li>
          </ul>
        </div>
        <div>
          <img :src="'data:image/png;base64,'+baseInfo.idImage" alt v-if="baseInfo.idImage && baseInfo.idImage.length > 10" style="width:140px;height:140px;">
          <img src="./../../assets/images/header.png" alt v-else>
        </div>
      </div>
    </div>
    <div class="common important">
      <div class="header importantH">
        <span>重要信息</span>
        <!-- <el-button type="primary" @click="changeEdit">{{editName}}</el-button> -->
      </div>
      <div class="importContant">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <table>
            <tr>
              <td width="34%">
                <p v-if="edit == false">
                  <span>手机号码：</span>
                  <span>{{baseInfo.telephone}}</span>
                </p>
                <!-- <el-form-item label="手机号码：" prop="phoneNumber" v-else>
                  <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号码"></el-input>
                </el-form-item> -->
              </td>
              <td width="32%">
                <p v-if="edit == false">
                  <span>所属企业：</span>
                  <span>中建XXXXXXXXXXXXX局</span>
                </p>
                <!-- <el-form-item label="所属企业：" prop="corpname" v-else>
                  <el-input v-model="baseInfo.corpname" disabled="true"></el-input>
                </el-form-item> -->
              </td>
              <td>
                <p v-if="edit == false">
                  <span>所在班组：</span>
                  <span>水电组</span>
                </p>
                <!-- <el-form-item label="所在班组：" prop="teamName" v-else>
                  <el-input v-model="baseInfo.teamName" disabled="true"></el-input>
                </el-form-item> -->
              </td>
            </tr>
            <tr>
              <td>
                <p v-if="edit == false">
                  <span>人员类型：</span>
                  <span>普通工人</span>
                  <!-- <span v-if="baseInfo.type == 0">管理人员</span>
                  <span v-if="baseInfo.type == 1">普通工人</span> -->
                </p>
                <!-- <el-form-item label="人员类型：" prop="type" v-else>
                  <el-select
                    v-model="ruleForm.type"
                    placeholder="请选择人员类型"
                    popper-class="selectDropDrown"
                    @change="selectType"
                  >
                    <el-option label="管理人员" :value="10"></el-option>
                    <el-option label="普通工人" :value="20"></el-option>
                  </el-select>
                </el-form-item> -->
              </td>
              <td>
                <p v-if="edit == false">
                  <span>工人工种：</span>
                  <span>未知</span>
                  <!-- <span>{{ workerTypeFilter(ruleForm.workerType)}}</span> -->
                </p>
                <!-- <el-form-item label="工人工种：" prop="workerType" v-else>
                  <el-select
                    v-model="ruleForm.workerType"
                    placeholder="请选择工人工种"
                    popper-class="selectDropDrown"
                    @change="selectWorkerType"
                  >
                    <el-option
                      :label="item.msg"
                      :value="item.code"
                      v-for="(item,index) in workerOption"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
              </td>
              <td>
                <p v-if="edit == false">
                  <span>重要人员：</span>
                  <span>是</span>
                  <!-- <span v-if="ruleForm.important == true">是</span>
                  <span v-if="ruleForm.important == false">否</span> -->
                </p>
                <!-- <el-form-item label="重要人员：" prop="isImportant" v-else>
                  <el-select
                    v-model="ruleForm.important"
                    placeholder="请选择"
                    popper-class="selectDropDrown"
                    @change="selectImportant"
                  >
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-form-item> -->
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td width="34%">
                <p v-if="edit == false">
                  <span>开户银行：</span>
                  <span>建设银行</span>
                  <!-- <span v-if="ruleForm.openBank !='null'">{{ruleForm.openBank}}</span> -->
                </p>
                <!-- <el-form-item label="开户银行：" prop="openBank" v-else>
                  <el-input v-model="ruleForm.openBank" placeholder="请输入开户银行"></el-input>
                </el-form-item> -->
              </td>
              <td width="32%">
                <p v-if="edit == false">
                  <span>银行卡号：</span>
                  <span>9559480089071474413</span>
                  <!-- <span  v-if="baseinfo.account !='null'">{{baseinfo.account}}</span> -->
                </p>
                <!-- <el-form-item label="银行卡号：" prop="account" v-else>
                  <el-input v-model="baseinfo.account" placeholder="请输入银行卡号"></el-input>
                </el-form-item> -->
              </td>
              <td>
                <p v-if="edit == false">
                  <span>到岗日期：</span>
                  <span>2020-08-06 12:00</span>
                  <!-- <span v-if="baseinfo.arrivalDate">{{arrivalDateFilter(baseinfo.createTime)}}</span> -->
                </p>
                <!-- <el-form-item label="到岗日期：" prop="arrivalDate" v-else>
                  <el-date-picker
                    v-model="baseinfo.arrivalDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy / MM / dd "
                    @change="selectDate"
                  ></el-date-picker>
                </el-form-item> -->
              </td>
            </tr>
            <tr>
              <td>
                <p v-if="edit == false">
                  <span>亲属姓名：</span>
                  <span>xxx</span>
                  <span>{{baseInfo.emergencyContact}}</span>
                </p>
                <!-- <el-form-item label="亲属姓名：" prop="relativeName" v-else>
                  <el-input v-model="baseinfo.relativeName" placeholder="请输入亲属姓名"></el-input>
                </el-form-item> -->
              </td>
              <td>
                <p v-if="edit == false">
                  <span>现居住址：</span>
                  <span>{{baseInfo.address}}</span>
                </p>
                <!-- <el-form-item label="现居住址：" prop="address" v-else>
                  <el-input v-model="baseInfo.address" placeholder="请输入现居地址"></el-input>
                </el-form-item> -->
              </td>
              <td>
                <p v-if="edit == false">
                  <span>紧急联系：</span>
                  <span>{{baseInfo.emergencyContactTel}}</span>
                </p>
                <!-- <el-form-item label="紧急联系：" prop="emergencyContactTel" v-else>
                  <el-input v-model="baseInfo.emergencyContactTel" placeholder="请输入紧急联系人手机号码"></el-input>
                </el-form-item> -->
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </div>
    <div class="common enclosure">
      <div class="header">
        <span>附件</span>
      </div>
      <div class="enclosureContent">
        <div>
          <!-- <img :src="baseInfo.frontUrl" alt> -->
          <img src="./../../assets/images/01.png" alt>
          <p>身份证人像面</p>
        </div>
        <div>
          <!-- <img :src="baseInfo.backUrl" alt> -->
          <img src="./../../assets/images/02.png" alt>
          <p>身份证国徽面</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import moment from 'moment'
  import Pagination from "@/components/Pagination";
  import { Mobile, MobileOr, BankCardOr } from "@/plugin/formRules";
  import { discriCard } from "@/plugin/filterFunction";
  export default {
    name: "",
    data() {
      return {
        edit: false,
        editName: "编辑",
        baseInfo:{
          fullName: null,
          address: null,
          certificationTime: null,
          createTime: null,
          emergencyContact: null,
          emergencyContactTel: null,
          faceImage: null,
          id: null,
          idCard: null,
          idImage: null,
          sex: 0,
          telephone: null,
          verified: 0,
        },
        ruleForm: {
          phoneNumber: "",
          type: "",
          workerType: "",
          important: "",
          openBank: "",
          account: "",
          relativeName: "",
          address: "",
          emergencyNumber: "",
          arrivalDate: ""
        },
        rules: {
          phoneNumber: [{ required: true, validator: Mobile, trigger: "blur" }],
          type: [{ required: true, message: "请选择人员类型", trigger: "change" }],
          workerType: [
            { required: true, message: "请选择工人工种", trigger: "change" }
          ],
          important: [
            { required: true, message: "请选择是否重要人员", trigger: "change" }
          ],
          openBank: [{ required: false, message: "请输入开户行", trigger: "blur" }],
          account: [{ required: false, validator: BankCardOr, trigger: "blur" }],
          relativeName: [{ required: false, message: "请输入紧急联系人", trigger: "blur" }],
          address: [{ required: false, message: "请输入地址", trigger: "blur" }],
          emergencyNumber: [
            { required: false, validator: MobileOr, trigger: "blur" }
          ]
        },
        workerOption: []
      };
    },
    filters: {
      discriCard(val) {
        return discriCard(val);
      }
    },    
    components: { Pagination },
    created() {
      this.$nextTick(() => {
        this.baseInfo = JSON.parse(this.$route.query.id);
        if (this.$route.meta.breadcrumb.length >= 3) {
          this.$route.meta.breadcrumb.splice(
            this.$route.meta.breadcrumb.length - 1,
            1
          );
          this.$route.meta.breadcrumb.push(sessionStorage.getItem("mateName"));
        } else {
          this.$route.meta.breadcrumb.push(sessionStorage.getItem("mateName"));
        }
      });
      // axios({
      //   url: "Personnel/person/workerInfo",
      //   method: "post",
      //   transformRequest: this.transformRequest,
      //   data: this.$route.query
      // }).then(res => {
      //   this.ruleForm = res.data.data;
      //   console.log(res);
      // })
      // .then(res=>{
      //     this.$refs['ruleForm'].clearValidate();
      //   });
      // // 请求工种类型
      // axios({
      //   url: "Personnel/person/workerTypeList",
      //   method: "post",
      //   transformRequest: this.transformRequest
      // }).then(res => {
      //   this.workerOption = res.data.data;
      // });
    },
    methods: {
      // 过滤工人工种
      workerTypeFilter(val) {
        if(val){
          return this.workerOption.filter(e => e.code == val)[0].msg;
        }
      
      },
      changeEdit() {
        this.edit = !this.edit;
        if (this.edit) {
          this.editName = "保存";
        } else {
          this.editName = "编辑";
          // 判断到到岗日期是否有值
          if (this.ruleForm.arrivalDate) {
            var str = moment(this.ruleForm.arrivalDate).toDate().toString();
            this.$set(this.ruleForm,"arrivalDate",str.substring(0, str.length - 9));
          }else{
            this.$delete(this.ruleForm,'arrivalDate')
          }
        for(var key in this.ruleForm){
          if(this.ruleForm[key] == 'null'){
              this.$delete(this.ruleForm,key)
          }
        }
          this.$refs["ruleForm"].validate(valid => {
            if (valid) {
              axios({
                url: "Personnel/person/editWorkerInfo",
                method: "post",
                transformRequest: this.transformRequest,
                data: this.ruleForm
              }).then(res => {
                if (res.data.message == "成功") {
                  this.$message({
                    message: "编辑成功",
                    type: "success"
                  });
                }else{
                  this.$message({
                    message: "保存失败",
                    type: "error",
                    onClose:()=>{
                      
                    }
                  });
                  this.edit = true;
                  this.editName = "保存";
                }

              });
            } else {
              this.edit = true;
              this.editName = "保存";
              return false;
            }
          });
        }
      },
      //选择人员类型
      selectType(val) {
        this.$set(this.ruleForm, "type", val);
      },
      // 选择到岗日期
      selectDate(val) {
        console.log(val);
        var str = val.toString();
        console.log(str.substring(0, str.length - 9));
        this.$set(this.ruleForm, "arrivalDate", str.substring(0, str.length - 9));
      },
      arrivalDateFilter(val) {
        return moment(val).format("YYYY/MM/DD");
      },
      // 选择是否重要
      selectImportant(val) {
        this.$set(this.ruleForm, "important", val);
        this.$set(this.ruleForm, "isImportant", val);
      },
      // 选择工人工种
      selectWorkerType(val) {
        this.$set(this.ruleForm, "workerType", val);
      }
    },
    beforeRouteLeave(to, from, next) {
      console.log(to), console.log(from, 22222);
      next();
    }
  };
</script>

<style scoped lang="scss">
#workerBasic {
  .common {
    padding: 0 40px 40px 40px;
    background-color: #fff;
    border-radius: 10px;
    .header {
      border-bottom: 1px solid rgba(232, 232, 232, 1);
      span {
        font-size: 20px;
        color: #333333;
        font-weight: 500;
        line-height: 72px;
        font-family: PingFangSC-Medium;
      }
    }
  }
  .basic {
    .basicContent {
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
      .divs {
        width: 50%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      ul li {
        margin-top: 32px;
        span {
          color: #666666;
        }
        span:nth-of-type(1) {
          color: #333333;
        }
      }
      div img {
        width: 184px;
        height: 184px;
        margin-left: 200px;
        margin-top: 32px;
      }
    }
  }
  .important {
    margin-top: 40px;
    .header {
      display: flex;
      justify-content: space-between;
      .el-button--primary {
        height: 40px;
        margin-top: 20px;
      }
    }
    .importContant {
      table {
        width: 100%;
        padding-top: 20px;
        tr {
          height: 50px;
          line-height: 50px;
          td {
            span {
              color: #333333;
            }
            span:nth-of-type(2) {
              color: #666666;
            }
          }
        }
      }
      table:nth-of-type(1) {
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        padding-bottom: 20px;
      }
    }
  }
  .enclosure {
    margin-top: 40px;
    .enclosureContent {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 60%;
      margin-top: 40px;
      div {
        img {
          width: 370px;
          height: 233px;
        }
        p {
          text-align: center;
          margin-top: 15px;
          color: #666666;
        }
      }
    }
  }
}
</style>
<style lang="scss">
#workerDetail {
  .el-input {
    display: block;
    width: 100%;
  }
  .el-form-item__error {
    top: -80%;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item {
    width: 80%;
  }
  .el-form-item__label {
    float: none;
  }
  .el-input__prefix {
    left: 90%;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 15px;
  }
  .el-icon-circle-close {
    display: none;
  }
}
</style>


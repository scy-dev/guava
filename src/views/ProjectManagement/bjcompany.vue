<template>
  <el-container class="public-box" id="log">
    <!-- 这里是头部-->
    <!-- 有标题和按钮的用这种 -->
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">编辑企业信息</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="baocun('formInline')">保存</el-button>
          <el-button>
            <router-link to="/information">取消</router-link>
          </el-button>
        </el-row>
      </el-row>
    </el-header>

    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-form
          :inline="true"
          :model="formInline"
          :rules="rules"
          ref="formInline"
          class="demo-form-inline all-form"
          label-position="top"
        >
          <el-form-item label="公司名称：" prop="corpname">
            <el-input v-model="formInline.corpname" placeholder="杭州爱忒麦网络科技有限公司"></el-input>
          </el-form-item>
          <el-form-item label="信用代码：" class="hehe" prop="creditCode">
            <el-input v-model="formInline.creditCode" placeholder="请输入信用代码"></el-input>
          </el-form-item>
          <el-form-item label="法人代表：" prop="legalMan">
            <el-input v-model="formInline.legalMan" placeholder="请输入法人代表"></el-input>
          </el-form-item>
          <el-form-item label="企业类型：" prop="corptype">
            <el-select v-model="formInline.corptype" placeholder="请输入公司名称">
              <el-option
                v-for="item in qy"
                :key="item.code"
                :label="item.msg"
                :value="parseInt(item.code)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="固定电话：" prop="telephone">
            <el-input v-model="formInline.telephone" placeholder="请输入固定电话"></el-input>
          </el-form-item>
          <el-form-item label="注册资金（万元）：" prop="regCapital">
            <el-input v-model="formInline.regCapital" placeholder="请输入注册资金"></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="开户银行" prop="bankName">
            <!-- 不需要验证 -->
            <el-input v-model="formInline.bankName" placeholder="农业银行"></el-input>
          </el-form-item>
          <el-form-item label="银行账号：" class="hehe" prop="account">
            <!-- 不需要验证 -->
            <el-input v-model="formInline.account" placeholder="请输入银行账号"></el-input>
          </el-form-item>
          <el-form-item label="企业注册地区：" class="zhuc" prop="areaCode">
            <el-select v-model="formInline.area1" placeholder="请选择省份" @change="changeProvince($event);changeCity(formInline.area2)" style="width:160px;">
              <el-option 
              v-for="item in area1" 
              :key="item.id" 
              :label="item.name" 
              :value="item.name"
              ></el-option>
            </el-select>
            <el-select v-model="formInline.area2" placeholder="请选择城市" @change="changeCity" style="width:160px;">
              <el-option 
              v-for="item in area2" 
              :key="item.id" 
              :label="item.name" 
              :value="item.name"
              ></el-option>
            </el-select>
            <el-select 
            
            v-model="formInline.areaCode" placeholder="请选择区县" style="width:160px;">
              <el-option 
              v-for="item in area3" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业地址：" prop="address">
            <el-input v-model="formInline.address" placeholder="请输入公司地址"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="linkMan">
            <el-input v-model="formInline.linkMan" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" class="hehe" prop="phoneNumber">
            <el-input v-model="formInline.phoneNumber" placeholder="请输入联系人的联系方式"></el-input>
          </el-form-item>
          <el-form-item label="营业执照附件：" prop="licenseUrl" class="fujian">
            <el-upload
              class="upload-demo"
              :action="action"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload2"
              :on-success="handleAvatarSuccess2"
              :before-remove="beforeRemove"
              multiple
              :data="{type:1}"
              :file-list="formInline.licenseUrl"
            >
              <el-button style="width:106px;height:32px">
                <i class="el-icon-upload2"></i>上传文件
              </el-button>
              <span style="margin-left:5px;color:#000000;font-size:14px">支持扩展名：jpg/png/pdf，且不超过10MB</span>
            </el-upload>
            <!-- <el-input v-model="formInline.licenseUrl" style="display:none"></el-input> -->
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { store } from "@/plugin/observable";
import { beforeAvatarUpload } from "@/plugin/beforeUpload";
import { Mobile, BankCard, Money, Telephone , companyCard } from "@/plugin/formRules";
import {district} from '@/views/AttendanceManagement/mixins'
export default {
  mixins:[district],
  data() {
    var area = (rule, value, callback) => {
      if (
        this.formInline.area1 == "" ||
        this.formInline.area2 == "" ||
        this.formInline.area3 == ""
      ) {
        callback(new Error("请输选择项目所在地区"));
      } else {
        callback();
      }
    };
    var checkAge = (rule, value, callback) => {
      if (this.formInline.licenseUrl.length > 0) {
        callback();
      } else {
        return callback(new Error("请上传合法的图片"));
      }
    };
    return {
      model:'bjcompany',
      projectId: "", //编辑回显的项目ID值
      corpnames: "", //编辑回显的企业名称值
      qy: [], //企业类型下拉框
      value1: "",
      formInline: {
        corpname: "",
        creditCode: "",
        legalMan: "",
        corptype: "",
        telephone: "",
        regCapital: "",
        bankName: "",
        account: "",
        address: "",
        linkMan: "",
        phoneNumber: "",
        licenseUrl: [], //营业执照验证
        area1: "",
        area2: "",
        areaCode: ""
      },
      options: [],
      value: "",
      area1: [],
      area2: [],
      area3: [],
      // formInline.licenseUrl: [], //营业执照
      rules: {
        corpname: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        creditCode: [
          { required: true, validator: companyCard, trigger: "blur" }
        ],
        legalMan: [
          { required: true, message: "请输入法人代表", trigger: "blur" }
        ],
        corptype: [
          { required: true, message: "请输选择企业类型", trigger: "blur" }
        ],
        telephone: [{ required: true, validator: Telephone, trigger: "blur" }],
        regCapital: [{ required: true, validator: Money, trigger: "blur" }],
        areaCode: [{ validator: area, trigger: "blur", required: true }],
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ],
        account: [{ required: true, validator: BankCard, trigger: "blur" }],
        linkMan: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        phoneNumber: [{ required: true, validator: Mobile, trigger: "blur" }],
        licenseUrl: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    changeProvince(val) {
      this.area1.forEach(e => {
        if (e.name === val) {
          this.area2 = e.city;
          this.formInline.area2 = this.area2[0].name;
        }
      });
    },
    changeCity(val) {
      this.area2.forEach((e, i) => {
        if (e.name == "市辖区") {
        }
        if (e.name === val) {
          this.area3 = e.area;
          this.area3.forEach((e, i) => {
            if (e.name == "市辖区") {
              this.area3.splice(i, 1);
            }
          });
          this.formInline.areaCode = this.area3[0].id;
        }
      });
    },
    hehe(val){
      //console.log(this.formInline.areaCode)
      this.area2 =  this.area1.filter(e=>e.name === val)[0].city;
      //console.log(this.area2)
      this.area3= this.area2.filter(e=>e.name==this.formInline.area2)[0].area;
      //console.log(this.area3)
    },
    //编辑的回显请求
    huixian(){
      axios({
        url: "/Projectmanager/project/companyIfno",
        //url: `${this.liuxiancai}/Projectmanager/project/companyIfno`,
        method: "post",
        transformRequest: this.transformRequest, //axios请求需求，main.js中改变了
        data: {
          projectId: this.projectId,
          corpname: this.corpnames
        }
      }).then(res => {
        let data = res.data.data;
        Object.assign(this.formInline, data);
        this.formInline.areaCode = parseInt(data.areaCode)
        this.hehe(data.area1)
        this.formInline.licenseUrl = [];
        this.formInline.licenseUrl.push({
          name: /[^\\]+(\.[A-z]+$)/.exec(data.licenseUrl)[0],
          url: data.licenseUrl
        });
        //console.log(this.formInline.licenseUrl)
      });
    },
    //编辑企业下拉框的请求
    qiye() {
      axios({
        url: "/Projectmanager/project/companyTypeList",
        method: "get",
        transformRequest: this.transformRequest //axios请求需求，main.js中改变了
      }).then(res => {
        this.qy = res.data.data;
        //console.log(res.data.data);
      });
    },
    //编辑OK的请求
    okbj() {
      let obj = Object.assign({}, this.formInline);
      obj.workerId = sessionStorage.getItem("workerId");
      obj.licenseUrl = "";
      obj.file = JSON.stringify(this.formInline.licenseUrl[0]);
      axios({
        url: "/Projectmanager/project/enterpriseUpdate",
        method: "post",
        transformRequest: this.transformRequest, //axios请求需求，main.js中改变了
        data: obj
      }).then(res => {
        //this.qy = res.data.data;
        //console.log(res);
      });
    },
    //保存
    baocun(formInline) {
      this.$refs[formInline].validate(valid => {
        if (valid) {
          this.okbj();
          this.$router.push({
            path: "/information"
          });
        } else {
          return false;
        }
      });
    },
    //下面全是文件上传的函数
    handleRemove(file, fileList) {
      //移除的钩子
      this.formInline.licenseUrl = [];
    },
    handlePreview(file) {
      // console.log(file, 99);
    },
    beforeRemove(file, fileList) {
      //移除之前的钩子
      this.formInline.licenseUrl = [];
    },
    handleAvatarSuccess2(res, file) {
      //上传成功的钩子
      this.formInline.licenseUrl = [{ name: file.name, url: res.data.url }];
      // this.formInline.licenseUrl=[res.data.url]
      //console.log(res,file,899999999)
    },
    beforeAvatarUpload2(file, fileList) {
      //上传之前的钩子
      // window.print();
      //console.log(file, 6);
      let reg = beforeAvatarUpload(file, [
        "image/jpeg",
        "application/pdf",
        "image/png",
        "image/jpg"
      ]);
      if (!reg.type) {
        this.$message.error("上传格式不正确");
      }
      return reg.type;
    }
  },
  mounted() {
    
  },
  created() { 
    this.district();  
    this.projectId = store.projectId;
    this.corpnames = this.$route.query.corpname;
    this.qiye();
    //console.log(this.projectId);
  }
};
</script>
<style lang="scss">
@import '~@/styles/public.scss';
#log .el-form-item .el-form-item__label::before {
  top: 0;
  right: -10px;
}
#log .el-icon-document:before {
  content: url("../../assets/images/hxj.png");
}
#log .zhuc .el-select {
  margin-right: -40px;
}
#log .zhuc .el-input .el-input__inner {
  width: 70%;
  padding: 0 15px;
}
#log .zhuc .el-input__suffix{right: 52px;}
#log .fujian .all-form .el-form-item{width: 28%}
#log .fujian .el-button{padding:0}
</style>

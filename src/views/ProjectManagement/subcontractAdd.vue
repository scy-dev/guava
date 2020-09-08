<template>
  <el-container class="public-box" id="log">
    <!-- 这里是头部-->
    <!-- 有标题和按钮的用这种 -->
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">新增分包</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="ttk('formInline')">保存</el-button>
          <router-link to="/subcontract" class="ly">取消</router-link>
        </el-row>
      </el-row>
    </el-header>
    <!-- 这里是弹框 -->
    <el-dialog title="账号激活成功" :visible.sync="diaVisible" width="28%" :before-close="handleClose">
      <i
        class="el-icon-success"
        style="font-size:20px;color:rgba(82,196,26,1);position:absolute;left:40px;top:54px"
      ></i>
      <span style="margin-left:15%">项目账号：</span>
      {{ruleForm.account}}
      <br>
      <span style="margin-left:15%">项目密码：</span>
      {{ruleForm.password}}
      <span slot="footer" class="dialog-footer">
        <el-button @click="diaVisible = false">取 消</el-button>
        <el-button type="primary" @click="diaVisible = false;$router.push({path:'/subcontract'})">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-form
          :rules="rules"
          ref="formInline"
          :inline="true"
          :model="formInline"
          class="demo-form-inline all-form"
          label-position="top"
        >
          <el-form-item label="公司名称：" prop="corpname">
            <el-input v-model="formInline.corpname" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="信用代码：" class="hehe" prop="creditCode">
            <el-input v-model="formInline.creditCode" placeholder="请输入信用代码"></el-input>
          </el-form-item>
          <el-form-item label="分包类型：" prop="subContractType">
            <el-select v-model="formInline.subContractType" placeholder="请选择分包类型">
              <el-option
                v-for="item in options1"
                :key="item.code"
                :label="item.msg"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构名称：" prop="institution">
            <el-input v-model="formInline.institution" placeholder="请输入机构名称"></el-input>
          </el-form-item>
          <el-form-item label="单位类型：" prop="corptype">
            <el-select v-model="formInline.corptype" placeholder="请选择单位类型">
              <el-option
                v-for="item in options2"
                :key="item.code"
                :label="item.msg"
                :value="item.code"
              ></el-option>
            </el-select>
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
          <el-form-item label="法人代表：" prop="legalMan">
            <el-input v-model="formInline.legalMan" placeholder="请输入法人代表"></el-input>
          </el-form-item>
          <el-form-item label="注册资金（万元）：" prop="regCapital">
            <el-input v-model="formInline.regCapital" placeholder="请输入注册资金"></el-input>
          </el-form-item>
          <el-form-item label="负责人员：" prop="principal">
            <el-input v-model="formInline.principal" placeholder="请输入负责人员"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="phoneNumber">
            <el-input v-model="formInline.phoneNumber" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <div class="cont">
            <el-form-item label="分包内容：" class="hehe" prop="content">
              <el-input type="textarea" v-model="formInline.content" placeholder="请输入分包内容"></el-input>
            </el-form-item>
          </div>
          <div class="one">
            <el-form-item prop="contractFile" label="分包合同附件：">
              <el-upload
                class="upload-demo"
                :action="action"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :before-remove="beforeRemove"
                multiple
                :data="{type:2}"
                :file-list="fbList"
              >
                <el-button style="width:106px;height:32px">
                  <i class="el-icon-upload2"></i>上传文件
                </el-button>
                <span style="margin-left:20px;color:#000000;font-size:14px">只能上传pdf格式文件，且不超过10MB</span>
              </el-upload>
              <el-input v-model="formInline.contractFile" style="display:none"></el-input>
            </el-form-item>
          </div>
          <div class="one two">
            <el-form-item prop="businessFile" label="营业执照附件：">
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
                :file-list="yyList"
              >
                <el-button style="width:106px;height:32px">
                  <i class="el-icon-upload2"></i>上传文件
                </el-button>
                <span
                  style="margin-left:20px;color:#000000;font-size:14px"
                >支持扩展名：jpg/png/pdf，且不超过10MB</span>
              </el-upload>
              <el-input v-model="formInline.businessFile" style="display:none"></el-input>
            </el-form-item>
          </div>
          <div></div>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import {store} from '@/plugin/observable'
import { beforeAvatarUpload } from "@/plugin/beforeUpload";
import { Money, Mobile } from "@/plugin/formRules";
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
    var validateContractFile = (rule, value, callback) => {
      // console.log(value.length)
      if (value.length == 0) {
        callback(new Error("请上传图片"));
      } else {

        callback();
      }
    };
    var validateBusinessFile = (rule, value, callback) => {
      // console.log(value)
      if (value.length == 0) {
        callback(new Error("请上传图片"));
      } else {

        callback();
      }
    };
    return {
      diaVisible: false,
      ruleForm: {
        account: '',
        password: ''
      },
      haha:{},
      value1: "",
      fileList:[],
      fileLists:[],
      formInline: {
        projectId:'',
        corpname: "",
        creditCode: "",
        subContractType: "",
        institution: "",
        corptype: "",
        legalMan: "",
        regCapital: "",
        principal: "",
        phoneNumber: "",
        content: "",
        contractFile:[],//分包
        businessFile:[],//营业执照
        areaCode: "",
        area1: "",
        area2: ""
      },
      options: [],
      value: "",
      area1: [],
      area2: [],
      area3: [],
      fbList:[],
      yyList:[],
      options1: [],
      options2: [],
      rules: {
        corpname: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        creditCode: [
          { required: true, message: "请输入信用代码", trigger: "blur" }
        ],
        subContractType: [
          { required: true, message: "请选择分包类型", trigger: "change" }
        ],
        institution: [
          { required: true, message: "请输入机构类型", trigger: "change" }
        ],
        corptype: [
          { required: true, message: "请选择单位类型", trigger: "change" }
        ],
        areaCode: [{ validator: area, trigger: "blur", required: true }],
        legalMan: [
          { required: true, message: "请输入法人代表", trigger: "blur" }
        ],
        regCapital: [{ required: true, validator: Money, trigger: "blur" }],
        principal: [
          { required: true, message: "请输入负责人员", trigger: "blur" }
        ],
        phoneNumber: [{ required: true, validator: Mobile, trigger: "blur" }],
        content: [
          { required: true, message: "请输入分包内容", trigger: "blur" }
        ],
        contractFile: [{ validator: validateContractFile, trigger: "change" }],
        businessFile: [{ validator: validateBusinessFile, trigger: "change" }]
      }
    };
  },
  mounted() {
    this.fbcx();
    this.dwcx();
    this.district();
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
    //新增分包的保存
    ttk(formInline) {
      this.$refs[formInline].validate(valid => {
        if (valid) {
          // console.log(this.formInline);
          this.bc();
        } else {
          return false;
        }
      });
    },
    fbcx() {
      //单位类型的下拉查询
      axios({
        url: "/Projectmanager/project/subContractTypeList",
        method: "get"
      }).then(res => {
        this.options1= res.data.data;
        // console.log(res.data.data);
      });
    },
    dwcx() {
      //单位类型的下拉查询
      axios({
        url: "/Projectmanager/project/companyTypeList",
        method: "get"
      }).then(res => {
        this.options2 = res.data.data;
        // console.log(res.data.data);
      });
    },
    bc() {
      //保存
      axios({
        url: "/Projectmanager/project/addSubContract",
        method: "post",
        transformRequest:this.transformRequest,
        data: this.formInline
      }).then(res => {
        this.diaVisible = true;
        Object.assign(this.ruleForm,res.data.data)
      });
    },
    //下面全是文件上传的函数
    handleRemove(file, fileList) {//移除的钩子
      this.yyList=[file];
      this.fbList = [file];
    },
    handlePreview(file) {
      // console.log(file, 99);
    },
    beforeRemove(file, fileList) {//移除之前的钩子
      this.yyList = [];
      this.fbList = [];
    },
    handleAvatarSuccess(res, file) {//上传成功的钩子
      this.fbList = [file];
      this.formInline.contractFile=[res.data.url]
    },
    handleAvatarSuccess2(res, file) {//上传成功的钩子
      this.yyList=[file];
      this.formInline.businessFile=[res.data.url]
    },
    beforeAvatarUpload(file, fileList) {//上传之前的钩子
      let reg = beforeAvatarUpload(file, ["application/pdf"]);
      if (!reg.type) {
        this.$message.error(reg.message);
      }
      return reg.type;
    },
    beforeAvatarUpload2(file, fileList) {
      //上传之前的钩子
      // window.print();

      let reg = beforeAvatarUpload(file, [
        "image/jpeg",
        "application/pdf",
        "image/png",
        "image/jpg"
      ]);
      if (!reg) {
        this.$message.error("上传格式不正确");
      }
      return reg;
    }
  },
  created(){
    this.formInline.projectId=store.projectId
    //console.log(this.formInline.projectId)
  }
};
</script>
<style scoped lang="scss">
.one {
  .el-form-item {
    width: 420px;
  }
}
.cont {
  .el-form-item {
    width: 629px;
    margin-right: 500px;
  }
}
</style>
<style lang="scss">
#log .el-dialog__header {
  border: 0;
  margin-left: 40px;
  padding: 50px 30px 10px;
}
#log .el-dialog__body {
  padding: 0 20px 30px 20px;
}
#log .el-form-item .el-form-item__label::before {
  top: 1.5px;
  right: -10px;
}
#log .el-icon-document:before {
  content: url("../../assets/images/hxj.png");
}
#log .ly {
  display: inline-block;
  width: 68px;
  height: 38px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #3c62d0;
  border-radius: 5px;
  margin-left: 10px;
}
#log .one .el-button{padding:0}
#log .zhuc .el-select {
  margin-right: -40px;
}
#log .zhuc .el-input .el-input__inner {
  width: 70%;
  padding: 0 15px;
}
#log .zhuc .el-input__suffix{right: 52px;}
</style>
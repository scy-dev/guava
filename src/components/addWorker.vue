<template>
  <div id="add">
    <el-dialog
      title="新增工人"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="400px"
      custom-class="addWorker addDialog"
       @close='closeDialog("addForm")'
    >
      <div class="dialogContent">
        <div class="formData">
          <el-form
            :model="addForm"
            :rules="formRule"
            ref="addForm"
            class="demo-ruleForm"
            :inline="true"
          >
            <el-form-item label="姓名：" prop="fullName">
              <el-input v-model="addForm.fullName"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="addForm.sex">
                <el-option
                 v-for="(item,index) in sexList"
                 :value="item.value"
                 :key="index"
                 :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期" prop="telephone">
              <el-input v-model="addForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="证件号码：" prop="idCard">
              <el-input v-model="addForm.idCard"></el-input>
            </el-form-item>
            <el-form-item label="民族">
              <el-input placeholder="请输入民族"></el-input>
            </el-form-item>
            <el-form-item label="籍贯">
              <el-input placeholder="请输入籍贯"></el-input>
            </el-form-item>
            <el-form-item label="签发机关">
              <el-input placeholder="请输入签发机关"></el-input>
            </el-form-item>
            
            <!-- <el-form-item label="学历">
              <el-select v-model="addForm.education">
                <el-option
                v-for="(item,index) in educationalType"
                :value="item.value"
                :label="item.label"
                :key="index"
                >
                </el-option>
              </el-select>
            </el-form-item>            
            <el-form-item label="紧急联系人：" prop="emergencyContact">
              <el-input v-model="addForm.emergencyContact"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机号：" prop="emergencyContactTel">
              <el-input v-model="addForm.emergencyContactTel"></el-input>
            </el-form-item>
            <el-form-item label="住址：" prop="address">
              <el-input v-model="addForm.address"></el-input>
            </el-form-item> -->

            <div class="headPic">
              <el-form-item label="头像信息：" prop="Photo">
                <img src="./../assets/images/header.png" alt>
              </el-form-item>
              <div class="button">
                <el-button type="primary" @click="ReadIdCard">读取身份证</el-button>
                <el-button @click="nextStep">下一步</el-button>
              </div>              
            </div>
          </el-form>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('addForm')">取 消</el-button>
        <el-button type="primary" @click="addW('addForm')">确 定</el-button>
      </span>         -->
    </el-dialog>
    <el-dialog
      title="完善信息"
      :visible.sync="dialogPerfect"
      width="70%"
      custom-class="addWorker perfectMessage"
      :before-close="improveClose"
    >
      <div class="perfectCon">
        <el-form
          :model="improveForm"
          :rules="improveRule"
          ref="improveForm"
          class="demo-ruleForm Perfect"
          :inline="true"
        >
          <el-form-item label="分包单位" prop="companyId">
            <el-select v-model="improveForm.companyId" placeholder="请选择分包单位" @change="SelectCom">
              <el-option
                v-for="item in comp"
                :key="item.subContractId"
                :label="item.corpname"
                :value="item.subContractId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班组名称" prop="teamId">
            <el-select v-model="improveForm.teamId" :disabled="!visit" placeholder="请选择班组">
              <el-option
                :label="item.teamName"
                :value="item.teamId"
                v-for="item in team"
                :key="item.teamId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="学历">
              <el-select v-model="addForm.education">
                <el-option
                v-for="(item,index) in educationalType"
                :value="item.value"
                :label="item.label"
                :key="index"
                >
                </el-option>
              </el-select>
            </el-form-item>            
          <el-form-item label="紧急联系人">
            <el-input placeholder="请输入紧急联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人电话">
            <el-input placeholder="请输入紧急联系人电话"></el-input>
          </el-form-item>
          <el-form-item label="现居住地">
            <el-input placeholder="请输入居住地信息"></el-input>
          </el-form-item>
          <el-form-item label="是否住宿">
            <el-radio-group>
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="照片录入：" prop="photo_url">
            <el-upload
              class="avatar-uploader"
              :action="baseurl+'Projectmanager/project/fileUpload'"
              :data="{type:3}"
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
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('add')">取 消</el-button>
        <el-button type="primary" @click="addW">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import { addWorker } from '@/api/api'
export default {
  name: "",
  props: ["dialogVisible"],
  inject: ["BusMethod"],
  data() {
    return {
      hint: true, //控制弹窗提示是否出现
      educationalType:[
        { label: '小学', value: '小学'},
        { label: '初中', value: '初中'},
        { label: '高中', value: '高中'},
        { label: '大专', value: '大专'},
        { label: '本科', value: '本科'},
        { label: '硕士', value: '硕士'},
        { label: '博士', value: '博士'},
        { label: '其他', value: '其他'}
      ],
      addForm:{
        fullName: null,
        idCard:null,
        telephone:null,
        sex: 0,
        education: '小学',
        emergencyContact:null,
        emergencyContactTel:null,
        address:null,
      },
      workerInfo: null,
      sexList:[
        { label: '男', value: 0},
        { label: '女', value: 1}
      ],
      formRule:{
        fullName:[
          { required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        telephone:[
          { required: true, message: '请输入手机号', trigger: 'blur'},
        ],
        idCard:[
          { required: true, message: '请输入身份证号', trigger: 'blur'}
        ],
        emergencyContact:[
          { required: true, message: '请输入紧急人姓名', trigger: 'blur'}
        ],
        emergencyContactTel:[
          { required: true, message: '请输入紧急联系方式', trigger: 'blur'}
        ],
        address:[
          { required: false}
        ],
        sex:[
          { required: false}
        ]
      },      
      improveForm: {
        teamId: "",
        companyId: "",
        photo_url: ""
      },
      improveRule: {
        teamId: [{ required: true, message: "请选择班组", trigger: "change" }],
        companyId: [
          { required: true, message: "请选择分包单位", trigger: "change" }
        ],
        photo_url: [{ required: true, message: "请上传照片", trigger: "blur" }]
      },      
      dialogPerfect: false, //控制完善信息弹窗
      comp: [],
      team: [],
      fileList: [],
      visit: false
    };
  },
  methods: {
    closeDialog(formName) {
      /**
       * @description 关闭编辑、增加弹出框
       * @param {String} formName 弹窗类型
       */
      if(formName == 'addForm'){
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
        this.$emit("dialog",false)
      }
    },    
    addW(formName) {
      /**
       * @description 添加员工信息
       * @param {String} fullName 姓名
       * @param {Number} sex 性别 0-未认证 1-已认证
       * @param {String} idCard 身份证号
       * @param {String} telephone 手机号
       * @param {Number} verified 是否已实名认证 0-未认证 1-已认证
       * @param {String} emergencyContact 紧急联系人姓名
       * @param {String} emergencyContactTel 紧急联系人电话
       * @param {String} address 居住地
       */
      this.$refs[formName].validate(valid=>{
        if(valid){
          let param = {
            fullName: this.addForm.fullName,
            idCard: this.addForm.idCard,
            sex: this.addForm.sex,
            telephone: this.addForm.telephone,
            verified: 0,//添加员工信息时，默认为0
            emergencyContact: this.addForm.emergencyContact,
            emergencyContactTel: this.addForm.emergencyContactTel,
            address: this.addForm.address
          };
          addWorker(param).then(res=>{
            if(res.err_CODE === 0){
              this.dialogVisible = false;
              this.$refs[formName].resetFields();
              this.$emit("dialog", this.dialogVisible);
              this.BusMethod();
            }else{
              this.$message.error(res.err_MESSAGE);
            }
          })
        }else{
          return false;
        }
      })      
    },
    nextStep(){
      /**
       * @description 完善工人信息弹出框展示
       */
      this.dialogPerfect = true;
    }
  }
};
</script>
<style lang="scss">
#add {
  .addDialog {
    min-width: 1287px;
    .el-form-item__label::before {
      top: 0px;
    }
  }
  .addWorker {
    .el-dialog__header {
      border-bottom: 1px solid rgba(232, 232, 232, 1);
      .el-dialog__title {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
    }
    .dialogContent {
      padding: 0 20px 30px;
      box-sizing: border-box;
      .hint {
        background: rgba(221, 228, 247, 1);
        padding-left: 16px;
        padding-right: 16px;
        color: rgba(0, 0, 0, 0.65);
        font-family: PingFangSC-Regular;
        display: flex;
        justify-content: space-between;
        border-radius: 4px;
        p {
          height: 40px;
          line-height: 40px;
          i {
            color: #3c62d0;
          }
        }
        .closeHint {
          cursor: pointer;
        }
      }
      .formData {
        display: flex;
        justify-content: space-between;
        position: relative;
        margin-top: 20px;
        .demo-ruleForm {
          width: 885px;
          .el-form-item:nth-of-type(2n) {
            margin-left: 54px;
          }
        }
        .headPic {
          width: 300px;
          position: absolute;
          top: 0;
          right: 0;
          img {
            margin-left: 50px;
            width: 184px;
            height: 184px;
            margin-top: 50px;
          }
        }
        .button {
          margin-top: 45px;
          .el-button--primary {
            margin-left: 50px;
          }
          .el-button + .el-button {
            margin-left: 16px;
          }
        }
      }
    }
  }
  .perfectMessage {
    .perfectCon{
      display: flex;
      justify-content: space-between;
      .el-form-item:nth-of-type(2n) {
        margin-left: 54px;
      }      
    }
    // .el-form-item {
    //   width: 100%;
    // }
    .el-dialog__body {
      padding: 20px 40px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    }
    .el-dialog__footer {
      margin-top: 20px;
      padding: 10px 40px 20px;
    }
  }
  .el-form-item {
    width: 45%;
    .el-form-item__label {
      float: none;
    }
    .el-form-item__content {
      display: block;
      .el-input__inner {
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
      }
    }
  }
  .headPic {
    .el-form-item__content {
      .el-form-item__error {
        top: -15%;
        right: -119%;
      }
    }
  }
}
</style>

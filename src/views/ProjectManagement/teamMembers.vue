<template>
  <div id="teamQuery">
    <div class="role-main">
      <div class="ming" style="display:inline-block">
        <span>姓名：</span>
        <el-input v-model="name" placeholder="请输入正确的姓名" style="width:280px"></el-input>
      </div>
      <div class="role-search">
        <el-button type="primary" @click="search" style="color:#fff">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <div>
        <el-button type="primary" style="margin-top:40px;" @click="AddWorker">新增工人</el-button>
        <el-button style="margin-top:40px;" @click="ydWorker">移动工人</el-button>
      </div>
      <div class="contentTable">
        <el-table :data="tableData" @select="selection"  @select-all="allSelection" checkbox style="width: 100%" v-loading="loading">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="idcard" label="身份证号码" width="180"></el-table-column>
          <el-table-column prop="corpname" label="分包单位" width="280"></el-table-column>
          <el-table-column prop="workerType" label="工种" width="180"></el-table-column>
          <el-table-column label="劳动合同" width="180">
            <template slot-scope="scope">
              <i class="icon" :style="{'background-color':scope.row.status==1?'#3C62D0':'#F5222D'}"></i>
              <span style="margin-left: 8px;color:#6E6E6E;font-size:14px">{{ scope.row.status==1?'有效':'无效'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                style="border:0; color:#3C62D0"
                @click="handleBzz(scope.$index, scope.row)"
              >{{ scope.row.operation==1?'取消班组长':'设定班组长'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增工人 -->
        <div class="dialog">
          <el-dialog
            title="新增工人"
            :visible.sync="dialogVisible"
            width="70%"
            custom-class="addWorker addDialog"
            :before-close="handleClose"
          >
            <div class="dialogContent">
              <div class="hint" v-show="hint">
                <p>
                  <i class="el-icon-warning"></i>
                  请将身份证放置在身份证读卡器上，然后点击“读取身份证”进行读取。
                  <a href="http://onecardok.com.cn/UploadFiles/%E6%96%B0%E4%B8%AD%E6%96%B0webapi%E8%AF%BB%E5%8D%A1%E6%9C%8D%E5%8A%A13.0.9-2.zip" style="color:#3c62d0">点击下载驱动</a>
                </p>
                <p class="closeHint" @click="closeHint">x</p>
              </div>
              <div class="formData">
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  class="demo-ruleForm"
                  :inline="true"
                >
                  <el-form-item label="姓名：" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="出生日期：" prop="born">
                    <el-input v-model="ruleForm.born"></el-input>
                  </el-form-item>
                  <el-form-item label="性别：" prop="sex">
                    <el-input v-model="ruleForm.sex"></el-input>
                  </el-form-item>
                  <el-form-item label="证件号码：" prop="cardno">
                    <el-input v-model="ruleForm.cardno"></el-input>
                  </el-form-item>
                  <el-form-item label="民族：" prop="nation">
                    <el-input v-model="ruleForm.nation"></el-input>
                  </el-form-item>
                  <el-form-item label="签发机关：" prop="police">
                    <el-input v-model="ruleForm.police"></el-input>
                  </el-form-item>
                  <el-form-item label="住址：" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期限：" prop="userLife">
                    <el-input v-model="ruleForm.userLife"></el-input>
                  </el-form-item>
                </el-form>
                <div>
                  <el-form
                    :model="headPic"
                    :rules="headPicRules"
                    ref="headPic"
                    class="demo-ruleForm headPic"
                    :inline="true"
                  >
                    <el-form-item label="头像信息：" prop="photobase64">
                       <img :src="'data:image/png;base64,'+ ruleForm.photobase64" v-if="ruleForm.photobase64">
                       <img src="./../../assets/images/header.png" alt v-else>
                    </el-form-item>
                  </el-form>
                  <div class="button">
                    <el-button type="primary" @click="ReadIdCard">读取身份证</el-button>
                    <el-button @click="nextStep('ruleForm')">下一步</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-dialog>
          <el-dialog
            title="完善信息"
            :visible.sync="dialogPerfect"
            width="30%"
            custom-class="addWorker perfectMessage"
            :before-close="improveClose"
          >
            <div>
              <el-form
                :model="improveForm"
                :rules="improveRule"
                ref="improveForm"
                class="demo-ruleForm Perfect"
              >
                <el-form-item label="照片录入：" prop="photo_url">
                    <el-upload
                      class="upload-demo"
                      :action="action"
                      :data="{type:3}"
                      name="file"
                      :show-file-list="true"
                      :on-success="handleAvatarSuccess"
                      :on-error="handleError"
                      :before-upload="beforeAvatarUpload"
                      :file-list="fileList"
                      :on-exceed="handleLimit"
                      :limit="1">
                      <el-button style="width:106px;height:32px"><i class="el-icon-upload2"></i>上传文件</el-button>
                      <span style="margin-left:15px;color:#000000;font-size:14px">支持扩展名：jpg/png，且不超过10MB</span>
                      <img src alt>
                    </el-upload>                    
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="improveClose">取 消</el-button>
              <el-button type="primary" @click="addW">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 移动工人模态框 -->
        <el-dialog
          class="bj"
          title="移动工人"
          :visible.sync="diVisible"
          width="28%"
          :before-close="handleClose"
        >
          <el-form :model="yidong" :rules="rules" ref="yidong" class="demo-ruleForm">
            <el-form-item label="选择班组：">
              <el-select v-model="ydid" placeholder="请选择班组" style="width:503px">
                <el-option
                  v-for="item in banzu"
                  :key="item.teamId"
                  :label="item.teamName"
                  :value="item.teamId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="diVisible = false">取 消</el-button>
            <el-button type="primary" @click="qd('yidong')">确 定</el-button>
          </span>
        </el-dialog>
         <Pagination @pagination='pagination' :total='total' :pageSize='searchForm.pageSize' :pageNum='searchForm.pageNum' />
      </div>
    </div>
  </div>
</template>

<script>
import {IDCard,Brityday} from "@/plugin/formRules";
import { throttle } from "@/plugin/throttle";
import { beforeAvatarUpload } from "@/plugin/beforeUpload";
export default {
  name: "",
  props: ["dialogVisible", "visit"],
  inject:['BusMethod'],
  data() {
    return {
      banzu:[],//班组下拉移动工人中
      name:null,
      total:0,
      dialogVisible: false, //新增弹窗
      dialogPerfect: false, //第二个弹窗
      diVisible: false, //移动工人
      //完善信息
      Perfect: {
        danwei: "",
        groupName: ""
      },
      hint: true, //控制弹窗提示是否出现
      loading:false,
      czform:{},//路由传值
      //整个列表请求
      tableData: [],
      operation:'',//班组长的定值
      //移动工人
      ydid:'',
      searchForm:{
          name:'',
          teamId:null,
          corpname:null,
          pageNum:1,
          pageSize:10,
        },
      //左侧表单
      ruleForm: {
        name: "",
        born: "",
        sex: "",
        cardno: "",
        nation: "",
        police: "",
        address: "",
        userLife:'',//有效期
        userlifeb: "",
        userlifee:'',
        photobase64: "",
        FrontImg: "",
        backImg: ""
      },
      xm:'',//姓名
      sfz:'',//身份证
      //左侧表单验证
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" },],
        born: [{ required: true, validator: Brityday, trigger: "blur" },],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" },],
        cardno: [{ required: true, validator: IDCard, trigger: "blur" },],
        nation: [{ required: true, message: "名族不能为空", trigger: "blur" },],
        police: [{ required: true, message: "签发机关不能为空", trigger: "blur" },],
        address: [{ required: true, message: "住址不能为空", trigger: "blur" },],
        userLife: [{ required: true, message: "有效期间不能为空", trigger: "blur" },],
        photobase64: [{ required: true, message: "请上传头像", trigger: "blur" }]
      },
      //完善信息
      improveForm: {
        photo_url: ""
      },
      improveRule: {
        photo_url: [{ required: true, message: "请上传照片", trigger: "blur" }]
      },
      fileList:[],
      //完善信息
      Perfect: {
        danwei: "",
        groupName: ""
      }
    };
  },
  methods: {      
    //上传附件超过数量
    handleLimit(files, fileList) {
      //console.log(files, fileList);
      this.$message.error("只能上传一张附件，请先删除再上传");
    },
    // 上传成功
    handleAvatarSuccess(response, file, fileList) {
      this.$set(this.improveForm, "photo_url", response.data.url);
      //console.log(this.improveForm)
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      let reg = beforeAvatarUpload(file,['image/png','image/jpg'])
      if(!reg.type){
        this.$message.error(reg.message)
      };
      return reg.type;
    },
    //请求列表
    getList() {
       this.loading = true;
      axios({
        url: "/Projectmanager/project/queryTeamMember",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data:this.searchForm
      }).then(res => {
        this.tableData = res.data.data.list;
        //判断有无数据;加载中
        if (res.data.code == 1) {
          this.total = res.data.data.total;
          this.loading = false;
        }
        //console.log(res);
      });
    
    },
    //加载
    loading: {
      type: Boolean,
      default: false
    },
    //设为班组长
    handleBzz(index, row){
      //console.log(row,1111)
      axios({
        url: "/Projectmanager/project/operationTeamLeader",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: {
          teamId:this.searchForm.teamId,
          name:row.name,
          operationType:row.operation==1?3:4
        }
      }).then(res => {
        if(res.data.code==200){
          this.getList()
        }
      });
    },
    //搜索
    search:throttle(function(){
      this.searchForm.name = this.name;
      this.searchForm.pageNum = 1;
      this.getList();
    },2000,1000),
    //重置
      reset:throttle(function(){
      this.name = null;
      this.searchForm = this.$options.data().searchForm;
      this.hehe()
    },2000,1000),
    //分页
     pagination(val){
       Object.assign(this.searchForm,val);
       this.getList();
     },  
    //  读取身份证
    ReadIdCard() {
      axios({
        url: "http://127.0.0.1:8989/api/ReadMsg?cardImg=1",
      }).then(res => {
        //console.log(res,999)
        if(res.data.retmsg == '操作成功||相片解码解码正确'){
          function fn(val){
            return val.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3')
            // return moment(val).format('YYYY-MM-DD')
          }
          let data  = res.data;
          Object.assign(this.ruleForm,data)
          this.$set(this.ruleForm,'userLife',fn(data.userlifeb) +' 至 '+fn(data.userlifee))
          this.$set(this.ruleForm,'born',fn(data.born));
        }else{
           this.$message.error("身份证读取失败");
        }
      });
    },
    //新增工人模态框
    AddWorker() {
      this.dialogVisible = true;
      this.hint = true;
    }, 
    //新增人工X关闭
    closeHint() {
      this.hint = false;     
    },
    // 基础信息右上角关闭窗口
    handleClose(done) {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
      this.$emit("dialog", this.dialogVisible);      
      done();   
      this.ruleForm.photobase64=''        
    },
    //取消完善消息的框
    improveClose(done) {
      this.$refs["improveForm"].resetFields();
      this.$refs["ruleForm"].resetFields();
      this.dialogPerfect = false;
      this.$emit("dialog", this.dialogVisible);
      this.ruleForm.photobase64=''
      this.fileList=[]
      done();      
    },
    //下一个弹框
    nextStep(ruleForm) {
      if(this.ruleForm.sex == "女"){
        this.$set(this.ruleForm,'sex',2)
      }else{
         this.$set(this.ruleForm,'sex',1)
      }
      this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.dialogVisible = false;
            this.dialogPerfect = true;
          } else {
            return false;
          }
      });      
    },
    // 最后上传
    addW() {
      this.$refs["improveForm"].validate(valid => {
        if (valid) {
          // Object.assign(this.ruleForm, this.improveForm);
          let obj = Object.assign({},this.ruleForm);
          obj.photo_url = this.improveForm.photo_url;
          obj.teamId = this.$route.query.teamId;
          axios({
            url: "Personnel/person/addWorker",
            method: "post",
            transformRequest: this.transformRequest,
            data: obj
          }).then(res => {
            this.getList()
            if (res.data.message == "成功") {
              this.$message({
                message: "新增成功",
                type: "success",                
              });
              this.dialogPerfect = false;
              this.visit = false;
              this.fileList = [];
              this.ruleForm.photobase64 = '';
              this.$refs["improveForm"].resetFields();
              this.$refs["ruleForm"].resetFields();
              this.$emit("dialog", this.dialogVisible);
              this.BusMethod();
            } else {
              if(res.data.code==-1){
                this.$message.error("人员已添加");
              }else{
                this.$message.error("新增失败");
              }
            }
            //console.log(res);
          });
        } else {
          return false;
        }
      });
    },
    //父页面的值取到子页面，路由跳转接受值；其中name为空才能取得列表，有值的时候是搜索；
    hehe(){
      Object.assign(this.searchForm,this.$route.query)
      this.searchForm.name ='';
      this.getList();
    },
    //选中
    selection(val){
      //console.log(val)
      let arr2=[]
      let arr3=[]
      this.subContractId=val[0].subContractId
      this.teamId=val[0].teamId
      val.forEach((item)=>{
        arr2.push(item.name)
        arr3.push(item.idcard)
        // console.log(item)
      })
      this.xm=arr2.join(',')
      this.sfz=arr3.join(',')
    },
    allSelection(val){ //全选    
      let allArr2=[]
      let allArr3=[]
      this.subContractId=val[0].subContractId
      this.teamId=val[0].teamId
      val.forEach((item)=>{
        allArr2.push(item.name)
        allArr3.push(item.idcard)
      })
      this.xm=allArr2.join(',')
      this.sfz=allArr3.join(',')
      //console.log(this.subContractId)
    },
    //移动工人
    ydWorker() {      
      if(this.subContractId.length==0){
        this.diVisible = false;
        this.$message.error('请选中要移动工人的按钮')
      }else{
        this.diVisible = true;
        this.yd()
      }     
    },
    //移动工人的班组下拉请求
    yd(){
      axios({
        url: "/Projectmanager/project/queryTeamName",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: {
          subcontractId:this.subContractId
        }
      }).then(res => {
        if(res.data.code==200){
          //console.log(res)
          this.banzu=res.data.data
        }
      });
    },
    //移动工人请求接口
    qd() {
      this.diVisible = false;
      axios({
        url: "/Projectmanager/project/moveWorker",
        method: "post",
        transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
        data: {
          inTeamId:this.ydid,//移入班组ID  新
          outTeamId:this.teamId,
          name:this.xm,
          idcard:this.sfz
        }
      }).then(res => {
        //console.log(res)
        if(res.data.code==200){ 
          this.getList()
          this.$message.success('移入成功！') 
        }else{
          this.$message.error('移入失败！')
        }
      });      
    }
  },
  mounted(){

  },
  created() {
   this.hehe()
  }
};
</script>
<style scoped lang="scss">
#teamQuery .role-main {
  span {
    font-size: 16px;
    color: #333333;
  }
  div {
    margin-bottom: 10px;
    
  }
  .ming .el-input {
    width: 280px;
  }
  /* .dialog .el-input {
            width: 335px;    margin-bottom: 60px;
        } */
  .el-select {
    width: 280px;
  }
  .role-search {
    display: inline-block;
    margin-left: 64px;
  }
  .contentTable {
    margin-top: 40px;
  }
}
</style>
<style lang="scss">
#teamQuery .bj .el-form-item{margin-left:20px}
#teamQuery .bj .el-dialog__header .el-dialog__title{margin-left: -20px;}
#teamQuery .el-dialog__body{padding: 30px 0px;}
#teamQuery .el-form-item__error{right:0}
#teamQuery .icon {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 100%;
}
#teamQuery {
  .addDialog {
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
      padding: 0 40px;
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
        margin-top: 40px;
        .demo-ruleForm {
          width: 885px;
          .el-form-item:nth-of-type(2n) {
            margin-left: 54px;
          }
        }
        .headPic {
          width: 300px;
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
    .el-dialog__body {
      padding: 20px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    }
    .el-dialog__footer {
      margin-top: 20px;
    }
  }
}
#teamQuery .dialog .el-form-item {
  .el-form-item__label {
    float: none;
  }

  .el-form-item__content {
    display: block;
    .el-input__inner {
      width: 400px;
    }
    .el-select {
      width: 100%;
      .el-input__inner {
        width: 100%;
      }
    }
    .el-form-item__error {
      top: -75%;
      left: 285px;
    }
  }
}
</style>


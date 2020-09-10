<template>
  <el-container class="public-box" id="log">
    <!-- 这里是头部-->
    <!-- 有标题和按钮的用这种 -->
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">新增分包</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="ttk">保存</el-button>
          <el-button>取消</el-button>
        </el-row>
      </el-row>
    </el-header>
    <!-- 这里是弹框 -->    
      <el-dialog
        title="账号激活成功"
        :visible.sync="diaVisible"
        width="28%"
        :before-close="handleClose"
      >
        <i class="el-icon-success" style="font-size:20px;color:rgba(82,196,26,1);position:absolute;left:40px;top:54px"></i>
        <span style="margin-left:15%">项目账号：</span>{{ruleForm.add}} 
        <br>   
        <span style="margin-left:15%">项目密码：</span>{{ruleForm.add}}      
        <span slot="footer" class="dialog-footer">
          <el-button @click="diaVisible = false">取 消</el-button>
          <el-button type="primary" @click="diaVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline all-form"
          label-position="top"
        >
          <el-form-item label="公司名称：">
            <el-input v-model="formInline.user" placeholder="杭州爱忒麦网络科技有限公司"></el-input>
          </el-form-item>
          <el-form-item label="信用代码：" class="hehe">
            <el-input v-model="formInline.region" placeholder="请输入信用代码"></el-input>
          </el-form-item>
          <el-form-item label="企业类型：">
            <el-select v-model="formInline.region" placeholder="请输入公司名称">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业类型：">
            <el-select v-model="formInline.region" placeholder="请输入公司名称">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业类型：">
            <el-select v-model="formInline.region" placeholder="请输入公司名称">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="法人代表：">
            <el-input v-model="formInline.user" placeholder="请输入法人代表"></el-input>
          </el-form-item>
          <el-form-item label="注册资金（万元）：">
            <el-input v-model="formInline.user" placeholder="请输入注册资金"></el-input>
          </el-form-item>
          <el-form-item label="负责人员">
            <el-input v-model="formInline.user" placeholder="农业银行"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="textarea" placeholder="请输入负责人员"></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <div class="cont">
            <el-form-item label="分包内容：" class="hehe">
              <el-input type="textarea" v-model="formInline.user" placeholder="请输入分包内容"></el-input>
            </el-form-item>
          </div>
          <div class="one">
            <el-form-item label="分包合同附件：">
              <el-button style="width:106px;height:32px">
                <i class="el-icon-upload2"></i>上传文件
              </el-button>
              <span style="margin-left:20px;color:#000000;font-size:14px">只能上传pdf格式文件，且不超过10MB</span>
            </el-form-item>
          </div>
          <div class="one two">
            <el-form-item label="营业执照附件：">
              <el-button style="width:106px;height:32px">
                <i class="el-icon-upload2"></i>上传文件
              </el-button>
              <span style="margin-left:20px;color:#000000;font-size:14px">支持扩展名：jpg/png/pdf，且不超过10MB</span>
            </el-form-item>
          </div>
          <div></div>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      diaVisible:false,
      ruleForm: {
          name: '',
          state:'',
          add:'2',
          add2:''
      },
      value1: "",
      formInline: {
        user: "",
        region: "",
        textarea: ""
      }
    };
  },
  methods: {
    ttk(){
      this.diaVisible=true
    }
  }
};
</script>
<style scoped lang="scss">
@import '~@/styles/public.scss';
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
  #log .el-dialog__header{border:0;margin-left: 40px;padding: 50px 30px 10px;}
  #log .el-dialog__body{padding:0 20px 30px 20px;}
</style>

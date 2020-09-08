<template>
    <el-container class="public-box">
        <el-header height="54px" class="public-header header-title-button">
            <el-row type="flex" align='center' justify='space-between'>
                <div class="public-header-title">修改密码</div>
                <el-row type="flex" align='center' style="height:100%">
                    <el-button type="primary" @click="ok('formLabelAlign')">确定</el-button>
                    <el-button @click="no">取消</el-button>
                </el-row>
            </el-row>
        </el-header>

        <el-main class="public-main">
            <div class="public-main-content radius public-padding" style="height:394px;">
                <div class="change-box" style="margin-top:-7px;">
                    <el-form :label-position="labelPosition" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
                        <el-form-item label="原密码：" prop="name" :error="errorMsg">
                            <el-input v-model="formLabelAlign.name" type="password" placeholder="请输入原密码"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码：" prop="region">
                            <el-input v-model="formLabelAlign.region" type="password" placeholder="请输入新密码"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码：" prop="type">
                            <el-input v-model="formLabelAlign.type" type="password" placeholder="请重新输入新密码"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.formLabelAlign.type !== '') {
                this.$refs.formLabelAlign.validateField('againpassword');
              }
              callback();
            }
          };
          var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.formLabelAlign.region) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          };
      return{
        errorMsg:null,
        labelPosition: 'top',
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        rules:{
            name:[{required: true, message: '请输入原密码', trigger: 'blur' }],
            region:[{ validator: validatePass, trigger: 'blur', required: true}],
            type:[{ validator: validatePass2, trigger: 'blur', required: true}]
        }
      }
    },
    methods:{
        //确定
        ok(formLabelAlign){
            //密码验证
            this.$refs[formLabelAlign].validate((valid) => {
                if (valid) {
                    axios({
                        url: `${this.tong}/projectAccount/updatePassword`,
                        method:'post',
                        params:{
                            username:sessionStorage.getItem('username'),
                            password:this.formLabelAlign.name,
                            newPassword:this.formLabelAlign.type
                        }
                    }).then(res=>{
                        if(res.data.code == 1){
                            this.$router.push({path:'/'})
                        }else if(res.data.code == 1002){
                            this.$nextTick(()=>{
                                this.errorMsg = '原密码错误'
                            });
                        }else{
                            this.$message.error('修改失败')
                        }
                        this.formLabelAlign = this.$options.data().formLabelAlign
                    })
                } else {
                    return false;
                }
            });
        },
        // 取消
        no(){
            this.formLabelAlign = this.$options.data().formLabelAlign
            this.$refs['formLabelAlign'].clearValidate();
        }
    }
    
}
</script>


<style scoped lang="scss">
@import '~@/styles/public.scss';
.change-box{
    width: 515px;
    height: 100%;
    margin: 0 auto;
    span{
        color:rgba(62,62,62,1);
    }
    
}
</style>

<style  lang="scss">
.change-box .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    margin-right: -10px;
    margin-top: 9px;
}
</style>
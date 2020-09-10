<template>
    <div id="resetpassword">
        <div class="hearder-first"></div>
        <div class="hearder-tow">
            <div class="hearder-top">密码重置</div>

            <div class="form-div" v-if="passshow">
                <el-form :label-position="labelPosition" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
                    <el-form-item label="请输入新密码：" prop="newpass" >
                        <el-input v-model="formLabelAlign.newpass" type="password" placeholder="请设置您的登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="请再次确认新密码：" prop="againpassword">
                        <el-input v-model="formLabelAlign.againpassword" type="password" placeholder="请确认您的登录密码"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="submit('formLabelAlign')" class="form-bottom">提交</el-button>
            </div>

            <div class="form-succeed" v-if="succeed">
                <p>
                    &nbsp;&nbsp;
                    <i class="el-icon-success" style="color:#52C41A"></i>
                    <span>&nbsp;重置密码成功，请妥善保管您的账号密码!</span>
                </p>
                <el-button type="primary" @click="submit1" class="form-bottom">返回登录页</el-button>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.formLabelAlign.againpassword !== '') {
                this.$refs.formLabelAlign.validateField('againpassword');
              }
              callback();
            }
          };
          var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.formLabelAlign.newpass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          };
        return{
            passshow:true,
            succeed:false,
            labelPosition: 'top',
            formLabelAlign:{
                newpass:'',
                againpassword:''
            },
            rules:{
                newpass: [
                    { validator: validatePass, trigger: 'blur', required: true}
                ],
                againpassword: [
                    { validator: validatePass2, trigger: 'blur', required: true}
                ]
            }
        }
    },
    methods:{
        submit(formLabelAlign){
            this.$refs[formLabelAlign].validate((valid) => {
                if (valid) {
                    axios({
                        url: `${this.tong}/projectAccount/setPassword`,
                        method:'post',
                        params:{
                            username:sessionStorage.getItem("username"),
                            password:this.formLabelAlign.againpassword
                        }
                    }).then(res=>{
                        if(res.data.code == 1){
                            this.passshow = false
                            this.succeed = true
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        submit1(){
            this.$router.push({path:'/'})
        }
    }
}
</script>

<style lang='scss' scoped>
#resetpassword{
    height: 100%;
    width: 100%;
    .form-bottom{
        width:434px;
        height:50px;
        margin-top:100px;
    }
    .hearder-first{
        height: 66px;
        background:rgba(255,255,255,1);
        box-shadow:0px 1px 4px 0px rgba(0,21,41,0.12);
    }
    .hearder-tow{
        width:1200px;
        height:690px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        margin: 40px auto;
        .hearder-top{
            height: 90px;
            width: 100%;
            line-height: 90px;
            text-align: center;
            font-size:30px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(60,98,208,1);
            border-radius:10px 10px 0px 0px;
            border-bottom:1px solid #ccc; 
        }
        .form-div{
            width: 434px;
            height: 300px;
            margin: 60px auto;
        }
        .form-succeed{
            width: 434px;
            height: 300px;
            margin: 240px auto;
            font-size:20px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(102,102,102,1);
        }
    }
}
</style>

<style  lang="scss">
#resetpassword .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    margin-right: -10px;
    margin-top: 9px;
}
</style>
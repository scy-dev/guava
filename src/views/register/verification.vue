<template>
    <div id="verification">
        <div class="hearder-first"></div>
        <div class="hearder-tow">
            
            <div class="hearder-top">
                <span>
                    <router-link to="/login" tag="a" class="header-link">返回登录页</router-link>
                </span>
                <span>安全验证</span>
            </div>

            <div class="verification-main">
                <el-form :label-position="labelPosition" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
                    <el-form-item label="账号" prop="number" >
                        <el-input v-model="formLabelAlign.number" type="text" placeholder="请输入项目账号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile" :error="errorMsg">
                        <el-select v-model="options[0].value" placeholder="请选择" style="width:109px;">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input v-model.number="formLabelAlign.mobile" type="text" placeholder="请输入" style="width:318px;"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code" class="el-form-item-SIdentify el-form-item-message">
                        <el-input v-model="formLabelAlign.code" type="text" placeholder="请输入" style="width:276px;"></el-input>
                            <SIdentify @click="refreshCode" :identifyCode="identifyCode" style="margin-left:5px;" @hehe='hehe'/>
                    </el-form-item>
                    <el-form-item label="短信验证码" prop="message" class="el-form-item-message">
                        <el-input v-model="formLabelAlign.message" type="text" placeholder="请输入项目账号" style="width:276px;"></el-input>
                        <el-button @click="sendMsg" type="primary" :disabled="isDisabled" style="width:150px;">{{buttonName}}</el-button>
                    </el-form-item>
                    <el-button type="primary" @click="next('formLabelAlign')" class="form-buttom">下一步</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import SIdentify from '@/components/identify'
import { Mobile } from '@/plugin/formRules'
export default {
    components:{
     SIdentify
   },
    data(){
        //验证码验证
        const validatePass = (rule,value,callback)=>{
            if(value){
                //如果有值
                const verification = val=> val.replace(/[A-z]/g,$1=>$1.toLowerCase());
                //英文处理成小写
                if(verification(value)===verification(this.identifyCode)){
                    //小写code和小写验证码相等就通过
                    callback()
                }else{
                    callback(new Error('验证码输入不正确'))
                };
            }else{
                callback(new Error('请输入验证码'))
            }
        };
        //短信验证码
        var messages = (rule, value, callback) =>{
            if(this.formLabelAlign.message == ''){
                callback(new Error('请输入验证码'));
            }else if(this.errorYZM !== this.formLabelAlign.message ){
                callback(new Error('请输入正确验证码'));
            }else{
                callback();
            }
        };
        return{
            errorMsg :null,
            labelPosition: 'top',
            formLabelAlign:{
                number:'',
                mobile:'',
                code:'',
                message:'',
            },
            options: [{
                value: '选项1',
                label: '中国+86'
            }],
            value: '',
            rules: {
                number:[
                    { required: true, message: '请输入项目账号', trigger: 'blur' }
                ],
                mobile:[
                    { required: true, validator: Mobile, trigger: 'blur' }
                ],
                code:[
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                message:[
                    { required: true, validator: messages, trigger: 'blur' }
                ],
            },
            //倒计时
            buttonName: "获取验证码短信",
            isDisabled: false,
            time: 60,
            //验证码
            identifyCodes: 'azxcvbnmsdf0123456789ghjklqwertyu123456789iopZXCVB0123456789NMASDFGHJKLQWERTYUIOP0123456789',
            identifyCode:'',
        }
    },
    methods:{
        //短信验证
         sendMsg() {
            const MobileReg = /^1[3456789]\d{9}$/; 
            if(!MobileReg.test(this.formLabelAlign.mobile)){
                this.errorMsg = "请输入正确的手机号码"
                return false
            }; 

            let interval = window.setInterval(()=>{
                this.buttonName = '' + this.time + 's后重发';
                --this.time;
                if(this.time < 0) {
                    this.buttonName = "重新发送";
                    this.time = 60;
                    this.isDisabled = false;
                    window.clearInterval(interval);
                }
            }, 1000);
            this.identifying()
        },
        //验证码接口
        identifying(){
            axios({
                url: `${this.tong}/projectAccount/sendauthcode`,
                method:'post',
                params:{number:this.formLabelAlign.mobile}
            }).then(res=>{
                if(res.data.code == 1 ){
                    this.errorYZM = res.data.data
                }
            })
        },
        // 生成一个随机数
        randomNum (min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCode () {
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        },
        makeCode (o, l) {
            let str = ''
            for (let i = 0; i < l; i++) {
            str += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
            this.identifyCode = str;
            }
        },
        //下一步
        next(formLabelAlign){
            this.$refs[formLabelAlign].validate((valid) => {
                if (valid) {
                    axios({
                        url: `${this.tong}/projectAccount/usernameAndNumber`,
                        method:'post',
                        params:{
                            username:this.formLabelAlign.number,
                            phoneNumber:this.formLabelAlign.mobile
                        },
                    }).then(res=>{
                        if(res.data.code == 1){
                            this.$router.push({path:'/resetpassword',query:{username:this.formLabelAlign.number}})
                        }else if(res.data.code == 1001){
                            this.$message.error(res.data.message)
                        }else if(res.data.code == 1019){
                            this.$message.error(res.data.message)
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        hehe(){
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        },
    },
  
    mounted () {
        this.hehe()
    }
}
</script>

<style lang='scss' scoped>
#verification{
    height: 100%;
    width: 100%;
    .hearder-first{
        height: 66px;
        background:rgba(255,255,255,1);
        box-shadow:0px 1px 4px 0px rgba(0,21,41,0.12);
    }
    .hearder-tow{
        width:1200px;
        height:720px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        margin: 40px auto;
        .hearder-top{
            height: 90px;
            width: 100%;
            line-height: 90px;
            border-radius:10px 10px 0px 0px;
            border-bottom:1px solid #ccc; 
            text-align: center;
            position: relative;
            .header-link{
                margin-left:40px;
                color:rgba(60,98,208,1);
                text-decoration:underline;
            }
            span:nth-child(1){
                margin-left: 20px;
                position: absolute;
                left: 0;
                top: 0;
            }
            span:nth-child(2){
                text-align: center;
                font-size:30px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(60,98,208,1);
            }
        }
        .verification-main{
            width: 434px;
            height: 100%;
            margin: 20px auto;
            .form-buttom{
                width:434px;
                margin-top:34px;
            }
        }
    }
}
</style>

<style lang='scss'>
#verification{
    .s-canvas{
        display: inline-block;
    }
    .el-form-item-SIdentify{
        .el-form-item__error{
            top: -49%;
        }
        .el-form-item__content{
            display: flex;  
        }
    }
    .el-form-item-message{
        .el-form-item__error{
            right: 159px;
        }
    }
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    margin-right: -10px;
    margin-top: 9px;
}
}
</style>

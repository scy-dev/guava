<template>
    <div id="registerproject">
        <div class="hearder-first"></div>
        <div class="hearder-tow">
            <div class="hearder-top">
                <span>
                    <router-link to="/" tag="a" class="header-link">返回登录页</router-link>
                </span>
                <span>项目注册</span>
            </div>


            <div class="registerproject-main" v-if="register">
                <el-form :label-position="labelPosition" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
                    <el-form-item label="公司名称：" prop="companyName" >
                        <el-input v-model="formLabelAlign.companyName" type="text" placeholder="请输入公司名称"></el-input>
                    </el-form-item>
                    <el-form-item label="项目名称：" prop="projectName" >
                        <el-input v-model="formLabelAlign.projectName" type="text" placeholder="请输入项目名称"></el-input>
                    </el-form-item>
                     <el-form-item label="项目状态：" prop="projectStatus" >
                        <el-select v-model="formLabelAlign.projectStatus" placeholder="请选择" style="width:434px;">
                            <el-option v-for="item in options" :key="item.code" :label="item.status" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="form-div"></div>
                    <el-form-item label="项目地区：" prop="projectArea">
                      <el-select v-model="formLabelAlign.area1" placeholder="请选择省份" @change="changeProvince($event);changeCity(formLabelAlign.area2)" style="width:142px;">
                            <el-option
                                v-for="item in area1"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>

                        <el-select v-model="formLabelAlign.area2" placeholder="请选择城市" @change="changeCity" style="width:141px;">
                            <el-option
                                v-for="item in area2"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>

                        <el-select v-model="formLabelAlign.projectArea" placeholder="请选择区县"  style="width:142px;">
                            <el-option
                                v-for="item in area3"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="项目地址：" prop="projectAddress" >
                        <el-input v-model="formLabelAlign.projectAddress" type="text" placeholder="请输入项目地址"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人员：" prop="projectFunctionary" >
                        <el-input v-model="formLabelAlign.projectFunctionary" type="text" placeholder="请输入负责人员"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="phoneNumber" :error="errorMsg">
                        <el-input v-model.number="formLabelAlign.phoneNumber" type="text" placeholder="请输入项目地址" ></el-input>
                    </el-form-item>
                    <el-form-item label="短信验证：" prop="messages" class="messages-error">
                        <el-input v-model.number="formLabelAlign.messages" type="text" placeholder="请输入手机验证码" style="width:276px;"></el-input>
                        <el-button @click="sendMsg" type="primary" :disabled="isDisabled" style="width:150px;">{{buttonName}}</el-button>
                    </el-form-item>
                    <el-button type="primary" @click="submit('formLabelAlign')" class="form-button">注册</el-button>
                </el-form>
            </div> 

            <div class="form-succeed" v-if="succeeds">
                <p style="text-align:center;">
                    <i class="el-icon-success" style="color:#52C41A;"></i>
                    <span>&nbsp;提交成功，账号审核中!</span>
                    <div>如有需要请联系工作人员电话：14223412321</div>
                </p>
                <el-button type="primary" @click="submit1" class="submit-button">返回登录页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Mobile } from '@/plugin/formRules'
import {district} from "@/views/AttendanceManagement/mixins";
export default {
    mixins:[district],
    data(){
        var area = (rule, value, callback) =>{
            if(this.formLabelAlign.area1 == '' || this.formLabelAlign.area2 == '' || this.formLabelAlign.area3 == ''){
                callback(new Error('请输选择项目所在地区'));
            }else{
                callback()
            }
        };
        var messages = (rule, value, callback) =>{
            if(this.formLabelAlign.messages == ''){
                callback(new Error('请输入验证码'));
            }else if(Number(this.msgYZM) !== Number(this.formLabelAlign.messages)){
                callback(new Error('请输入正确的验证码'));
            }else{
                callback();
            }
        }
        return{
            msgYZM:null,
            errorMsg :null, //手机验证码
            register:true,
            succeeds:false,
            labelPosition: 'top',
            formLabelAlign:{
                companyName:'',
                projectName:'',
                projectStatus:'',
                projectAddress:'',
                projectFunctionary:'',
                phoneNumber:'',
                messages:'',
                projectArea:'',
                area1:'',
                area2:''
            },
            rules:{
                companyName:  [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
                projectName:  [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
                projectStatus:  [{ required: true, message: '请输入项目名称', trigger: 'change' }],
                projectAddress:  [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
                projectFunctionary: [{ required: true, message: '请输入项目项目人员', trigger: 'blur' }],
                phoneNumber:  [{ validator: Mobile,required: true, trigger: 'blur' }],
                messages:  [{ required: true, validator: messages, trigger: 'blur' }],
                projectArea:  [{ validator: area, trigger: 'blur',required: true, }],
            },
            options: [],
            value: '',
            area1: [],
            area2: [],
            area3: [],
            //倒计时
            buttonName: "获取验证码短信",
            isDisabled: false,
            time: 60
        }
    },
    methods:{
        //验证
        submit(formLabelAlign){
            this.$refs[formLabelAlign].validate((valid) => {
                if (valid) {
                    this.login()
                } else {
                    return false;
                }
            });
        },
        //注册接口
        login(){
            let obj = Object.assign({},this.formLabelAlign)
            delete obj.messages;
            delete obj.area1;
            delete obj.area2;
            axios({
                method:'post',
                url: `${this.tong}/projectAccount/regist`,
                params:obj
            }).then(res=>{
                if(res.data.code == 1){
                    this.register = false
                    this.succeeds = true
                }
            })
        },
        //返回登录页面
        submit1(){
            this.$router.push({path:'/'})
        },
        //验证码
        sendMsg() {
            const MobileReg = /^1[3456789]\d{9}$/; 
            if(!MobileReg.test(this.formLabelAlign.phoneNumber)){
                this.errorMsg = "请输入正确的手机号码"
                return false
            }; 
            this.isDisabled = true;
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
                params:{number:this.formLabelAlign.phoneNumber}
            }).then(res=>{
                if(res.data.code == 1 ){
                    this.msgYZM = res.data.data
                }
            })
        },
        //项目状态
        getProjectStatus(){
            axios.get(`${this.tong}/projectAccount/getProjectStatus`)
                 .then(res=>{
                    if(res.data.code == 1){
                        this.options = res.data.data
                    }
                 })
        },
        // district(val){
        //     //   this.areaarr1 = this.formLabelAlign.area1
        //     let special=['北京市','天津市','上海市','重庆市'];

        //     function fn(val) {return JSON.parse(JSON.stringify(val));}//深拷贝
        //     function difference(a,b){return a.concat(b).filter(v => !a.includes(v) || !b.includes(v))}//取过滤后的值和data的差集
        //     axios({
        //         url: `${this.tong}/projectAccount/getArea`,
        //         method:'get'
        //     }).then(res=>{
        //         var data=res.data.data;
        //         let province = data.filter(e=>e.pid==0);//过滤出省
        //         data = difference(province,data);//用过的从data中清除
        //         province.forEach(e=>{//省循环
        //         if(special.indexOf(e.name)==-1){
        //             let city = data.filter(el=>e.id==el.pid);//过滤出城市
        //             e.city = fn(city);//深拷贝
        //             data = difference(city,data);//用过的从data中清除
        //         }else{//如果是特殊城市 省和市是一个
        //             e.city = fn([e]);
        //         };
        //             e.city.forEach(element=>{//市循环
        //             let area = data.filter(el=>element.id==el.pid);//市辖区的判断
        //             let newarea = fn(area);//深拷贝
        //             newarea.forEach(es=>{
        //                 let copy = data.filter(el=>es.id==el.pid);
        //                 area.push(...copy);//和市同级
        //                 difference(copy,data)//用过的从data中清除
        //             });
        //             data = difference(area,data);//用过的从data中清除
        //             element.area = fn(area)//深拷贝
        //             })
        //         });
        //         this.area1 = province;
        //         console.log(province)
        //     })
        // },
        changeProvince(val){
            this.area1.forEach(e=>{
                if(e.name===val){
                    this.area2 = e.city;
                    this.formLabelAlign.area2 = this.area2[0].name;
                }
            })
        },
        changeCity(val){;
            this.area2.forEach((e,i)=>{
                if(e.name=='市辖区'){
                    
                }
                if(e.name===val){
                    this.area3 = e.area;
                    this.area3.forEach((e,i)=>{
                if(e.name=='市辖区'){
                    this.area3.splice(i,1)
                }
            })
                    this.formLabelAlign.projectArea = this.area3[0].id;
                }
            })
        },
    },
    mounted(){
        this.district()
        this.getProjectStatus()
    }
}
</script>

<style lang='scss' scoped>
#registerproject{
    height: 100%;
    width: 100%;
    overflow: auto;
    .header-link{
        margin-left:40px;
        color:rgba(60,98,208,1);
        text-decoration:underline;
    }
    .hearder-first{
        height: 66px;
        background:rgba(255,255,255,1);
        box-shadow:0px 1px 4px 0px rgba(0,21,41,0.12);
    }
    .hearder-tow{
        width:1200px;
        // height:1056px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        margin: 40px auto;
        box-sizing:border-box;
        .hearder-top{
            height: 90px;
            width: 100%;
            line-height: 90px;
            border-radius:10px 10px 0px 0px;
            border-bottom:1px solid #ccc; 
            text-align: center;
            position: relative;
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
         .registerproject-main{
            width: 434px;
            height: 100%;
            margin: 20px auto;
            margin-bottom: 0px;
            box-sizing:border-box;
            .form-div{
                width:434px;
                height:1px;
                background:rgba(0,0,0,0.09);
                margin-top:32px;
                margin-bottom:20px;
            }
            .form-button{
                width:434px;
                margin-top:34px;
                margin-bottom:80px;
            }
        }
        .form-succeed{
            width: 434px;
            height: 300px;
            margin: 240px auto;
            font-size:20px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(102,102,102,1);
            .submit-button{
                width:434px;
                height:50px;
                margin-top:100px;
            }
            div{
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(102,102,102,1);
                padding-top: 40px;
                text-align:center;

            }
        }
    }
}
</style>

<style  lang="scss">
#registerproject .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
    margin-right: -10px;
    margin-top: 9px;
}
#registerproject .messages-error .el-form-item__error {
    right: 157px;
}
</style>

<template>
    <el-container class="public-box" id="xiangmu">
        <!-- 有标题和按钮的用这种 -->
        <el-header height="54px" class="public-header header-title-button">
            <el-row type="flex" align="center" justify="space-between">
                <div class="public-header-title">项目信息</div>
                <el-row type="flex" align="center" style="height:100%">
                <el-button @click="tk" type="primary">编辑项目信息</el-button>
                
                <el-button style="margin-left:20px" @click="tb">同步管理平台</el-button>
               
                </el-row>
            </el-row>
        </el-header>
        <!-- 这里是主体内容容器-->
        <el-main class="public-main">
        <div class="public-main-content radius public-padding">
            <div class="biao"><!-- 取值 -->
                <div><span>项目名称：</span>{{obj.projectName}}</div>
                <div><span>所属企业：</span>{{obj.corpname}}</div>                
                <el-button type="primary" style="float:right" @click="handleEdit"><!-- <router-link to="/information/bjcompany" style="color:#fff"></router-link> -->编辑企业信息</el-button>
                <div><span>项目状态：</span>
                    {{obj.status=='001'?'筹备':''}}
                    {{obj.status=='002'?'立项':''}}
                    {{obj.status=='003'?'再建':''}}
                    {{obj.status=='004'?'完工':''}}
                    {{obj.status=='005'?'停工':''}}
                </div>
                <div><span>同步监管平台：</span>{{obj.isSynchronous==1?'已开通':'未开通'}}</div>
                <div><span>项目地区：</span>{{obj.prefecture}}</div>
                <div><span>项目地址：</span>{{obj.address}}</div>
            </div>            
        </div>
        </el-main>
         <!-- 弹框 -->
                <el-dialog
                class="bj tb"
                title="同步管理平台"
                :visible.sync="diaVisible"
                width="28%"
                :before-close="handleClose">
                    <el-form :model="tbform" :rules="rules" ref="tbform" class="demo-ruleForm">
                        <el-form-item label="账号：" prop="account">
                            <el-input v-model="tbform.account" placeholder="请输入账号"></el-input>
                        </el-form-item>
                        <el-form-item label="密钥：" prop="secretkey">
                            <el-input v-model="tbform.secretkey" placeholder="请输入密钥"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <i class="el-icon-info" style="font-size:14px;color:rgba(60,98,208,1);position:absolute;left:18px;bottom:32px"></i><span style="color:#000000;font-size:14px">请向项目所在地住建部门申请项目账号和密钥。</span>
                        <el-button @click="qxgl">取 消</el-button>
                        <el-button type="primary" @click="qdgl('tbform')">确 定</el-button>
                    </span>
                </el-dialog>
        <!-- 弹框 -->
                <el-dialog
                title="编辑项目信息"
                :visible.sync="dialogVisible"
                width="28%"
                :close="closed">
                <!-- <span>这是一段信息</span> -->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                        <el-form-item label="项目名称：" prop="projectName" class="bj">
                            <el-input v-model="ruleForm.projectName" placeholder="请输入公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label="项目状态：" prop="status" class="zhuagt">
                            <el-select v-model="ruleForm.status" placeholder="请选择项目状态">
                                <el-option
                                v-for="item in state"
                                :key="item.code"
                                :label="item.msg"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目地区：" class="address">
                            <el-input v-model="ruleForm.province" placeholder="请选择省份" style="width:160.5px;" readonly>
                            </el-input>
                            <el-input v-model="ruleForm.city" placeholder="请选择城市" style="width:160.5px;" readonly>
                            </el-input>
                            <el-input v-model="ruleForm.area" placeholder="请选择区县" style="width:160.5px;" readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="项目地址：" prop="address" class="bj">
                            <el-input v-model="ruleForm.address" placeholder="请输入项目地址"></el-input>
                        </el-form-item>
                    </el-form>                    
                    <span slot="footer" class="dialog-footer">                        
                        <el-button @click="quxiao">取 消</el-button>
                        <el-button type="primary" @click="queding('ruleForm')">确 定</el-button>
                    </span>
                </el-dialog>
    </el-container>
</template>
<script>
import {store} from '@/plugin/observable'
    export default {
        data() {
            return {
                obj:{
                    projectName:'',
                    corpname:'',
                    status:'',
                    isSynchronous:'',
                    prefecture:'',                    
                    address:''
                },
                xmId:store.projectId,//项目ID                
                ruleForm: {//编辑项目
                    projectName: '',
                    status:'',
                    prefecture:'',
                    province: '',
                    city: '',
                    area: '',
                    address:''
                },
                //value:'',
                state:[],                
                tbform: {//同步
                    account: '',
                    secretkey:'',
                    projectId:store.projectId
                },
                dialogVisible: false,
                diaVisible:false,
                rules: {//项目编辑验证
                    projectName: [
                        { required: true, message: '请输入更改的项目名称', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择项目状态', trigger: 'blur' }
                    ],
                    address: [
                        {  required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    //同步管理验证
                    account:[
                        {  required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    secretkey:[
                        {  required: true, message: '请输入密钥', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            //请求列表
            geter() {
                axios({
                    url: "/Projectmanager/project/projectInfo",
                    method: "post",
                    transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
                    data:{
                        projectId:this.xmId
                    }
                }).then(res => {
                   Object.assign(this.obj,res.data.data)                   
                   //console.log(res.data.data);
                });
            },
            //编辑项目按钮
            tk(){
                this.dialogVisible=true
                Object.assign(this.ruleForm,this.obj)
                this.states()  
            },
            //编辑项目状态请求
            states(){
                axios({
                    url: "/Projectmanager/project/projectStatusList",
                    method: "get",
                    transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
                }).then(res => { 
                    this.state =  res.data.data                                 
                   //console.log(res.data.data);
                });
            },
            //编辑项目保存请求
            getTeam(){
                axios({
                    url: "/Projectmanager/project/editProject",
                    method: "post",
                    transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
                    data:{
                        projectId:this.xmId,//先写死，到时候从session拿
                        projectName:this.ruleForm.projectName,
                        projectStatus:this.ruleForm.status,
                        projectAddress:this.ruleForm.address
                    }
                }).then(res => {   
                    this.geter()                               
                   //console.log(res);
                });
            },
            tb(){
                this.diaVisible=true
            },
            //管理平台编辑X取消
            handleClose(){
                this.$refs.tbform.resetFields();
                this.diaVisible=false
            },
            //管理平台编辑取消
            qxgl(){
                this.$refs.tbform.resetFields();
                this.diaVisible=false
            },
            //管理平台编辑确定
            qdgl(tbform){
                this.$refs[tbform].validate((valid) => {
                    if (valid) {
                        this.diaVisible=false
                        this.tongbu()                                                
                    } else {
                        return false;
                    }
                });
            },
            //同步管理接口
            tongbu(){
                axios({
                    url: "/Projectmanager/project/synchronizationPlatform",
                    method: "post",
                    transformRequest:this.transformRequest,//axios请求需求，main.js中改变了
                    data:this.tbform
                }).then(res => {                                
                    this.$refs.tbform.resetFields();
                    if(res.data.code==-1){
                        this.$message.error(res.data.message)
                    }else{
                        this.$message.error('同步管理成功！')
                    }
                });
            },
            //编辑弹框关闭
            quxiao(){
               this.$refs.ruleForm.resetFields();
               this.dialogVisible=false               
            },           
            //验证
            queding(ruleForm) {                
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.dialogVisible=false
                        this.getTeam()                        
                    } else {
                        return false;
                    }
                });
            },  
            //编辑企业
            handleEdit() {
                this.$router.push({ 
                    path: "/information/bjcompany",
                    query: {
                        projectId: this.xmId,//项目ID
                        corpname: this.obj.corpname,//企业ID
                    }
                });
            },          
        },
        mounted(){
            this.geter()
        },
        created(){
            /* this.xmId=store.projectId
            console.log(this.xmId) */
        }
    }

</script>
<style lang="scss" scoped>
@import '~@/styles/public.scss';
.biao{
    div{
        width:500px;display:inline-block;
        span{color:#3E3E3E;display:inline-block;margin-bottom:40px;font-size:14px}
    }
    p{width:1504px;height:1px;background-color:#E8E8E8;margin-bottom:40px}
}

</style>
<style lang="scss">
   #xiangmu .bj .el-form-item .el-form-item__content .el-input--suffix  .el-input__inner{width:492.83px}
   #xiangmu .zhuagt .el-input--suffix .el-input__inner{width:492.83px}
   #xiangmu .bj .el-dialog__footer{border-top: 1px solid #e8e8e8;}
   #xiangmu .address .el-input__inner {text-align: center;background-color: #D9D9D9;}
   #xiangmu .tb .el-dialog__footer{text-align: center;}
   #xiangmu .tb .el-dialog__header .el-dialog__title{margin-left: -20px;}
</style>

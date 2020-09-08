<template>
  <div id="login">
    <div class="auto">
    <el-row type="flex" justify="space-between">
      <el-col class="title">
        <h1>智慧工地监管平台</h1>
        <p>
          SITE REAL NAME REGISTRATION
          <br>MANAGENT PLATFORM
        </p>
      </el-col>
      <el-col class="login-form radius">
        <h4>登录入口</h4>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="账号" prop="username" >
            <el-input v-model="loginForm.username" style="font-size:16px"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :error="errorMsg">
            <el-input type="password" v-model="loginForm.password" autocomplete="new-password" style="font-size:16px" @keyup.enter.native="Login('loginForm')"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="space-between" align="center">
          <div class="point" @click="flag = !flag">
            <div :class="flag? 'active':''">
              <i v-show="flag"></i>
            </div>
            <div>记住密码</div>
          </div>
          <div class="forget" @click="$router.push({path:'verification'})">忘记密码？</div>
        </el-row>
        <el-button type="primary" @click="Login('loginForm')">登录</el-button>
        <div class="bottom">
          还未使用过？
          <router-link to='registerproject' tag="span" style="color:#3C62D0; cursor: pointer;">注册</router-link>
        </div>
      </el-col>
    </el-row>
   </div> 
  </div>
</template>

<script>
import { Base64 } from "@/plugin/base64";
import {mutations} from "@/plugin/observable";
import { throttle } from "@/plugin/throttle";
export default {
  data() {
    const checkUserName = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        return callback(new Error("请输入用户名"));
      }
    };
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        let reg = /^[A-z0-9]{6,18}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入6-18位的合法数字"));
        }
      }
    };
    return {
      flag: false,
      active: true,
      errorMsg:null,
      menuList:[],
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, validator: checkUserName, trigger: "change" }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mutations,
    // setCount: mutations.setCount,//存入菜单列表
    // setToken: mutations.setToken,//存入token
    // setProjectId:mutations.setProjectId,//存入projectId
    //设置COOKIES
    SetCookie(name, value, day) {
      var date = new Date();
      date.setDate(date.getDate() + day);
      document.cookie =
        name + "=" + value + ";expires=" + date;
      // this.getCookie("construction");
    },
    //获取焦点事件
    focus(val) {
      if (!this.hintFlag) {
        this.hintFlag = true;
      }
    },
    //获取COOKIES
    getCookie(name) {
      var reg = RegExp("construction" + "=([^;]+)");
      var arr = document.cookie.match(reg);
      if (arr) {
        return JSON.parse(Base64.decode(arr[1]));
      } else {
        return "";
      }
    },
    //删除COOKIES的函数
    delCookie(name) {
      this.SetCookie(name, null, -1);
    },
    //登录
    Login: throttle(function (name) {
      this.$router.push('/workerlist');
      //    this.$refs[name].validate(valid => {
      //   if (valid) {
      //     axios({
      //       url: `${this.tong}/projectAccount/login`,
      //       method: "post",
      //       params: this.loginForm
      //     }).then(res => {
      //         if(res.data.code == 1){
      //          let obj = res.data.data;
      //         //  console.log(obj.role.models);
      //           for(let i in obj){
      //             sessionStorage.setItem(i,typeof obj[i]=='object'?JSON.stringify(obj[i]):obj[i])
      //           };
      //           this.setCount(sessionStorage.getItem('role')?JSON.stringify(JSON.parse(sessionStorage.role).models):[]);
      //           this.setId(obj);
      //           if(this.flag){
      //             this.SetCookie('construction',Base64.encode(JSON.stringify(this.loginForm)),7)
      //           }else{
      //              this.delCookie("construction");
      //           };
      //           this.$router.replace({name:obj.role.models[0].permissions[0].name})
      //         }else{
      //           this.errorMsg = null;
      //           this.$nextTick(()=>{
      //             this.errorMsg = '用户名或密码错误'
      //           });
      //         };
      //     });
      //   }
      // });

     },1000,1000)
  },
  mounted() {
     //判断cookie是否有账号密码
      let loginInformation = this.getCookie("construction");
    if (loginInformation) {
      this.flag = true;
      Object.assign(this.loginForm, loginInformation);
    } else {
      this.flag = false;
    };
    this.active = false;
    this.$nextTick(() => {
      this.active = true;
    });
  },
  
directives: {
  focus: {
    // 指令的定义
    inserted(el) {
       el.firstElementChild.focus();
    }
  }
},
};
</script>

<style lang="scss" scoped>
.el-button{
  background: #3b65d1;
}
#login {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  .auto{
    max-width: 1406px;
    margin: 7% auto 0;
  }
  // padding: 147px 240px 0 274px;
  background: url("./../assets/images/loginBackground.jpg") no-repeat;
  background-size: cover;
  .title {
    color: #3c62d0;
    max-width: 620px;
    h1 {
      font-size: 50px;
      font-weight: 600;
      letter-spacing: 8px;
      height: 70px;
      line-height: 70px;
    }
    p {
      font-size: 24px;
      font-weight: 100;
      letter-spacing: 4px;
      margin-top: 5px;
      color: #3b65d1;
    }
  }
  .login-form {
    background: white;
    max-width: 514px;
    display: inline-block;
    box-sizing: border-box;
    padding: 40px 40px 0 40px;
    overflow: hidden;
    .forget{
      cursor: pointer;
      color:#666660;font-size:16px;text-decoration:underline;
      &:hover{
        color: #3c62d0;
      }
    }
    h4 {
      color: #3c62d0;
      font-size: 30px;
      height: 62px;
      line-height: 62px;
      margin-bottom: 47px;
    }
    .point {
      cursor: pointer;
      display: flex;
      align-items: center;
      line-height: 16px;
      div {
        display: inline-block;
        font-size: 16px;
      }
      div:nth-of-type(1) {
        margin-right: 5px;
        width: 16px;
        height: 16px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          width: 8px;
          height: 8px;
          display: block;
          border-radius: 50%;
        }
      }
      .active {
        border: 1px solid #3c62d0 !important;
        i {
          background: #3c62d0;
        }
      }
    }
    .el-button {
      width: 100%;
      margin-top: 61px;
      height: 50px;
      font-size: 20px;
      margin-bottom: 70px;
    }
    .bottom {
      text-align: center;
      height: 90px;
      line-height: 90px;
      background: #eef1fb;
      margin: 0 -40px;
      font-size: 16px;
    }
  }
}
</style>
<style lang='scss'>
#login {
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "";
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-form-item__label {
    font-size: 18px;
    color: #333;
  }
  .el-form-item__error{
    top: -80%;
  }
  .el-input__inner {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
}
@media screen and (max-width: 1400px) {
  #login {
      zoom: 0.9;
  }
}
</style>

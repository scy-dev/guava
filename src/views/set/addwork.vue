<template>
  <el-container class="public-box" id="addwork">
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">{{$route.name}}</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="sure">确定</el-button>
          <el-button @click="unsure">取消</el-button>
        </el-row>
      </el-row>
    </el-header>

    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="role-content">
          <span>角色名称：</span>
          <el-input v-model="name" style="width:280px;" placeholder="请输入角色名称"></el-input>

          <!-- 选项框 -->
          <div class="public-main-main">
            <el-tabs type="card">
              <el-checkbox class="all-checked" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-tab-pane v-for="(item,index) in jurisdiction" :key="index">
                <!-- 单选框 -->
                <span slot="label">
                  <el-checkbox
                    :value="item.checked"
                    :key="key"
                    :checked="item.checked"
                    @change="tabCheckChange($event,index)"
                  ></el-checkbox>
                  <span>{{item.name}}</span>
                </span>

                <!-- div-tabs -->
                <div
                  v-for="(value,indexs) in jurisdiction[index].permissions"
                  :key="indexs"
                  class="tabs-div"
                >
                  <el-col :span="5">{{value.name}}</el-col>
                  <el-col :span="1">
                    <el-switch
                      v-model="value.switch"
                      :disabled="jurisdiction[index].disabled"
                      active-color="#287CDF"
                      inactive-color="#C0CCDA"
                    ></el-switch>
                  </el-col>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { throttle } from "@/plugin/throttle";
const cityOptions = [
  "首页",
  "项目管理",
  "工人管理",
  "考勤管理",
  "薪资管理",
  "设置"
];

export default {
  beforeRouteEnter(to, from, next){
    to.name==='编辑角色'?to.query.roleId?next():next({path:'/'}):next();
  },
  data() {
    return {
      name: "",
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      jurisdiction: [],
      jurisdictiontow: []
    };
  },
  created() {
    this.getter();
  },
  methods: {
    //获取权限列表
    getter() {
      axios
        .get( `${this.tong}/role/queryAll`, {
          headers: {
            Authorization: "Bearer" + sessionStorage.getItem("accessToken")
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            data.forEach(element => {
              element.checked = false;
              element.disabled = true;
              element.permissions.forEach(e => {
                e.switch = false;
              });
            });
            this.jurisdiction = data;
            if (this.$route.path.includes("editwork")) {
              this.edit();
            }
          }
        });
    },
    tabCheckChange(val, index) {
      if (val === this.jurisdiction[index].checked) {
        val = !val;
      }
      let flag = this.jurisdiction[index].permissions.every(
        e => e.switch === false
      );
      if (flag) {
        this.jurisdiction[index].disabled = !val;
        this.jurisdiction[index].checked = val;
        if (!val) {
          if (this.checkAll) {
            this.checkAll = false;
          }
        }
      } else {
        this.jurisdiction[index].checked = true;
      }
    },
    //单选
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
    },
    //多选
    handleCheckAllChange(value) {
      // let flag  = value?true:false;
      this.checkedCities = value ? cityOptions : [];
      this.jurisdiction.forEach(element => {
        element.checked = value;
        element.disabled = !value;
        element.permissions.forEach(e => {
          e.switch = value;
        });
      });
    },
    //编辑角色
    edit() {
      axios({
        url: `${this.tong}/role/getRoleById`,
        method: "post",
        headers: {
          Authorization: "Bearer" + sessionStorage.getItem("accessToken")
        },
        params: this.$route.query
      }).then(res => {
        if (res.data.code == 1) {
          this.name = res.data.data.roleName;
          let arr = res.data.data.models;
          let newarr = [];
          this.jurisdiction.forEach(b => {
              let f = arr.filter(e=>b.id==e.id);
              if(f.length>0){
                b.checked = true;
                b.disabled = false;
                f[0].permissions.forEach(e=>{
                  let num= b.permissions.findIndex(g=>g.id==e.id);
                  num!==-1?b.permissions[num].switch=true:'';
                });
              };
              newarr.push(...b.permissions);
          });
          this.checkAll =  newarr.every(e=>e.switch);
        }
      });
    },
    //新增编辑方法
    addedit(address,argument){
      //名字不能为空
      if (!this.name) {
        this.$message.error("角色不能为空");
        return;
      }
      //权限的开关
      let arr = [];
      this.jurisdiction.forEach(element => {
        element.permissions.forEach(e => {
          if (e.switch) {
            arr.push(e.id);
          }
        })
      })
      let obj = {
        roleName:this.name,
        permissionIds: arr,
      };
      Object.assign(obj,argument)
      axios({
        url: `${this.tong}`+address,
        method:'post',
        headers: {
          Authorization: "Bearer" + sessionStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        },
        data:JSON.stringify(obj)
      }).then(res => {
          if (res.data.code == 1) {
            this.$message({ message: res.data.data,type: 'success'});
          }else if (res.data.code == 1020) {
            this.$message.error(res.data.message);
          }else {
            this.$message.error("操作失败");
          }
          this.$router.push({ path: "/role" });
      })
    },
    //取消
    unsure(){
      this.$router.push({path:'/role'})
    },
    //新增-编辑确定
    sure:throttle(function(){
      if (this.$route.path.includes("addwork")) {
        let obj = {username: sessionStorage.getItem("username")}
        this.addedit('/role/addRole',obj)
      } else {
        let obj = {roleId:this.$route.query.roleId}
        this.addedit('/role/updateRole',obj)
      }
    },2000,1000)
  }
};
</script>

<style lang='scss' scoped>
@import '~@/styles/public.scss';
.public-main-main {
  margin-top: 40px;
  .el-tabs__item{
    .el-checkbox{
      margin-right: 5px;
    }
  }
}
</style>
<style lang="scss">
#addwork {
  .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border: 0;
    // border-bottom: 1px solid #D9D9D9;
  }
  .el-tabs {
    position: relative;
    .el-tabs__item{
      margin-right: 2px;
      border: 1px solid #D9D9D9;
      border-radius: 4px 4px 0 0;
      background: #FAFAFA;
      &:hover{
         color: #3C62D0;
      }
    }
    .is-active{
      border-bottom: white;
      background: white;
      color: #3C62D0;
    }
  }
  .tabs-div {
    .el-col-5 {
      width: 95.83333%;
    }
  }
  .el-tabs__content {
    position: initial;
    .all-checked {
      position: absolute;
      right: -30px;
      top: 10px;
    }
    .el-tab-pane > div {
      height: 104px;
      width: 100%;
      line-height: 104px;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>


<template>
  <el-container id="menu">
    <el-aside :width="isCollapse?'65px':'257px'" style="overflow:hidden">
      <el-scrollbar
        class="default-scrollbar"
        wrap-class="default-scrollbar__wrap"
        view-class="default-scrollbar__view"
      >
        <div class="aside-header">智慧工地监管平台</div>
        <div id="el-menu">
          <el-menu
            :default-active="menuChange"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            unique-opened
            active-text-color="#3C62D0"
            :collapse-transition="false"
            router
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="iconfont icon-shangban"></i>
                <span>工人管理</span>
              </template>
              <el-menu-item index="/workerlist" name="1-1">工人列表</el-menu-item>
              <el-menu-item index="/workercontract" name="1-2">工人合同</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="iconfont icon-kaoqin" style="font-size:16px"></i>
                <span slot="title">考勤管理</span>
              </template>
              <el-menu-item index="/records">考勤记录</el-menu-item>
              <el-menu-item index="/report">考勤报表</el-menu-item>
              <el-menu-item index="/view">排班视图</el-menu-item>
              <el-menu-item index="/schedule">班次设置</el-menu-item>
              <el-menu-item index="/rule">排班规则</el-menu-item>
              <!-- <el-menu-item index="/device">设备管理</el-menu-item> -->
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="iconfont icon-shebeiweihu" style="font-size:18px"></i>
                <span>设备管理</span>
              </template>
              <el-menu-item index="/device/list">设备信息</el-menu-item>
              <el-menu-item index="/device/location">位置管理</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">项目管理</span>
              </template>
              <el-menu-item index="/information">项目信息</el-menu-item>
              <el-menu-item index="/subcontract">分包管理</el-menu-item>
              <el-menu-item index="/team">班组管理</el-menu-item>
              <el-menu-item>进度管理</el-menu-item>
              <el-menu-item>项目培训</el-menu-item>
            </el-submenu>   
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">车辆管理</span>
              </template>
              <el-menu-item>车辆信息</el-menu-item>
              <el-menu-item>车辆分配</el-menu-item>
              <el-menu-item>车辆轨迹</el-menu-item>
            </el-submenu>   
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">材料管理</span>
              </template>
              <el-menu-item>物联管理</el-menu-item>
              <el-menu-item>工程资料</el-menu-item>
            </el-submenu>  
            <el-submenu index="7">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">环保管理</span>
              </template>
              <el-menu-item>扬尘噪声监测</el-menu-item>
              <el-menu-item>喷淋降尘管理</el-menu-item>
            </el-submenu>     
            <el-submenu index="8">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">安全管理</span>
              </template>
              <el-menu-item index="/safety">视频监控</el-menu-item>
              <el-menu-item>事故管理</el-menu-item>
              <el-menu-item>安全检查</el-menu-item>
              <el-menu-item>巡检管理</el-menu-item>
            </el-submenu>                                                       
            <el-submenu index="9">
              <template slot="title">
                <i class="iconfont icon-baobiao"></i>
                <span slot="title">数据分析</span>
              </template>
              <el-menu-item index="/environmentAnalysis">环境监测</el-menu-item>      
              <el-menu-item index="/workerAnalysis">劳务分析</el-menu-item>    
            </el-submenu>
            <el-submenu index="10">
              <template slot="title">
                <i class="iconfont icon-shezhi" style="font-size:20px"></i>
                <span slot="title">设置</span>
              </template>
              <el-menu-item index="/role">角色管理</el-menu-item>
              <el-menu-item index="/account">账户管理</el-menu-item>
              <el-menu-item index="/changePassword">修改密码</el-menu-item>
              <el-menu-item index="/log">操作日志</el-menu-item>
            </el-submenu>          
          </el-menu>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-container style="width:100%">
      <el-header style="height:110px;margin:0;padding:0">
        <el-row
          :gutter="24"
          type="flex"
          justify="space-between"
          align="middle"
          style="margin:0;padding:10px 20px;box-shadow:0px 1px 4px 0px rgba(0,21,41,0.12);"
        >
          <i
            :class="!isCollapse?'iconfont icon-shouqi':'iconfont icon-zhankai'"
            style="font-size:18px;color:rgba(0,0,0,0.65)"
            @click="isCollapse = !isCollapse"
          ></i>
          <el-row class="grid-content bg-purple" type="flex" justify="space-between" align="middle">
            <div class="background-images head-portrait"></div>
            <!-- <img class="" :src="require('@/assets/images/header.png')"> -->
            <div class="login-name" v-text="username"></div>
            <el-popover placement="top" width="160" popper-class="popper-out" v-model="userPopover">
              <p class="user-popover">您确定确定要退出吗？</p>
              <div style="text-align: center; margin:0">
                <el-button
                  size="mini"
                  style="color:#3C62D0"
                  type="text"
                  @click="userPopover = false"
                >取消</el-button>
                <el-button type="primary" class="out" size="mini" @click="out">确定</el-button>
              </div>
              <div class="login-name" style="margin:0 4px 0 24px" slot="reference">退出</div>
            </el-popover>
          </el-row>
        </el-row>
        <div class="breadcrumb" style="background:white;" v-if="trues" :key="key">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              :to="{ name: index>0&&index<breadcrumbList.length-1?item:''}"
              v-for="(item,index) in breadcrumbList"
              :key="index"
              :class="index==$route.meta.breadcrumb.length-1&&index>0?'b':''"
            >{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <transition name="fade" mode="out-in">
          <keep-alive :include="['AttendanceSchedule']">
            <router-view/>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { store } from "@/plugin/observable";
export default {
  provide() {
    return {
      getName: this.getName,
      editBreadcrumb: this.editBreadcrumb
    };
  },
  data() {
    return {
      menuList: [],
      key: 0,
      isCollapse: false,
      menuChange: "",
      breadcrumbList: [],
      trues: true,
      username: null,
      userPopover: false
    };
  },
  // updated(){
  //   let time = document.querySelectorAll('.el-popper .el-month-table');
  //   console.log(time,999);
  // },
  methods: {
    // setCount: mutations.setCount,
    editBreadcrumb(val) {
      this.breadcrumbList[this.breadcrumbList.length - 1] = val;
      this.key += 1;
    },
    //路由跳转菜单跟随
    routerMenu() {
      this.breadcrumbList = [...this.$route.meta.breadcrumb];
      // this.menuChange = this.$route.meta.parent;
      this.menuChange = this.$route.path;
    },
    getName(val) {
      //工人列表的面包屑单独判断
      this.$nextTick(() => {
        if (
          sessionStorage.getItem("mateName") !==
          this.breadcrumbList[this.breadcrumbList.length - 1]
        ) {
          if (this.breadcrumbList[2]) {
            this.breadcrumbList.splice(2, 1);
          }
          this.breadcrumbList.push(val);
        }
      });
      this.key += 1;
    },
    out() {
      this.userPopover = false;
      sessionStorage.clear();
      this.$router.replace({ path: "/" });
    }
  },
  created() {
    this.menuList = JSON.parse(store.count);
    this.routerMenu();
    this.username = sessionStorage.workerName;
  },
  watch: {
    $route() {
      this.routerMenu();
    }
  }
};
</script>
<style lang='scss' scoped>
.default-scrollbar {
  width: 100%;
  height: 100%;
}
.head-portrait {
  background-position: -161px -100px !important;
  margin-right: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  // background: url("../assets/images/header.png")
  //   no-repeat center;
}
.flex-scrollbar {
  width: auto;
  height: auto;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.el-scrollbar__view.p20-scrollbar__view {
  overflow-x: hidden;
  padding: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.aside-header {
  height: 64px;
  color: #3c62d0;
  width: 257px;
  line-height: 64px;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 3px;
  // background: white;
}
.el-header {
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 44px;
  .login-name {
    cursor: pointer;
  }
  .breadcrumb {
    box-sizing: border-box;
    padding-top: 10px;
    padding-left: 24px;
    width: 100%;
    line-height: 44px;
    height: 44px;
    display: flex;
    align-items: center;
  }
}
.el-main {
  padding: 0;
  box-sizing: border-box;
}
</style>
<style lang='scss'>
#menu {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .el-scrollbar__thumb {
    opacity: 0;
  }
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  overflow: hidden;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 400px;
  }
  .el-breadcrumb__inner {
    color: #777777;
    font-weight: 100 !important;
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }
  .b {
    .el-breadcrumb__inner {
      font-weight: 900 !important;
      color: #3e3e3e;
      &:hover {
        color: #3e3e3e;
      }
    }
  }

  .el-aside {
    box-shadow: 1px -4px 5px 1px rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 999;
    background-color: white;
    color: #333;
    overflow: hidden;
    text-align: center;
    line-height: 200px;
    transition: all 0.3s;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  #el-menu {
    .iconfont {
      font-size: 18px;
      margin-left: 4px;
      margin-right:8px;
    }
    .el-menu-vertical-demo > .is-active {
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.08) inset;
      border-left: 4px solid #3c62d0 !important;
    }
    .el-menu-vertical-demo > .el-menu-item {
      border-left: 4px solid white;
    }
    .el-menu {
      border-right: 0;
      .el-menu-item:focus,
      .el-menu-item:hover {
        outline: 0;
        background-color: #eef1fb;
      }
      .el-menu-item.is-active {
        &:hover {
          background: #eef1fb;
        }
        background: #eef1fb !important;
      }
      .el-submenu__title {
        text-align: left;
        &:hover {
          background: #eef1fb;
        }
      }
      
      .el-menu-item {
        width: 100%;
        text-align: left;

        &:hover {
          background: #eef1fb !important;
         
        }
      }
      .el-menu-item:focus {
        background: none;
      }

      .el-submenu.is-active {
        i {
          color: #3c62d0;
        }
        span {
          color: #3c62d0;
        }
        ul {
          background: #eef1fb;
        }
      }
      .el-submenu.is-active {
        .el-submenu__title {
          box-shadow: -1px 4px 6px -1px rgba(0, 0, 0, 0.08) inset;
          background: #eef1fb;
        }
        li {
          box-shadow: -3px 0px 2px -4px rgba(0, 0, 0, 0.08) inset;
        }
      }
      .el-submenu {
        border-left: 4px solid white;
        .el-menu--inline {
          // padding-left: 30px;
          .el-menu-item {
            padding-left: 70px !important;
          }
          .el-menu-item.is-active {
            background: none;
          }
        }
      }
    }
  }
}

.popper-out {
  padding: 10px !important;
  .user-popover {
    text-align: center;
    margin-bottom: 10px;
  }
  .out {
    height: 30px;
  }
}
</style>
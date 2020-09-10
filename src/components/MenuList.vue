<template>
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
    <template v-for="(item,index) in menuList">
        <template v-if="item.name==='首页'||item.name==='薪资管理'">
           <el-menu-item  :key="item.index" :index="item.name" :route="{name:item.name}">
            <i class="el-icon-s-home"></i>
            <span class="children-menu">{{item.name}}</span>
            </el-menu-item>
        </template>
        <template v-else>
         <el-submenu :index="item.id" :key="index" v-if="item.permissions.length>0">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item :route="{name:e.name}" :index="e.name" v-for="(e,i) in item.permissions" :key="i">{{e.name}}</el-menu-item>
      </el-submenu>
      </template>
    </template>
      <!-- <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span class="children-menu">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">项目管理</span>
        </template>
        <el-menu-item index="/information">项目信息</el-menu-item>
        <el-menu-item index="/subcontract">分包管理</el-menu-item>
        <el-menu-item index="/team">班组管理</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span slot="title">工人管理</span>
        </template>
        <el-menu-item index="/workerlist">工人列表</el-menu-item>
        <el-menu-item index="/workercontract">工人合同</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-custom iconfont icon-kaoqin"></i>
          <span slot="title">考勤管理</span>
        </template>
        <el-menu-item index="/report">考勤报表</el-menu-item>
        <el-menu-item index="/records">考勤记录</el-menu-item>
        <el-menu-item index="/view">排班视图</el-menu-item>
        <el-menu-item index="/schedule">班次设置</el-menu-item>
        <el-menu-item index="/rule">排班规则</el-menu-item>
        <el-menu-item index="/device">设备管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/salaryManagement">
        <i class="el-icon-location iconfont icon-leasingcloud_xinzizuchengguanli"></i>
        <span class="children-menu">薪资管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location iconfont icon-shezhi"></i>
          <span slot="title">设置</span>
        </template>
        <el-menu-item index="/role">角色管理</el-menu-item>
        <el-menu-item index="/account">账户管理</el-menu-item>
        <el-menu-item index="/changePassword">修改密码</el-menu-item>
        <el-menu-item index="/log">操作日志</el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "MenuList",
  props: {
    menuList:Array,
    menuChange: String,
    isCollapse: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style lang="scss">
#el-menu {
  .iconfont{
    font-size: 16px;
  }
  .el-menu-vertical-demo > .is-active {
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.08) inset;
    border-left: 4px solid #3c62d0 !important;
  }
  .el-menu-vertical-demo > .el-menu-item {
    border-left: 4px solid white;
  }
  .el-menu {
    // height: 100%;
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
</style>

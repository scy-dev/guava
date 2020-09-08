<template>
  <el-container class="public-box" id="workerDetail">
    <el-header height="76px" class="public-header header-tabs">
      <el-row type="flex" align="center" justify="space-between">
        <el-row type="flex" align="center" class="header-tabs-box">
          <div
            class="tabs-main"
            v-for="(item,index) in tabs"
            :key="index"
            @click="tabSwitch(index,item.view)"
            :class="active == index? 'tabs-active':''"
          >{{item.name}}</div>
          <div class="tabs-border" :style="{left:px}"></div>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div :is="currentView"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import basic from "./basic";
import attendance from "./attendance";
import certificata from "./certificate";
export default {
  beforeRouteEnter (to, from, next) {
    if(sessionStorage.getItem('mateName')){
      next()
    }
  },
  name: "",
  inject: ["getName"],
  data() {
    return {
      active: 0,
      px: 0,
      basic: "basic",
      attendance: "attendance",
      certificata: "certificata",
      currentView: "basic",
      tabs: [
        {
          name: "基本信息",
          view: "basic"
        },
        {
          name: "考勤记录",
          view: "attendance"
        },
        {
          name: "技能证书",
          view: "certificata"
        }
      ]
    };
  },
  components: {
    basic,
    attendance,
    certificata
  },
  mounted() {
    this.getName(sessionStorage.getItem('mateName'));
  },
  methods: {
    tabSwitch(index, tabItem) {
      this.active = index;
      this.px = index * 112 + "px";
      this.currentView = tabItem;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
   beforeDestroy() {
    sessionStorage.removeItem("mateName");
  },
};
</script>
<style lang="scss">
#workerDetail {
  height: 100%;
  .tabs-active {
    color: #3c62d0;
  }
  .header-title-button {
    width: 100%;
    padding: 0 40px !important;
    .el-button + .el-button {
      margin-left: 16px;
    }
    .public-header-title {
      padding-top: 10px;
      font-size: 18px;
      height: 24px;
      line-height: 24px;
      font-weight: 900;
      color: #3e3e3e;
    }
  }
  .public-header {
    background: white;
    box-shadow: 0px 3px 22px -9px #ccc;
  }
  .public-main {
    box-sizing: border-box;
    padding: 40px;
    overflow: auto;
    .public-padding {
      padding: 0;
    }
    .public-main-content {
      //   background: white;
      box-sizing: border-box;
    }
  }
  .radius {
    background: none;
  }
}
</style>

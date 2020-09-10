<template>
  <el-container class="public-box" id="teamQuery">
  <!-- 这里是头部-->
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
    <!-- 这里是主体内容容器-->
    <el-main class="public-main">
      
      <div class="public-main-content radius public-padding" :style="{background:currentView==='teamView'?'none':'white'}">
        <component :is="currentView"></component>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import teamMembers from "./teamMembers";
import teamView from "./teamView";
export default {
  data() {
    return {
      active: 0,
      px: 0,
      explain:'',
      teamMembers: "teamMembers",
      teamView: "teamView",
      currentView: "teamMembers",
      tabs: [
        {
          name: "班组成员",
          view: "teamMembers",          
        },
        {
          name: "排班视图",
          view: "teamView"
        }
      ],
    };
  },
  components: {
    teamMembers,
    teamView
  },
  created() {
  },
  beforeDestroy() {
    sessionStorage.removeItem("mateName");
  },
  methods: {
    tabSwitch(index, view) {
    //  console.log(index)
      this.active = index;
      this.px = index * 112 + "px";
      this.currentView = view;
      // this.a(tabItem);
      //判断有无小块页面出现
    },
    handleClick(tab, event) {
      //console.log(tab, event);
    },
  },
   
};
</script>
<style lang="scss">
</style>

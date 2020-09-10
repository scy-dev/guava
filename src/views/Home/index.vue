<template>
  <el-container class="public-box" id="home">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">迭代规划</div>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="bg">
          <img src="../../assets/images/liu.png" alt="">
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
@import "~@/styles/public.scss";
#home {
  flex: 1;
  .bg{
    width:1600px;
    height: 700px;
    text-align: center;
  }
  img{
    width: 100%;
    height: 100%;
  }
}
</style>

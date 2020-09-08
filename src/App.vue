<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			  <router-view ></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app'
}

</script>

<style lang="scss">
@import "~@/assets/icon/iconfont.css";
@import "./styles/public.scss";
#app {
	.background-images{
  background: url('./assets/images/homes.png');
 background-repeat: no-repeat;
 // background-size: cover;
}
	// zoom: 0.9;
	.el-main {
        flex-basis:0 !important;
    }
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	.el-table thead {
		color: #333333 !important;
		font-weight: 500;
	}
}
.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
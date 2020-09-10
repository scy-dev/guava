import Vue from 'vue'
import App from './App'
import routes from './router'
import Pagination from "@/components/Pagination";
import {store} from '@/plugin/observable'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import axios from 'axios'
Vue.use(ElementUI)
Vue.use(VueRouter)
// Vue.use(BrockCharts);
Vue.prototype.$axios = axios;
// Vue.use(Vuex)
// axios.defaults.baseURL = "/api";


// Vue.directive('permission',{
//   // 钩子函数，被绑定元素插入父节点时调用 (父节点存在即可调用，不必存在于 document 中)。
//   inserted(el, binding, vnode){
//     console.log(el, binding, vnode);
//   }
// })


// axios.defaults.baseURL = 'http://192.168.0.110:7710/';
// Vue.prototype.tian = 'http://192.168.0.112:7920';
// Vue.prototype.liuxiancai = 'http://192.168.0.112:7920';
// Vue.prototype.tong = 'http://192.168.0.150:7923';
// Vue.prototype.action = 'http://192.168.0.112:7920/Projectmanager/project/fileUpload';
// axios.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.timeout =  6000;
// 过滤器
import * as custom from './utils/util'

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})
Vue.prototype.transformRequest = [
  function (data) {
     if (JSON.stringify(data) == "{}") {
      return data
    } else {
      let ret = "";
      for (let it in data) {
        ret +=
          encodeURIComponent(it) +
          "=" +
          encodeURIComponent(data[it]) +
          "&";
      };
      return ret;
    }
  }
];

//异步请求前在header里加入token
// axios.interceptors.request.use(
//   config => {
//     if (config.url === '/') { //如果是登录和注册操作，则不需要携带header里面的token
//     } else {
      
//       if (store.token) {
//         config.headers.Authorization = store.token;
//       }
//       // if (sessionStorage.getItem('Authorization')) {
//       //   config.headers.Authorization = sessionStorage.getItem('Authorization');
//       // }
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   });
// //异步请求后，判断token是否过期
// axios.interceptors.response.use(
//   res => {
//     return res;
//   },
//   error => {
//     if (error.response) {
//       if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
//         var newHttp= new Promise(function (resolve){
//           resolve()
//         })
//         // 返回一个promise实例，同时重新发起请求，config请求配置，包扩请求头和请求参数
//         return newHttp.then(function (){
//           return axios(config)
//         })
//       }
//       switch (error.response.status) {
//         case 500: 
//         // sessionStorage.clear();router.replace({path:'/'});break;
//       }
//     }
//     return Promise.reject(error)
//   }
// );


const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
});

router.beforeEach((to, from, next)=>{
  next()
  // if(to.path=='/'){
  //   store.count = store.token = store.projectId = null;
  //   next()
  // }else{
  //   if(store.token&&store.count&&store.projectId){
  //     store.count.includes(to.meta.parent)?next():next(false);
  //   }else{
  //     !to.meta.parent?next():next({path:'/'});
  //   };
  // };
});

Vue.config.productionTip = false;
Vue.component('Pagination',Pagination);
// Vue.mixin(mixins)
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
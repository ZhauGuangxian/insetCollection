// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js';
import {fetchPost} from './js/fetch';
Vue.config.productionTip = false

Vue.directive('incursor',{
  inserted:function(el,binding){
    el.style="cursor:pointer"
  }
})
let getUser =async function(store){
  let token = localStorage.getItem('token');

  let result = await fetchPost('./api/getUserInfo',{token});

  if(result.message == 'success'){
    store.dispatch('get_user_success',result.data);

  }
   
}
router.beforeEach((to,from,next)=>{
  if(localStorage.getItem('token') && !sessionStorage.getItem('userData')){
    getUser(store);
    
  }
  next();
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

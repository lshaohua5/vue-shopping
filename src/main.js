import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import FastClick from 'fastclick'; // 引入插件
import './assets/iconfont/iconfont.styl' //iconFont
import filters from '@/utils/filter' //过滤器
import accuracy from './assets/accuracy/accuracy'
// 引入rem reset.css
import './assets/reset/reset.css'
import './assets/rem/index.min'

import {
  Cell,
  CellGroup,
  Icon,
  Button,
  SwipeCell,
  NavBar,
  Search,
  Toast,
  Row,
  Col,
  Actionsheet,
  DatetimePicker,
  Field,
  Dialog,
  Picker,
  Popup
} from 'vant';

Vue.use(Cell).use(CellGroup);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Search);
Vue.use(Toast);
Vue.use(Row);
Vue.use(Col);
Vue.use(Actionsheet);
Vue.use(DatetimePicker);
Vue.use(Field);
Vue.use(Dialog);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(NavBar);
Vue.use(SwipeCell);

// FastClick.attach(document.body); // 使用 fastclick 去除300ms延迟
axios.defaults.withCredentials = true;

//设置接口基础URL路径 ios走https
const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (isIos) {
  axios.defaults.baseURL = 'https://merchant-cc1fczgbkoyy.lekabao.net/depot_api/';
} else {
  axios.defaults.baseURL = 'http://merchant-cc1fczgbkoyy.lekabao.net/depot_api/';
}

// axios.defaults.baseURL = 'depot_api/';


//设置超时，默认5000ms
//axios.defaults.timeout = 5000;

// 添加请求拦截器
/*axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    let cid = sessionStorage.getItem('getCID');
    if(!cid){
      if (config.method === 'post') {
        config.data = {
          cid: cid,
          ...config.data,
        }
      }
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  }
);*/

Vue.prototype.$http = axios;//把axios挂载到vue原型上
Vue.prototype.accuracy = accuracy.accuracy;
Vue.prototype.filters = filters;
Vue.config.productionTip = false;

//金额
Vue.filter('mouney', function (val) {
  let toFixedNum = Number(val).toFixed(3);
  let realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
  return realVal;
});
//如果是整数直接返回，如果不是整数保留俩位
Vue.filter('number', function (val) {
  if (typeof val == 'number' && val % 1 == 0) {
    return val;
  } else {
    let toFixedNum = Number(val).toFixed(3);
    let realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
    return realVal;
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  filters,
  render: h => h(App)
});

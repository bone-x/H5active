/*
 * @Author: linweibin
 * @Description:
 * @props:
 * @event:
 * @Date: 2019-10-09 10:47:16
 * @LastEditors: linweibin
 * @LastEditTime: 2019-11-15 10:29:43
 */
import Vue from 'vue';
import 'babel-polyfill';
import Es6Promise from 'es6-promise';
import App from './App.vue';
import router from './router';
import store from './store';
import factory from './factory';
import { fetch, post } from './ajax';

import 'lib-flexible';
import './assets/css/reset.css';
// import "./assets/font/iconfont.css";
import {
  Button,
  Tabbar,
  TabbarItem,
  List,
  Toast,
  Dialog,
  Tab,
  Tabs,
  Collapse,
  CollapseItem,
  Icon,
  Field
} from 'vant';
Es6Promise.polyfill()

Vue.config.productionTip = false
Vue.use(Button).use(Dialog)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(List)
Vue.use(Toast)
Vue.use(Tab).use(Tabs)
Vue.use(Collapse).use(CollapseItem)
Vue.use(Icon)
Vue.use(Field)

Vue.prototype.$fetch = fetch
Vue.prototype.$post = post
Vue.prototype.$factory = factory

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2019-10-24 17:04:46
 * @LastEditors: 邓达
 * @LastEditTime: 2019-10-24 17:09:45
 */
import Cookie from "js-cookie";
import axios from "axios";
export default {
  getcookiesInClient: function(key) {
    if (Cookie.get(key) && Cookie.get(key) != "") {
      return Cookie.get(key);
    } else {
      return false;
    }
  },
  delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getcookiesInClient(name);
    if (cval)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },
  getInfo(key) {
    return JSON.parse(localStorage.getItem(key))
      ? JSON.parse(localStorage.getItem(key))
      : false;
  },
  formatImg(item) {
    let arr = item.split(",");
    return decodeURIComponent(arr[0]);
  },
  deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=v; expire=" + date.toGMTString();
  }
};

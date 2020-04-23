/*
 * @Author: linweibin
 * @Description: 增加学习详情页
 * @props:
 * @event:
 * @Date: 2019-10-19 09:10:46
 * @LastEditors: linweibin
 * @LastEditTime: 2019-11-25 10:12:50
 */
import Vue from "vue";
import Router from "vue-router";
import Detail from "./views/Detail";
import Home from "./views/Home";
import LearnDetail from "./views/leranDetail";
import StudyInput from "./views/getStudyWay/index.vue";
import GetPaper from "./views/getStudyWay/getCheapPaper.vue";
import LastWay from "./views/getStudyWay/lastWay.vue";
import MyLogin from "./views/myLogin/index.vue";
import MyOrder from "./views/myOrder/index.vue";
import Login from "./views/Login/index.vue";
import ReplaceLogin from "./views/replaceLogin/index.vue";
import StudyCourse from "./views/studyCourse/index.vue";

Vue.use(Router);

var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/index",
      name: "Detail",
      component: Detail,
      meta: {
        keepAlive: true // 需要被缓存的组件
      }
    },
    {
      path: "/study",
      name: "studyInput",
      component: StudyInput
    },
    {
      path: "/paper",
      name: "getPaper",
      component: GetPaper
    },
    {
      path: "/last",
      name: "lastWay",
      component: LastWay
    },
    {
      path: "/learnDetail",
      name: "learnDetail",
      component: LearnDetail
    },
    {
      path: "/Home",
      name: "Home",
      component: Home,
      redirect: "/studyCourse",
      children: [
        {
          path: "/myLogin",
          name: "myLogin",
          component: MyLogin
        },
        {
          path: "/studyCourse",
          name: "studyCourse",
          component: StudyCourse
        }
      ]
    },
    {
      path: "/myOrder",
      name: "myOrder",
      component: MyOrder
    },
    {
      path: "/Login",
      name: "login",
      component: Login
    },
    {
      path: "/replaceLogin",
      name: "replaceLogin",
      component: ReplaceLogin
    }
  ]
});

router.beforeEach(function(to, from, next) {
  if (to.name != "replaceLogin" && to.name != "Detail") {
    let token = Vue.prototype.$factory.getcookiesInClient("token") || false;
    let tokentype =
      Number(Vue.prototype.$factory.getcookiesInClient("token_type")) || 0;
    Vue.prototype
      .$fetch(
        `/hjBaseUrl/stu/api/h5/weixin/validateToken?token=${token}&tokentype=${tokentype}`
      )
      .then(data => {
        // console.log(data);
        if (data && data.code != 200) {
          router.push({
            name: "replaceLogin",
            query: { ...to.query, routerName: to.name }
          });
        } else {
          //   let userInfo = JSON.stringify(data.data);
          //   localStorage.setItem("userInfo", userInfo);
        }
      });
  }

  next();
});

export default router;

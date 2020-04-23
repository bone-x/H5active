/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2019-10-24 16:25:23
 * @LastEditors: linweibin
 * @LastEditTime: 2019-11-15 10:30:17
 */
import axios from "axios";
import Vue from "vue";
import querystring from "querystring";
import router from "../router";

let vue = new Vue();

function startLoading() {
  vue.$toast.loading({
    message: "加载中...",
    forbidClick: true,
    duration: 0
  });
}

function endLoading() {
  vue.$toast.clear();
}

/**
 * @Description: 错误请求上报方法
 * @params {Object} params
 * @return:
 * @LastEditors: 蔡江旭
 * @LastEditTime: Do not edit
 * @Date: 2019-04-23 11:31:43
 */
function postErrorRequest(params) {
  axios.post("/hjBaseUrl/search/api/public/errorReport/saveReport", params);
}

const $alert = msg => {
  if (!msg) return;
  vue.$toast.fail(msg);
};

axios.defaults.withCredentials = true;

// request拦截器
axios.interceptors.request.use(
  config => {
    if (
      config.method === "post" &&
      config.headers["Content-Type"] !== "application/json"
    ) {
      config.transformRequest = [
        function(data) {
          return querystring.stringify(data);
        }
      ];
    }
    config.headers["token"] = vue.$factory.getcookiesInClient("token") || "";
    config.headers["tokentype"] =
      vue.$factory.getcookiesInClient("token_type") || "";

    // startLoading();
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone拦截器
axios.interceptors.response.use(
  res => {
    const { config, request } = res;
    const { responseURL, res: response, path, method } = request;
    const reqUrl = responseURL || (response && response.responseUrl) || path;
    if (!res || !res.data) {
      $alert("服务器无响应");
    }

    if (res.data.code !== 200) {
      let msg = res.data.msg || res.data.message;
    }
    return res;
  },
  error => {
    const codeList = [1002, 401];
    let code = codeList.includes(error.response.data.code);
    if (code) {
      const toRouter = router.history.current;
      if (toRouter.name !== "Detail") {
        router.push({
          name: "replaceLogin",
          query: { ...toRouter.query, routerName: toRouter.name }
        });
      } else {
        location.reload();
      }
    } else {
      $alert("服务器异常，请联系管理员");
      // 错误请求上报
      try {
        const { config } = error;
        // postErrorRequest({
        //   url: `${config.method} : ${config.url}`,
        //   params: JSON.stringify(config.data || config.params),
        //   msg: JSON.stringify(error),
        //   alertMsg: '服务器异常，请联系管理员'
        // })
      } catch (err) {
        console.log(err);
      }

      return Promise.reject(error);
    }
  }
);

/**
 * 封装get方法
 * @param url
 * @param params
 * @headers 自定义头部
 * @returns {Promise}
 */

export function fetch(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @headers 自定义头部
 * @returns {Promise}
 */

export function post(url, data = {}, headers = {}) {
  let newHeaders = {
    "Content-Type": "application/json",
    ...headers
  };
  return new Promise((resolve, reject) => {
    axios.post(url, data, { headers: newHeaders }).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

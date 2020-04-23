<!--
 * @Author: linweibin
 * @Description: 网页标题改为商品名称
 * @props: 
 * @event: 
 * @Date: 2019-10-19 09:10:46
 * @LastEditors: 邓达
 * @LastEditTime: 2019-11-14 15:39:55
 -->

<template>
  <div class="productBox">
    <div>
      <img
        :src="decodeURIComponent(item)"
        v-for="(item,index) in goodsCoverImages"
        :key="index"
        style="display:block;"
        width="100%;height:auto;"
      />
    </div>
    <PriceAndBuy :priceDate="priceDate" @on-buyCourse="buyCourse" @hotPart="goFree()" />
    <Dialog @closeDialog="closeDialog" v-show="isShow" @login="goLogin" />
  </div>
</template> 
<script>
import PriceAndBuy from "@/components/PriceAndBuy";
import Dialog from "@/components/dialog";
import querystring from "querystring";

export default {
  name: "Detail",
  data() {
    return {
      appId: "wxa8153b1de0ecfcb7", //测试线 wxa8153b1de0ecfcb7------------ 正式//wx305763b6658f28fb
      Dialog: false,
      isShow: false,
      isRequest: false,
      goodsCoverImages: [],
      code: "",
      mobile: "",
      token: this.$factory.getcookiesInClient("token") || "",
      openId: localStorage.getItem("openId") || "",
      priceDate: {
        originalPrice: null,
        buyPrice: null,
        discount: null,
        code: ""
      },
      unionId: "", //微信唯一标识
      modulus: "", // 模数
      wxNickname: "", // 微信昵称
      newsShareInfo: {} //微信分享的参数
    };
  },
  components: {
    PriceAndBuy,
    Dialog
  },
  mounted() {
    // 獲取appid
    // this.getAppId();
    this.goodsPvAndUv(); //埋点
    this.getGoodsDetail();

    if (this.$factory.getcookiesInClient("token")) {
      let tokentype =
        Number(this.$factory.getcookiesInClient("token_type")) || 0;
      this.$fetch(
        `/hjBaseUrl/stu/api/h5/weixin/validateToken?token=${this.token}&tokentype=${tokentype}`
      ).then(data => {
        // console.log(data);
        if (data && data.code != 200) {
          this.getWxCode();
        } else {
          this.isRequest = true;
        }
      });
    } else {
      this.getWxCode();
    }

    window.addEventListener(
      "blur",
      () => {
        //  if(document.activeElement.tagName==='INPUT'){
        setTimeout(() => {
          document.body.scrollIntoView(false);
        }, 0);
        //  }
      },
      true
    );
  },
  methods: {
    goodsPvAndUv() {
      //埋点
      let url = location.href;
      this.$fetch(
        `/hjBaseUrl/operate/api/h5/siYuH5LangdingPage/goodsPvAndUv?interfaceName=${url}`
      );
    },
    buyGoodsButtoon() {
      //埋点
      this.$fetch(
        `/hjBaseUrl/operate/api/h5/siYuH5LangdingPage/buyGoodsButtoon`
      );
    },
    getWxCode() {
      let url = location.href;
      if (this.$route.query.code) {
        console.log("1");
        let { scope = "snsapi_base" } = this.$route.query;
        this.conmmonLogin(scope);
      } else {
        console.log("2");
        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          this.appId
        }&redirect_uri=${encodeURIComponent(
          url
        )}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
      }
    },
    getOther() {
      let host = location.href.split("?")[0];
      let { goodsId, userId = "" } = this.$route.query;
      let url = `${host}?goodsId=${goodsId}&userId=${userId}&scope=snsapi_userinfo`;
      // console.log(url)
      location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        this.appId
      }&redirect_uri=${encodeURIComponent(
        url
      )}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    },
    getGoodsDetail() {
      let { goodsId, userId = "" } = this.$route.query;
      this.$fetch(
        `/hjBaseUrl/goods/api/h5/v2/activityGoods/getGoodDetail?goodsId=${goodsId}&userId=${userId}`
      )
        // .then(res => res.json())
        .then(data => {
          this.goodsCoverImages = data.result.goodsCoverImages;
          this.priceDate = data.result;
          // 设置标题为课程标题
          setTimeout(function() {
            document.title = data.result.name;
            var i = document.createElement("iframe");
            // i.src = "/favicon.ico";
            i.style.display = "none";
            i.onload = function() {};
            document.body.appendChild(i);
          }, 0);
          // 设置微信分享的参数
          this.newsShareInfo.title = data.result.name;
          this.newsShareInfo.desc = "";
          this.newsShareInfo.link = window.location.href;
          this.newsShareInfo.imgUrl = decodeURIComponent(
            data.result.goodsCoverImages[0]
          );
          if (this.isWeiXin()) {
            this.getWxSign();
          }
        });
    },
    // 判断是否在微信环境
    isWeiXin() {
      var userAgent = window.navigator.userAgent.toLowerCase();
      var result = /micromessenger/.test(userAgent) ? true : false;
      if (result) {
        console.log("你正处于微信环境");
        return true;
      } else {
        console.log("不是微信环境");
        return false;
      }
    },
    // 获取微信签名
    getWxSign() {
      this.$fetch(
        `/hjBaseUrl/inf/api/h5/information/sign?url=${window.location.href}`
      )
        // .then(res => res.json())
        .then(data => {
          //   console.log(data);
          if (data) {
            // console.log(res);
            let wxconfig = {
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              // appId: 'wxa8153b1de0ecfcb7', // 必填，公众号的唯一标识
              appId: this.appId,
              timestamp: data.result.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
              signature: data.result.signature, // 必填，签名，见附录1
              // jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareWeibo",
                "onMenuShareQZone",
                "showOptionMenu",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem"
              ]
            };
            window.wx.config(wxconfig);
            // console.log(window.wx)
            const { newsShareInfo } = this;
            console.log(newsShareInfo);
            // console.log(coverImg)
            window.wx.ready(function() {
              // alert('jinru')
              //需在用户可能点击分享按钮前就先调用
              // window.wx.onMenuShareAppMessage(newsShareInfo);
              // window.wx.onMenuShareTimeline(newsShareInfo);
              window.wx.onMenuShareAppMessage(newsShareInfo); // 微信好友
              window.wx.onMenuShareTimeline(newsShareInfo); // 朋友圈
              window.wx.onMenuShareQQ(newsShareInfo); // QQ
              window.wx.onMenuShareQZone(newsShareInfo); // QQ空间
              window.wx.onMenuShareWeibo(newsShareInfo); // 腾讯微博
            });
            window.wx.error(function(data) {
              console.log(data);
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
          }
        });
    },
    closeDialog(value) {
      this.isShow = value;
    },
    conmmonLogin(scope) {
      let { code } = this.$route.query;
      this.priceDate.code = code;
      //   let openId = localStorage.getItem("openId");
      this.$fetch(
        `/hjBaseUrl/stu/api/h5/weixin/loginByWeChatCode?code=${code}&scope=${scope}`
      )
        // .then(res => res.json())
        .then(data => {
          this.isRequest = true;
          switch (data.code) {
            case 10100 || 1110: //报错
              alert("请联系管理员");
              break;
            case 200: //登录成功
              break;
            case 10102: //换 scope
              this.getOther();
              break;
          }
          delete this.$route.query.code;
          delete this.$route.query.state;

          window.history.pushState(
            {},
            0,
            location.origin +
              location.pathname +
              "?" +
              querystring.stringify(this.$route.query)
          );

          //   //没有注册的时候 弹出注册框  tokenType 0 鉴权token 1行家临时toekn
        })
        .catch(err => alert(err));
    },
    // 购买课程
    buyCourse() {
      this.buyGoodsButtoon(); //埋点
      let { goodsId, userId = "" } = this.$route.query;
      //   if (this.priceDate.buyPrice == 0) {
      //     //免费
      //     this.$router.push({ name: "studyInput", query: { goodsId, userId } });
      //   } else {
      //2不是免费

      this.isShow = Number(this.$factory.getcookiesInClient("token_type"))
        ? true
        : false;
      if (!this.isShow && this.isRequest) {
        let data = {
          //   code: this.priceDate.code,
          //   token: this.token,
          openId: this.openId,
          cip: returnCitySN["cip"],
          goodsId,
          paymentEntry: 6,
          goodsOperators: userId
        };
        //支付
        this.$post(
          `/hjBaseUrl/order/api/h5/auth/activityOrder/saveOrder`,
          data,
          {
            userToken: this.token,
            "Content-Type": "application/json"
          }
        )
          // .then(res => res.json())
          .then(response => {
            this.mobile = response.result.mobile;
            if (typeof WeixinJSBridge == "undefined") {
              if (document.addEventListener) {
                document.addEventListener(
                  "WeixinJSBridgeReady",
                  onBridgeReady,
                  false
                );
              } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
              }
            } else {
              if (response.result.isFree) {
                //这里是免费下订单
                this.$router.push({
                  name: "studyInput",
                  query: { goodsId, userId }
                });
              } else {
                //调起支付
                //response.result.orderExist:false 没有购买
                if (response.result.orderExist) {
                  //已经购买
                  this.$router.push({
                    name: "lastWay",
                    query: { goodsId, userId, mobile: this.mobile }
                  });
                } else {
                  //调起支付
                  this.WxPay(response.result.wxPayPayResult);
                }
              }
            }
          })
          .catch(error => console.error("Error:", error));
      }
      //   }
    },
    WxPay(data) {
      let { goodsId, userId = "" } = this.$route.query;
      WeixinJSBridge.invoke("getBrandWCPayRequest", data, res => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          this.$router.push({
            name: "lastWay",
            query: { goodsId, userId, mobile: this.mobile }
          });
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        }
      });
    },
    goLogin(val) {
      if (!val[0] && !val[1]) {
        return;
      }

      let data = {
        mobile: val[0],
        otp: val[1]
      };

      this.$post(`/hjBaseUrl/stu/api/h5/auth/weixin/bindMobile`, data, {
        "Content-Type": "application/x-www-form-urlencoded"
      }).then(data => {
        if (data.code == 200) {
          this.isShow = false;
        } else {
          alert(data.message);
        }
      });
    },
    // 点击优惠券
    goFree() {
      if (this.priceDate.isDiscount) {
        // 已领取优惠券
        return false;
      } else {
        let { goodsId, userId = "" } = this.$route.query;
        this.$router.push({ name: "getPaper", query: { goodsId, userId } });
      }
    }
  }
};
</script>
  
<style lang="less" scoped>
.productBox {
  width: 100%;
  padding-bottom: 130px;
  .productImg {
    width: 100%;
    height: auto;
  }
}
</style>  
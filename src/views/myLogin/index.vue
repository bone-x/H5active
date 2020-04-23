<template>
  <div class="loginPage">
    <div class="loginHead">
      <img
        :src="avatar"
        @error="replaceImg()"
      />
      <p>{{this.wxNickname}}</p>
    </div>
    <router-link :to="{path:'myOrder'}">
      <div class="myOrder" style="margin-bottom: 16px;">
        <span>我的订单</span>
        <i class="iconfont iconright1"></i>
      </div>
    </router-link>
      <div class="myOrder" @click="closePhoneNum">
        <span>绑定手机</span>
        <acronym>
          {{this.mobileNo}}
          <i class="iconfont iconright1"></i>
        </acronym>
      </div>
    <div class="myOrder" @click="adviceBack">
      <span>意见反馈</span>
      <i class="iconfont iconright1"></i>
    </div>
    <div class="myOrder" @click="aboutUs">
      <span>关于我们</span>
      <i class="iconfont iconright1"></i>
    </div>

    <!-- <div class="outLogin" @click="outH5">退出登录</div> -->


    <van-dialog
      v-model="show"
      title="绑定手机"
      confirmButtonText="去绑定"
      confirmButtonColor="rgba(255, 120, 71, 1)"
      show-cancel-button
     :beforeClose="beforeClose"
    >
    <p class="textCss">根据<acronym>《中华人民共和国网络安全法》</acronym>要求，自 2017年6月1日起使用信息发布、即时通讯等 互联网服务<acronym>需进行身份信息验证</acronym>。为保障您的使用体验，建议尽快完成<acronym>手机号绑定验证</acronym>，感谢您的理解和支持。</p>
    </van-dialog>
  </div>
</template>

<script>

export default {
  name: "myLogin",
  data() {
    return {
      show: false,
      avatar: "",
      wxNickname: "",
      mobileNo: "",
      defaultPng: "http://alifile.hqjy.com/hq/Avatar.png",
    };
  },
  mounted() {
    // 用户成功绑定手机之后回显手机号码
    const userPhoneNum = localStorage.getItem("phoneNumber");
    // this.show = true;
    let userInfo = JSON.parse(this.$factory.getcookiesInClient("userInfo"));
    let  {headImgUrl,wxNickname,mobile} = userInfo;
    this.avatar = headImgUrl;
    this.wxNickname = wxNickname;
    this.mobileNo = userPhoneNum || mobile;
    console.log(this.$factory.getcookiesInClient("userInfo"));
    if (!this.mobileNo) {
      this.loginOne();
    }
    
  },
  methods: {
    // 一天内显示一次弹窗
    loginOne() {
      var setCookie = (name, value, day) =>{
      if(document.cookie.indexOf("setCookieData")===-1){
        var expires = day * 60 * 60 * 1000;
        var date = new Date(+new Date()+expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
        this.show = true;
      }else{
         this.show = false;
      }
    };
    setCookie("setCookieData",1,24);
    },
    adviceBack() {
      location.href="/PersonalCenter/feedback";
    },
    aboutUs() {
      location.href="/PersonalCenter/guideAboutus/aboutUs"; 
    },
    replaceImg() {
      let img = event.srcElement;
      img.onerror = null; //防止闪图
      img.src=this.defaultPng;
    },
    outH5() {
      // 清除token
    console.log(this.$factory.getcookiesInClient("token"));
    this.$factory.deleteCookie("token");
    },
    beforeClose(action,done) {
      if (action === 'confirm') {
        this.$router.push({name:'login'});
        done();
      } else if (action === 'cancel') {
        done();
      }
      
  },
  // 绑定手机
  closePhoneNum () {
    if (this.mobileNo) {
      return false;
    } else {
      this.$router.push({path:'login'});
    }
  }
  }
  
}

</script>

<style lang='less' scoped>
.loginPage {
  background: rgba(242, 242, 242, 1);
  height: auto;
  width: 100%;
  position: fixed;
  .textCss {
    padding: 20px 67px 36px 54px;
    font-size:24px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:36px;
    acronym {
      color: rgba(255, 120, 71, 1);
    }
  }
  .loginHead {
    width: 100%;
    height: 342px;
    background: url("../../assets/bg.jpg") no-repeat;
    background-size: 100% 342px;
    position: relative;
    img {
      position: absolute;
      width: 145px;
      height: 145px;
      border-radius: 50%;
      display: block;
      left: 302px;
      top: 92px;
    }
    p {
      padding-top: 252px;
      text-align: center;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .myOrder {
    width: 100%;
    height: 120px;
    line-height: 120px;
    background: #fff;
    span {
      display: inline-block;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-left: 36px;
    }
    i {
      border-radius: 2px;
      font-size: 25px;
      float: right;
      color: rgba(153, 153, 153, 1);
      margin-right: 36px;
    }
    acronym {
      font-size: 25px;
      float: right;
      color: rgba(153, 153, 153, 1);
      i {
        border-radius: 2px;
        font-size: 25px;
        float: right;
        color: rgba(153, 153, 153, 1);
        margin-left: 12px;
      }
    }
  }
  .outLogin {
    width: 100%;
    height: 96px;
    text-align: center;
    line-height: 96px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 120, 71, 1);
    background: #fff;
    position: fixed;
    bottom: 104px;
    margin-bottom: 16px;
  }
}
</style>

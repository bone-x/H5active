 <template>
  <div class="login">
    <div class="phoneNumber">
      <input type="text" v-model="phoneNumber" placeholder="请输入手机号" class="input" />
    </div>
    <div class="psw">
      <input type="password" v-model="verifyCode" placeholder="请输入验证码" class="input" />
      <input
        type="button"
        value="发送验证码"
        @click="getCode()"
        ref="message_get"
        :disabled="isDisabled"
        class="button"
      />
    </div>
    <div class="btn" :style="{background:styleObject}" @click="goLogin()">绑定</div>

    <p class="text">绑定后可以在APP使用手机号+密码登录</p>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      countdown: 60,
      phoneNumber: "",
      verifyCode: "",
      styleObject: "",
      isDisabled: true,
      userInfo: {
        modulus:
          "143007763867708245982550381748032993853797502584594295914200689163618815058321453959983195313535666470252683164261269026983940349924869732959918399568958179803295984852427882791531368219200963823867536269012778315784568514961377749309396708261722002399944277892840971506358083758762598588651936802171373016087",
        unionId:
          "CD5Zqld/uu/WLjKeiDdNxznKKj3Zww2tvpQFlrF55151515Qk1eQzJJ7MFDRk5zzjtgyq/jQYoAUBC6mN/Aqj69UWoxx7QEekJ8sBfz13reYHDtIIsX0fpmJxR\nno0MS1SVntdk6UHfUqE=\n",
        wxNickname: "旺旺"
      },
      clickGetCode: false
    };
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    verifyCode(newQuestion, oldQuestion) {
      if (this.verifyCode && this.phoneNumber) {
        this.styleObject = "rgba(255,120,71,1)";
      }
    },
    phoneNumber(newQuestion, oldQuestion) {
      if (this.phoneNumber && this.checkPhone(this.phoneNumber)) {
        this.isDisabled = false;
      }
    }
  },
  mounted() {
    // 通过cookie获取绑定手机号所需要的参数
    if (this.$factory.getcookiesInClient("userInfo")) {
      this.userInfo = JSON.parse(this.$factory.getcookiesInClient("userInfo"));
    }
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#fff");
  },
  methods: {
    checkPhone(str) {
      //验证电话号码
      let myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (myreg.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    getCode() {
      this.clickGetCode = true;
      this.$fetch(
        `/authBaseUrl/api/getOtp?mobileNo=${this.phoneNumber}&type=3`
      ).then(data => {
        console.log(data, "发送验证码");
        this.countTime();
      });
    },
    countTime() {
      // 验证码倒计时逻辑
      let val = this.$refs.message_get;
      //   this.ImgStatus = false;
      if (this.countdown == 0) {
        val.removeAttribute("disabled");
        val.value = "重新发送";
        this.countdown = 60;
      } else {
        val.setAttribute("disabled", true);
        val.value = this.countdown + "S";
        this.countdown--;
        setTimeout(() => {
          this.countTime(val);
        }, 1000);
      }
    },
    // 绑定手机
    goLogin(val) {
      this.$fetch(
        `/hjBaseUrl/stu/api/h5/weixin/refreshModulus?openId=${this.userInfo.openId}`
      )
        .then(res => {
          var data = {
            mobileNo: this.phoneNumber,
            modulus: res.result.modulus,
            otp: this.verifyCode,
            unionId: res.result.unionId.replace(/↵/g, ""),
            wxNickname: this.userInfo.wxNickname,
            clientType: "h5",
            versionCode: 1
          };
          if (this.phoneNumber && this.verifyCode && this.clickGetCode) {
            return this.$fetch(`/authBaseUrl/api/privDomainBindMobile`, data, {
              "Content-Type": "application/x-www-form-urlencoded"
            });
          }
        })
        .then(response => {
          //   alert(response.message);
          if (response.code == 200) {
            this.$router.push({
              name: "myLogin"
            });
            localStorage.setItem("phoneNumber", this.phoneNumber);
          }
          if (response.code == 400) {
            console.log(response.message);
            alert("验证码错误请重试!");
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
// 兼容IOS
input[type="button"],
input[type="text"],
input[type="password"] {
  -webkit-appearance: none;
  outline: none;
}
.login {
  padding-top: 28px;
  width: 100%;
  height: auto;
  .psw,
  .phoneNumber {
    margin: 0 73px 0 71px;
    height: 108px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 0px 0px rgba(237, 237, 237, 1);
    display: flex;
    justify-content: space-between;
    .input {
      padding: 38px 0 39px 10px;
      height: 31px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 400;
      border: none;
      display: inline-block;
    }
    .button {
      margin: 25px 0 23px 0;
      width: 160px;
      height: 60px;
      background: rgba(237, 237, 237, 1);
      border-radius: 30px;
      border: none;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      text-align: center;
      line-height: 60px;
      display: inline-block;
    }
  }

  .btn {
    margin: 61px 73px 30px 71px;
    height: 90px;
    background: rgba(237, 237, 237, 1);
    border-radius: 18px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 90px;
  }
  .text {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    text-align: center;
  }
}
</style>
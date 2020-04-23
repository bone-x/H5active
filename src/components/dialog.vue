
<template>
  <div class="Dialog">
    <div class="box">
      <li class="title center">请绑定手机号</li>
      <li class="connect center">为方便我们客服人员与您联系，请绑定手机</li>
      <li class="center cellPhone">
        <input type="number" placeholder="请输入手机号" v-model="phoneNumber" />
      </li>
      <li class="center">
        <div class="code">
          <div class="left">
            <input type="number" placeholder="请输入验证码" v-model="verifyCode" />
          </div>
          <div class="right">
            <!-- <button @click="getCode()" ref="message_get">{{this.countdown}}</button> -->
            <input
              type="button"
              value="发送验证码"
              @click="getCode()"
              ref="message_get"
              :disabled="isDisabled"
            />
          </div>
        </div>
      </li>
      <li class="bind center">
        <button v-bind:style="{background:styleObject}" @click="register()">绑定</button>
      </li>
      <li class="delete">
        <img src="@/assets/delete.png" alt="del" @click="closeDialog()" />
      </li>
    </div>
    <div class="cover"></div>
  </div>
</template>
<script>
export default {
  name: "Dialog",
  data() {
    return {
      countdown: 60,
      phoneNumber: "",
      verifyCode: "",
      styleObject: "",
      isDisabled: true
    };
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    verifyCode(newQuestion, oldQuestion) {
      if (newQuestion && newQuestion) {
        this.styleObject = "rgba(255,120,71,1)";
      }
    },
    phoneNumber(newQuestion, oldQuestion) {
      console.log(this.checkPhone(this.phoneNumber));
      if (this.phoneNumber && this.checkPhone(this.phoneNumber)) {
        this.isDisabled = false;
      }
    }
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
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    getCode() {
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
    register() {
      !this.isDisabled && this.verifyCode;
      this.$emit("login", [this.phoneNumber, this.verifyCode]);
    }
  }
};
</script> 
<style lang="less" scoped>
input[type="button"],
input[type="submit"],
input[type="file"],
button {
  cursor: pointer;
  -webkit-appearance: none;
}
input {
  -webkit-user-selection: none;
  -webkit-appearance: none;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.Dialog {
  position: relative;
  button,
  input {
    outline: none;
  }
  .box {
    z-index: 10000;
    width: 600px;
    height: 600px;
    // margin-top: 300px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -320px;
    margin-top: -300px;
    text-align: center;
    z-index: 100;
    border-radius: 10px;
    padding: 20px;
    .title {
      font-size: 38px;
      font-weight: 400;
    }
    .connect {
      font-size: 24px;
      font-weight: 400;
      color: #666;
    }
    .center {
      text-align: center;
      margin-top: 30px;
    }
    .cellPhone {
      input {
        width: 480px;
        height: 80px;
        border: 0;
        border-bottom: 1px solid #f2f2f2;
        font-size: 32px;
      }
    }
    .delete {
      margin-top: 120px;
      text-align: center;
      img {
        display: block;
        width: 54px;
        height: 54px;
        margin: auto;
        border-radius: 100%;
      }
    }
    .bind {
      margin-top: 50px;
      button {
        width: 480px;
        height: 90px;
        background: rgba(221, 221, 221, 1);
        border-radius: 10px;
        border: 0;
        font-size: 26px;
        color: #fff;
        letter-spacing: 2px;
      }
    }
    .code {
      width: 480px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .left {
        width: 70%;
        input {
          width: 100%;
          height: 80px;
          font-size: 32px;
          border: 0;
          border-bottom: 1px solid #f2f2f2;
        }
      }
      .right {
        input {
          width: 180px;
          height: 60px;
          background: rgba(255, 120, 71, 1);
          border-radius: 30px;
          font-weight: 500;
          font-size: 26px;
          color: #fff;
          border: 0;
        }
      }
    }
  }
  .cover {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
  }
}
</style>
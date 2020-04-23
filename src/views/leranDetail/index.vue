<!--
 * @Author: linweibin
 * @Description: 学习详情页, 支持直播和录播
 * @props: 
 * @event: 
 * @Date: 2019-10-19 09:36:41
 * @LastEditors: linweibin
 * @LastEditTime: 2019-11-25 18:16:27
 -->
<template>
  <div class="learnDetail">
    <section class="videoBox">
      <img
        :src="courseIntroduce.coverPicture ? decodeURIComponent(courseIntroduce.coverPicture) : ''"
        v-if="videoType == 1"
        style="width:100%; height: 260px;"
      />
      <PlayerBL ref v-if="videoType === 2" :config-bl="configBl" />
      <PlayerZS
        ref="childzs"
        v-if="videoType === 3"
        :config-zs="configZs"
        v-bind:chatmsg="chatmsg"
        @onChatData="onChatData"
      />
    </section>
    <van-tabs v-model="active">
      <van-tab title="介绍">
        <div class="intrduceBox">
          <h3 class="title">课程介绍</h3>
          <p class="description" v-html="courseIntroduce.introduction"></p>
        </div>
      </van-tab>
      <van-tab title="目录">
        <van-collapse v-model="activeNames">
          <van-collapse-item
            v-for="(item,index) in courseData"
            :key="item+index"
            :title="textEllipsis(item.name)"
            :name="index"
          >
            <div
              class="chapterList"
              v-for="(it,index) in item.list"
              :key="it+index"
              @click="playVideo(it)"
            >
              <div class="circlesBox">
                <span class="circles"></span>
              </div>
              <div
                class="chapterInfo"
                :style="index==item.list.length-1?'':'border-bottom: 1px solid rgba(237, 237, 237, 1)'"
              >
                <div class="chapterTitle">
                  <i class="iconfont iconvideo_icon"></i>
                  <span
                    v-bind:class="it.videoStatus == 0?'text':'text active'"
                    v-text="textEllipsis2(it.name)"
                  ></span>
                </div>
                <div class="chapterTips">
                  <span
                    class="time"
                    v-if="(it.liveRecordId !== 0 || it.liveRecordId !== null) && it.duration"
                    v-text="it.duration"
                  ></span>
                  <span
                    class="time"
                    v-if="(it.liveStatus === 'END' && !it.duration)"
                  >{{getTime(it.openingDate)}}-{{endTimeSlice(it.endTime)}}</span>
                  <span
                    class="time"
                    v-if="(it.liveStatus === 'NOT_STARTED' && !it.duration)"
                  >{{getTime(it.openingDate)}}</span>

                  <span
                    class="type4"
                    v-if="(it.videoSource == 1 && it.recordId==0)|| (it.liveStatus ==='END' && it.liveRecordId==0)"
                  >未上传视频</span>
                  <span v-if="it.isListen && !hasBuyCourse" class="type1">试看</span>
                  <span v-if="it.liveStatus ==='PROCESSING'" class="type2">直播中</span>
                  <span v-if="it.liveStatus ==='NOT_STARTED'" class="type3">未开始</span>
                  <span v-if="it.liveStatus ==='END' && it.liveRecordId" class="type1">回放</span>
                </div>
              </div>
              <div class="iconBox">
                <!-- <i v-if="it.hasFile" class="iconfont iconfujian"></i> -->
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </van-tab>
      <van-tab title="讨论" v-if="isLive">
        <!-- <van-tab title="讨论" v-if="true"> -->
        <div class="chatBox">
          <div ref="chatList" @scroll="onChatListScroll" class="chatsList" id="zsChatsList">
            <div ref="chatsWrap" class="chats-list-wrap">
              <div class="oneChat" v-for="(item,index) in chatChildList" :key="index">
                <div class="userName">{{item.sender}} :</div>
                <p class="userSay" v-html="item.richtext"></p>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div class="mask" v-if="showMask" @click="clickMask"></div>
    <div class="sendChatsBox" v-if="active===2">
      <!-- <input placeholder="我也来说两句..." ref="chatInput" v-model="chatInfo" style="width:70%"/> -->
      <div class="defaultBtn" v-if="!showBtnsBox" @click="openBtnsBox">我也来说两句...</div>
      <div class="btnsBox" v-if="showBtnsBox">
        <van-field v-model="chatInfo" placeholder="我也来说两句..." style="width:60%" ref="chatInput" />
        <img class="emojiBtn" src="@/assets/face.jpg" alt @click="openEmojiBox" />
        <van-button
          type="primary"
          @click="sendChatInfo"
          style="width:20%"
          color="rgba(255, 120, 71, 1)"
          :disabled="!canSendMsg"
        >发送 {{!canSendMsg?sendCount:""}}</van-button>
      </div>
      <div class="emojiBox" v-if="showEmojiBox">
        <ul>
          <li v-for="(item, index) in emojiList" :key="index" @click="selectEmoji(item)">
            <img :src="item.url" :alt="item.zh_CN" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
let vue = new Vue();
import { Toast } from "vant";
Vue.use(Toast);

import PlayerBL from "@/components/playerBL";
import PlayerZS from "@/components/playerZS";
import { METHODS } from "http";
import emoji from "@/assets/gs-emoji.js";

export default {
  name: "learnDetail",
  data() {
    return {
      active: 2, // tab选项卡默认激活
      activeNames: ["1"], // 折叠面板默认展开第几个
      videoType: 1, // 头部视频框, 1封面图片, 2保利威视录播, 3展示互动录播, 4展示互动直播(等后端配置,确定展示互动的录播和直播是否共用一个组件)
      configBl: {}, // 保利威视录播配置信息
      configZs: {}, // 展示互动录播配置信息
      coverImg:
        "http://hq-expert.oss-cn-shenzhen.aliyuncs.com/hangjia/v2/image/123529-106-qb1qq2zxkdy404k.jpg",
      token: vue.$factory.getcookiesInClient("token"),
      courseData: {}, // 课程章节列表
      courseIntroduce: {}, // 课程介绍等信息
      goodsId: this.$route.query.goodsId || "729", // 商品id
      courseId: "", // 课程id
      hasBuyCourse: false, // 是否已经购买课程
      isLive: false,
      chatInfo: "",
      chatList: this.$store.state.chatList,
      chatmsg: {},
      chatChildList: [],
      userInfo: this.$factory.getInfo("userInfo"),
      canSendMsg: true, //按钮倒计时, 防止刷屏
      sendCount: 10,
      emojiList: emoji.list.map((i, index) => {
        const rowNum = 12;
        const rowCount = Math.floor(emoji.list.length / rowNum);
        const lastRowStartIndex = rowNum * rowCount;
        i.isBottom = index >= lastRowStartIndex ? true : false;
        i.isRight = (index + 1) % rowNum === 0;
        if (i.url.indexOf("http") === -1) {
          i.url = emoji.prefix + i.url;
        }
        return i;
      }),
      showEmojiBox: false,
      showMask: false,
      showBtnsBox: false
    };
  },
  components: {
    PlayerBL,
    PlayerZS
  },
  watch: {
    chatChildList(newVal) {
      // 当长度达到指定最大长度，则移除一部分
      const maxLen = 200;
      const removeLen = 50;
      if (newVal.length > maxLen) {
        this.$nextTick(() => {
          this.chatChildList.splice(0, removeLen);
        });
      }
    },
    active(newVal) {
      console.log(newVal);
      if (newVal === 2) {
        this.chatsScrollToTop();
      }
    }
  },
  // created() {
  //   let token =
  //     localStorage.getItem("userToken") ||
  //     vue.$factory.getcookiesInClient("token") ||
  //     false;

  //   this.$fetch(`/authBaseUrl/api/userInfo?token=${token}`).then(data => {
  //     // console.log(data);
  //     if (data && data.code != 200) {
  //       this.$router.push({
  //         name: "replaceLogin",
  //         query: {
  //           goodsId: this.$route.query.goodsId
  //         }
  //       });
  //     }
  //   });
  // },
  mounted() {
    this.getCourseList();
    this.getCourseIntroduce();
    // console.log(this.emojiList);
    //   console.log(this.transfromEmoji("【赞同】【鼓掌】123"));
    // console.log("用户信息", this.userInfo);
    // console.log(this.$store.state.chatList);

    // let stremoji = "【赞同】【鼓掌】123";
    // let regEmoji = /\【[\u4E00-\u9FA5]{1,4}\】/gi;
    // let _this = this;
    // let testIT = stremoji.replace(regEmoji, function(a, b, c) {
    //     let template = ''
    //    _this.emojiList.forEach((item, index) => {
    //     if (item.zh_CN == a) {
    //       // alert("1")
    //      template = `<img src=${item.url} alt=${item.zh_CN}>`
    //     }
    //   });
    //   return template
    // });
  },
  methods: {
    // 样式, 标题长度限制
    textEllipsis(info) {
      if (info && info.length !== 0) {
        return info.length > 18 ? info.slice(0, 18) + "..." : info;
      } else {
        return "";
      }
    },

    // 样式, 标题长度限制
    textEllipsis2(info) {
      if (info && info.length !== 0) {
        return info.length > 20 ? info.slice(0, 20) + "..." : info;
      } else {
        return "";
      }
    },
    // 直播时间格式化
    getTime(date) {
      if (date[5] > 0) {
        let two = date.slice(5, 16);
        let tt = two.replace(/-/g, "月");
        let newTime = this.insertStr(tt, 5, "日");
        return newTime;
      } else {
        let three = date.slice(6, 16);
        let hh = three.replace(/-/g, "月");
        let twoTime = this.insertStr(hh, 4, "日");
        return twoTime;
      }
    },

    // 直播结束时间截取
    endTimeSlice(time) {
      return time.slice(10, 16);
    },

    insertStr(soure, start, newStr) {
      return soure.slice(0, start) + newStr + soure.slice(start);
    },
    // 获取某个课程的章节列表
    getCourseList() {
      // 正式, 统一获取课程章节信息, 根据字段判断调用的播放器
      this.$fetch(
        `/hjBaseUrl/goods/api/h5/v1/school/getCourseRecordByGoodsId?goodsId=${this.goodsId}&token=${this.token}`
      ).then(data => {
        // console.log(data);
        if (data && data.code == 200) {
          this.courseData = data.result;
        } else {
          Toast("暂无相关章节信息");
        }
      });
    },
    // 获取课程介绍等信息
    getCourseIntroduce() {
      this.$fetch(
        `/hjBaseUrl/goods/api/h5/v1/goods/getGoodsDetailByGoodsId?goodsId=${this.goodsId}&token=${this.token}`
      ).then(data => {
        // console.log(data);
        if (data && data.code == 200) {
          this.courseIntroduce = data.result;
          this.courseId = data.result.courseId;
          this.hasBuyCourseFn();
          // console.log(this.courseIntroduce);
        } else {
          Toast("暂无相关课程信息");
        }
      });
    },
    // 判断是否已经购买课程
    hasBuyCourseFn() {
      // 判断是否已经购买课程
      this.$fetch(
        `/hjBaseUrl/order/api/h5/auth/order/getOrderVoExist?courseId=${this.courseId}&goodsId=${this.goodsId}`
      ).then(data => {
        if (data && data.code == 200 && data.result.pmOrderExist) {
          this.hasBuyCourse = true;
        }
      });
    },
    // 点击列表, 播放视频
    playVideo(info) {
      // console.log(info);
      // this.switchPlayer(info);
      this.courseData.map(item => {
        return item.list.map(item => {
          return (item.videoStatus = 0);
        });
      });
      // console.log(this.courseData);
      info.videoStatus = 1;
      // 判断视频是否可以试看
      if (info.isListen) {
        this.switchPlayer(info);
        return;
      }
      // 判断是否已经购买及后续交互
      if (this.hasBuyCourse) {
        this.switchPlayer(info);
        return;
      } else {
        // 提示信息
        Toast("请重新登录或者确认是否已经购买此课程");
        // setTimeout(() => {
        //   this.$router.push({ name: "studyCourse" });
        // }, 1000);
      }
    },
    // 切换播放器
    switchPlayer(info) {
      this.isLive = false;
      // 根据字段判断使用不同的播放器
      // 保利威视录播
      // console.log("1", info.videoSource == 2);

      if (info.videoSource == 1) {
        // 根据传入的vid和recordId获取加密信息token, 也就是playsafe
        if (info.videoAuditStatus === 60 || info.videoAuditStatus === 61) {
          if (info.vid && info.recordId && this.token) {
            this.$fetch(
              `/hjBaseUrl/goods/api/h5/auth/v1/polyvVideo/getToken?vid=${info.vid}&recordId=${info.recordId}&token=${this.token}`
            ).then(data => {
              if (data && data.code == 200) {
                this.configBl.vid = data.result.data.videoId;
                this.configBl.playsafe = data.result.data.token;
                this.configBl.ts = data.result.data.ts;
                this.configBl.sign = data.result.data.sign;
                this.configBl.recordId = data.result.data.recordId;

                // 刷新子组件
                this.videoType = 1;
                this.$nextTick(() => {
                  this.videoType = 2;
                });
                // goods/api/h5/auth/v1/logWatchRecord/add
                this.$post(
                  `/hjBaseUrl/goods/api/h5/auth/v1/logWatchRecord/add?isEnd=1&recordId=${info.recordId}&token=${this.token}`
                ).then(data => {});
              } else {
                Toast(data.msg);
              }
            });
          }
        } else {
          Toast("视频在编码转换中, 请稍后再试");
          return;
        }
      }

      // 展示互动录播直播
      if (info.videoSource == 2) {
        console.log(info.videoSource == 2);
        // 根据liveRoomId和liveType获取视频配置信息
        // 默认为直播
        let liveType = "live";
        let liveId = info.liveRoomId;
        this.configZs.videoDomName = "video-live";
        if (info.liveStatus) {
          if (info.liveStatus === "END") {
            liveType = "record";
            liveId = info.liveRecordId;
            this.configZs.videoDomName = "video-vod";
          } else if (info.liveStatus === "NOT_STARTED") {
            Toast("直播尚未开始");
            return;
          }
          // 判断是否展示聊天栏
          if (liveType === "live") {
            this.isLive = true;
            this.active = 2;
          }
          if (liveId && liveType && this.token) {
            if (!this.userInfo.uid) {
              this.$fetch(`/authBaseUrl/api/userInfo?token=${this.token}`).then(
                data => {
                  // console.log(data);
                  if (data.code === 200) {
                    this.userInfo = data.data;
                    localStorage.setItem("userInfo", JSON.stringify(data.data));
                    this.getGSPlayerConfig(liveId, liveType);
                  }
                }
              );
            } else {
              this.getGSPlayerConfig(liveId, liveType);
            }
          }
        }
      }
    },

    getGSPlayerConfig(liveId, liveType) {
      this.$fetch(
        `/hjBaseUrl/goods/api/h5/auth/v1/thirdPartyLiveCourse/studentEnterLiveRoom?liveRoomId=${liveId}&liveType=${liveType}&token=${this.token}`
      ).then(data => {
        if (data && data.code == 200) {
          // 配置传递给播放器的参数
          this.configZs.authcode = data.result.authcode;
          this.configZs.k = data.result.k;
          this.configZs.liveRoomUrl = data.result.liveRoomUrl;
          this.configZs.ownerid = data.result.ownerid;
          this.configZs.site = data.result.site;
          this.configZs.uname =
            this.userInfo.wxNickname || this.userInfo.nickName || "匿名用户";
          this.configZs.uid = Number(this.userInfo.uid) + 1000000000;
          console.log(this.userInfo);

          // 刷新子组件
          this.videoType = 1;
          this.$nextTick(() => {
            this.videoType = 3;
          });
        } else {
          Toast(data.msg);
        }
      });
    },
    // 用户滚动事件
    onChatListScroll() {
      this.isChatListScroll = true;
      clearTimeout(this.onChatListScrollTimer);
      this.onChatListScrollTimer = setTimeout(() => {
        this.isChatListScroll = false;
        this.chatsScrollToTop();
      }, 3e3);
    },
    // 聊天信息列表滚动
    chatsScrollToTop() {
      if (this.isChatListScroll) return;
      this.$nextTick(() => {
        if (this.$refs.chatList && this.$refs.chatList.scrollTo) {
          clearTimeout(this.chatsScrollTopTimer);
          this.chatsScrollTopTimer = setTimeout(() => {
            this.$refs.chatList.scrollTo(0, this.$refs.chatsWrap.offsetHeight);
          }, 500);
        }
      });
    },

    // 接收到公聊信息
    onChatData(data) {
      // console.log("data", data);
      this.chatChildList.push(data);
      this.chatsScrollToTop();
    },
    // 发送聊天信息
    sendChatInfo() {
      // console.log("聊天信息",this.chatInfo)
      this.chatInfo = this.chatInfo.trim();
      if (this.chatInfo) {
        if (this.chatInfo.length > 200) {
          Toast("请勿输入大于200字符的内容");
          return;
        }
        // console.log(this.chatInfo);
        // console.log(this.$refs.chatInput);
        // 正则替换表情文本
        this.chatInfo = this.transfromEmoji(this.chatInfo);
        console.log(this.chatInfo);
        // 在外层加一个div标签, 方便展示互动识别
        this.chatInfo = "<div>" + this.chatInfo + "</div>";

        // 开发用滚动测试
        let info = {
          sender:
            this.userInfo.wxNickname || this.userInfo.nickName || "匿名用户123",
          senderId: 2,
          senderUid: this.userInfo.uid || 3467734,
          content: "hi, how are you",
          richtext: "…..",
          sendRole: "1,2"
        };
        info.richtext = this.chatInfo;
        console.log(info);
        // info.content = chatDiv;

        // 自己发的公聊信息不会触发, 手动补充公聊信息
        this.chatChildList.push(info);

        // 展示互动发送公聊信息
        this.$refs.childzs.sendChatMsg(info);

        this.chatInfo = "";
        // console.log(this.$store.state.chatList);
        this.$refs.chatInput.blur();
        // 评论默认滚动到底部
        this.$nextTick(() => {
          this.$refs.chatList.scrollTo(0, this.$refs.chatsWrap.offsetHeight);
        });
        // this.canSendMsg = false;
        // 倒计时按钮
        // this.msgTimeout();
        // 关闭表情面板
        this.showEmojiBox = false;
        this.showMask = false;
        this.showBtnsBox = false;
      }
    },
    // 按钮倒计时
    msgTimeout() {
      if (this.sendCount > 0) {
        setTimeout(() => {
          this.sendCount = this.sendCount - 1;
          this.msgTimeout();
        }, 1000);
      } else {
        this.canSendMsg = true;
        this.sendCount = 10;
      }
    },
    // 开关表情面板
    openEmojiBox() {
      this.showEmojiBox = !this.showEmojiBox;
    },
    // 选择表情
    selectEmoji(item) {
      // console.log(item.zh_CN);
      // 待优化, 获取光标的位置
      this.chatInfo = this.chatInfo + item.zh_CN;
    },
    // 把文本替换为图片
    transfromEmoji(text) {
      // let stremoji = "【赞同】【鼓掌】123";
      let regEmoji = /\【[\u4E00-\u9FA5]{1,4}\】/gi;
      let _this = this;
      let res = text.replace(regEmoji, function(a, b, c) {
        let template = "";
        _this.emojiList.forEach((item, index) => {
          if (item.zh_CN == a) {
            template = `<img src="${item.url}" alt="${item.zh_CN}"/>`;
          }
        });
        return template;
      });
      // console.log(res)
      return res;
    },
    // 点击输入框外部, 关闭输入框
    clickMask() {
      this.showEmojiBox = false;
      this.showMask = false;
      this.showBtnsBox = false;
    },
    // 点击默认输入框, 打开输入框
    openBtnsBox() {
      this.showBtnsBox = true;
      this.showMask = true;
      this.$nextTick(() => {
        this.$refs.chatInput.focus();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.learnDetail {
  width: 100%;
  height: 100%;
  background: #fff;
  // position: relative;
  min-height: 480px;
  .videoBox {
    width: 100%;
    height: auto;
    min-height: 300px;
    // height: 500px;
    overflow: hidden;
    video {
      width: 100%;
      height: 100%;
    }
  }
  .intrduceBox {
    width: 100%;
    padding: 0px 30px;
    box-sizing: border-box;
    .title {
      font-size: 30px;
      font-family: PingFang SC;
    }
    .description {
      font-size: 26px;
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }
  }
  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 666;
    // background: #ccc;
    // opacity: 0.5;
  }
  .sendChatsBox {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    background: #fff;
    z-index: 99999;
    .defaultBtn {
      height: 100px;
      font-size: 28px;
      color: #999;
      line-height: 100px;
      padding: 0 50px;
      border-bottom: 1px solid #eee;
    }
    .btnsBox {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 10px;
      .emojiBtn {
        width: 70px;
      }
    }
    .emojiBox {
      width: 100%;
      height: 380px;
      // background: #ccc;
      border-top: 1px solid #eee;
      ul {
        width: 690px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 62px;
          height: 62px;
          margin: 5px 0;
          img {
            width: 58px;
          }
        }
      }
    }
  }
  /deep/ .van-cell__title {
    span {
      width: 80%;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  /deep/ .van-collapse-item__content {
    padding: 0;
  }
  /deep/ .van-tabs__line {
    display: none;
  }
  /deep/ .van-tab {
    height: 90px;
    line-height: 90px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
  }
  /deep/ .van-tabs__wrap {
    height: 90px;
  }
  /deep/ .van-tab--active {
    color: rgba(255, 120, 71, 1);
  }
}

.chapterList {
  display: flex;
  align-content: center;
  width: 100%;
  margin: 16px;
  .circlesBox {
    width: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
    .circles {
      width: 18px;
      height: 18px;
      display: inline-block;
      background: rgba(255, 120, 71, 1);
      border-radius: 50%;
    }
  }
  .chapterInfo {
    width: 78%;
    padding-bottom: 10px;
    .chapterTitle {
      margin-bottom: 6px;
      .text {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 38px;
        margin-left: 6px;
        &.active {
          color: rgba(255, 120, 71, 1);
        }
      }
    }
    .chapterTips {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 36px;
      .time {
        font-size: 22px;
        color: rgba(153, 153, 153, 1);
        margin-right: 20px;
      }
      .type1 {
        color: rgba(255, 120, 71, 1);
        padding: 2px 6px;
        border: 1px solid rgba(255, 120, 71, 1);
        border-radius: 5px;
        margin-right: 20px;
      }
      .type2 {
        color: white;
        padding: 4px 6px;
        background: rgba(255, 120, 71, 1);
        border-radius: 5px;
        margin-right: 20px;
      }
      .type3 {
        color: rgba(153, 153, 153, 1);
        padding: 2px 6px;
        border: 1px solid rgba(184, 184, 184, 1);
        border-radius: 5px;
        margin-right: 20px;
      }
      .type4 {
        margin-right: 20px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
  .iconBox {
    // height: 20px;
    width: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
    display: flex;
    align-items: center;
  }
}

.chatBox {
  background: #fff;
  height: calc(~"100vh - 750px");
  // overflow: hidden;
  .chatsList {
    width: 100%;
    height: calc(~"100vh - 750px");
    overflow-y: auto;
    // background: #ccc;
    .oneChat {
      width: 100%;
      height: auto;
      // height: 60px;
      line-height: 60px;
      font-size: 30px;
      box-sizing: border-box;
      padding: 0 50px;
      .userSay {
        width: 100%;
        height: auto;
        color: #666;
        word-wrap: break-word;
      }
    }
  }
}
</style>  

<style>
.description img {
  max-width: 100% !important;
  height: auto !important;
}
</style>

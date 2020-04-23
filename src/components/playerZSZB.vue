<!--
 * @Author: linweibin
 * @Description: 展示互动, 直播
 * @props: 
 * @event: 
 * @Date: 2019-10-21 09:16:17
 * @LastEditors: linweibin
 * @LastEditTime: 2019-11-15 13:12:42
 -->
<template>
  <div id="playerZSZB" style="width: 100%; height: 100%;">
    <!-- <gs:video-vod site="www.gensee.com" ownerid="f8625298d18042fbbba7a8d4f75555ca" uid="55831" uname="user5623" authcode="333333" group="testgroup"/> -->
    <!-- <gs:doc site="www.gensee.com" ownerid="f8625298d18042fbbba7a8d4f75555ca" group="testgroup"/> -->
    <!-- <gs:video-vod id="hangjia_sy_player_gs" site="192.168.0.168" ctx="webcast" ownerid="f8625298d18042fbbba7a8" uid="55831" uname="user5623" authcode="333333"/> -->
  </div>
</template>

<script>
export default {
  name: "playerZSZB",
  props: {
    configZszb: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.configZszb);
      // 展视互动 - 讲师视频
      const gsDom = document.createElement("gs:video-vod");
      gsDom.setAttribute("id", "hangjia_sy_player_gs");
      // gsDom.setAttribute('group', 'hangjia_sy_player_gs');
      gsDom.setAttribute("style", "width: 100%; height: 100%;");
      gsDom.setAttribute("bar", "true");
      // gsDom.setAttribute('ctx', 'webcast');
      gsDom.setAttribute("fullscreen", true);
      // gsDom.setAttribute('gsver', 2);
      // gsDom.setAttribute('py', 1);
      // gsDom.setAttribute('post', true);
      gsDom.setAttribute("site", "www.gensee.com");
      gsDom.setAttribute("uname", "user5623");
      gsDom.setAttribute("uid", "55831");
      gsDom.setAttribute("ownerid", "f8625298d18042fbbba7a8");
      gsDom.setAttribute("authcode", "333333");
      // gsDom.setAttribute('k', k);

      clearInterval(this.findGSDomTimer);
      this.findGSDomTimer = setInterval(() => {
        const dom = document.getElementById("playerZSBox");
        if (dom) {
          clearInterval(this.findGSDomTimer);
          dom.appendChild(gsDom);
          // window.GS.loadTag(gsConfig.videoDomName, gsDom);
        }
      }, 50);
    }
  }
};
</script>

<style lang='less' scoped>
</style>
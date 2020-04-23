<!--
 * @Author: 邓达
 * @Description: 
 * @props: 
 * @event: 
 * @Date: 2019-10-22 17:36:26
 * @LastEditors: 邓达
 * @LastEditTime: 2019-10-24 17:42:12
 -->
<template>
  <div class="home_div">
    <div class="content_div">
      <router-view />
    </div>
    <div class="footer_div">
      <van-tabbar route>
        <van-tabbar-item replace to="/studyCourse">
          <span
            slot="icon"
            slot-scope="props"
            class="iconfont"
            :class="props.active ? 'iconxuexi-xuanzhong' : 'iconxuexi-moren'"
          ></span>学习
        </van-tabbar-item>
        <van-tabbar-item replace to="/myLogin" icon="search">
          <span
            slot="icon"
            slot-scope="props"
            class="iconfont"
            :class="props.active ? 'iconwode-xuanzhong' : 'iconwode-moren'"
          ></span>我的
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang='less' scoped>
.home_div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  .content_div {
    flex: 1;
    overflow: hidden;
    // height: 100%;
    // margin-bottom: 93px;
  }
  .footer_div {
    // bottom: 0;
    // position: fixed;
    width: 100%;
    height: 100px;
    background: rgba(252, 253, 255, 0.98);
    .van-tabbar-item--active {
      color: #ff5a1f;
    }
  }
}
</style>
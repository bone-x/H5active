<template>
  <div class="studyInput">
    <div class="box">
      <p class="title">恭喜您已报名成功啦！</p>
      <p class="text1">如果未添加客服小姐姐的学员</p>
      <p class="text2">可长按识别二维码添加客服老师微信</p>
      <div class="QR">
        <img :src="decodeURIComponent(goodsCoverImages)" alt="qr" />
      </div>
      <p class="tip">和老师一起学习</p>
    </div>
  </div>
</template>

<script>
import piture from "@/assets/bgPic.jpg";

export default {
  name: "studyInput",
  data() {
    return {
      goodsCoverImages: ""
    };
  },
  mounted() {
    this.getGoodsDetail();
  },
  methods: {
    getGoodsDetail() {
      let { goodsId, userId } = this.$route.query;
      fetch(
        `/hjBaseUrl/goods/api/h5/v2/activityGoods/getGoodDetail?goodsId=${goodsId}&userId=${userId}`
      )
        .then(res => res.json())
        .then(data => {
          this.goodsCoverImages = data.result.customerServiceImages;
        });
    }
  }
};
</script>

<style lang='less' scoped>
.studyInput {
  background: url("../../assets/bgPic.jpg") no-repeat fixed top;
  background-size: 100% 100%;
  height: 100vh;

  .box {
    padding-top: 100px;
    width: 600px;
    height: 300px;
    p {
      text-align: center;
      margin-top: 10px;
      font-size: 32px;
    }
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -300px;
    .title {
      font-size: 40px;
      color: #ff7a47;
      margin: 50px 0 40px 0;
    }
    .text {
      font-size: 32px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      width: 100%;
    }
    .QR {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      padding: 10px 0;
      img {
        width: 310px;
        height: 317px;
      }
    }

    .text3 {
      span {
        color: rgba(255, 122, 71, 1);
      }
    }
  }
}
</style>
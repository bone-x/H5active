<!--
 * @Author: linweibin
 * @Description: 价格展示, 购买按钮
 * @props: 
 * @event: 
 * @Date: 2019-10-09 11:26:47
 * @LastEditors: linweibin
 * @LastEditTime: 2019-10-10 10:17:03
 -->
<template>
  <section class="ButtonsBox">
    <div class="priceInfo" @click="getFree()">
      <div>
        <i v-show="!!priceDate.buyPrice">¥</i>
        <span>{{priceDate.buyPrice===0?"免费":priceDate.buyPrice}}</span>
        <del>原价{{priceDate.originalPrice}}</del>
      </div>
      <p v-show="!!priceDate.buyPrice&&!!priceDate.discount">{{priceDate.isDiscount?'已':'点击'}}领取{{priceDate.discount}}元优惠券</p>
    </div>
    <div class="buyBtn" @click="goToBuy" >购买课程</div>
  </section>
</template> 
<script>
export default {
  name: "PriceAndBuy",
  props: {
    priceDate: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    goToBuy() {
      this.$emit("on-buyCourse", '我就是参数');
    },
    // 获取免费的优惠券
    getFree() {
      this.$emit("hotPart");
    }
  },
  data() {
    return {};
  }
};
</script>     
<style lang="less" scoped>
.ButtonsBox {
  width: 100%;
  height: 130px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -10px 11px 0px rgba(50, 50, 50, 0.07);
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .priceInfo {
    width: 315px;
    div {
      i {
        font-style: normal;
        font-size: 24px;
      }
      span {
        font-size: 46px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        margin: 0 8px 0 5px;
        // line-height: 50px;
      }
      del {
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        text-decoration: line-through;
        color: rgba(102, 102, 102, 1);
        // line-height: 50px;
      }
    }
    p {
      font-size: 22px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(255, 120, 71, 1);
      //   line-height: 50px;
      margin: 0;
    }
  }
  .buyBtn {
    width: 316px;
    height: 90px;
    background: rgba(253, 62, 76, 1);
    border-radius: 10px;
    text-align: center;
    font-size: 32px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 90px;
    &.active{
        background:#aaa;
    }
  }
}
</style>  
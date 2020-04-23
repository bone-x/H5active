<!--
 * @Author: 邓达
 * @Description: 
 * @props: 
 * @event: 
 * @Date: 2019-10-23 10:49:50
 * @LastEditors: 邓达
 * @LastEditTime: 2019-11-13 14:09:12
 -->
<template>
  <div class="orderCard">
    <div class="order_header">
      <span>订单号：{{orderDetail.code}}</span>
      <!-- <span>20182828282882</span> -->
      <span class="status_span">{{orderDetail.status | formatStatus}}</span>
    </div>
    <div class="order_content" v-for="(item,index) in orderDetail.detailList" :key="index">
      <div class="left_box">
        <img
          :src="$factory.formatImg(item.goodsImage)"
          alt
          width="100%"
          height="100%"
          @error="imageLoadError"
        />
      </div>
      <div class="right_box">
        <p class="name_box">{{item.goodsName}}</p>
        <p class="price_box">￥ {{item.goodsPrice}}</p>
      </div>
    </div>
    <div class="order_footer">
      <span class="date_span">{{orderDetail.endTime}}</span>
      <span>
        实付金额：￥
        <span class="total_price">{{orderDetail.totalFee}}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderCard",
  props: {
    orderDetail: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      defaultImg:
        "https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/default-image.png"
    };
  },
  filters: {
    formatStatus(value) {
      switch (value) {
        case 3:
          return "交易完成";
          break;
        default:
          break;
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    imageLoadError: function(e) {
      e.target.src = this.defaultImg;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang='less' scoped>
.orderCard {
  margin-bottom: 18px;

  //   width: 100%;
  //   height: 338px;
  background: rgba(255, 255, 255, 1);
  padding: 30px 36px;
  .order_header {
    height: 40px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    position: relative;
    display: flex;
    justify-content: space-between;
    // .status_span {
    //   position: absolute;
    //   right: 0;
    // }
  }
  .order_content {
    padding: 12px 0 24px;
    display: flex;
    // height: 216px;
    .left_box {
      overflow: hidden;
      width: 300px;
      height: 168px;
      border-radius: 4px;
    }
    .right_box {
      flex: 1;
      margin-left: 17px;
      > p {
        width: 100%;
        word-wrap: break-word;
        word-break: normal;
      }
      .name_box {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .price_box {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .order_footer {
    // vertical-align: bottom;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    display: flex;
    justify-content: space-between;
    .total_price {
      font-size: 32px;
    }
    .date_span {
      height: 100%;
      line-height: 2.2;

      // font-size: 28px;
    }
  }
  //   height: 100%;
}
</style>
<!--
 * @Author: 邓达
 * @Description: 
 * @props: 
 * @event: 
 * @Date: 2019-10-23 10:49:50
 * @LastEditors: 邓达
 * @LastEditTime: 2019-11-07 17:17:17
 -->
<template>
  <div class="myOrder_div">
    <van-list
      v-model="loading"
      :finished="finished"
      @load="getList"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      v-show="!isEmpty"
    >
      <div v-for="(item,index) in list" :key="index" class="list_item">
        <orderCard :orderDetail="item" />
      </div>
    </van-list>
    <div class="empty_div" v-show="isEmpty">
      <img
        src="https://hq-expert-online-school.oss-cn-shenzhen.aliyuncs.com/demo_img/empty-shopcar.png"
        width="50%"
      />
    </div>
  </div>
</template>

<script>
import orderCard from "@/components/orderCard";

export default {
  name: "myOrder",
  components: {
    orderCard
  },
  data() {
    return {
      token: "811a6a658000016df6bde6af84000090",
      loading: false,
      finished: false,
      error: false,
      list: [],
      pageNum: 1,
      isFrist: true,
      isEmpty: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    getList() {
      if (this.$factory.getcookiesInClient("token")) {
        this.$fetch(
          `/hjBaseUrl/order/api/h5/auth/activityOrder/getOrderLists`,
          {
            pageNum: this.pageNum,
            payStatus: 3
          }
        ).then(response => {
          console.log(response);
          const { result } = response;
          if (result.list.length > 0) {
            this.list = [...this.list, ...result.list];
            this.pageNum = this.pageNum + 1;
          } else {
            if (this.pageNum == 1) {
              this.isEmpty = true;
            }
            this.finished = true;
          }
          this.loading = false;
        });
      } else {
        this.isEmpty = true;
      }
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang='less' scoped>
.myOrder_div {
  width: 100%;
  height: auto;
  background: #f2f2f2;
  .vant_list {
    background: #f2f2f2;
  }
  .list_item {
  }
  .empty_div {
    width: 100%;
    height: 100vh;
    text-align: center;
    padding-top: 30%;
    img {
    }
  }
}
</style>
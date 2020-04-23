<!--
 * @Author: 邓达
 * @Description: 
 * @props: 
 * @event: 
 * @Date: 2019-10-23 15:50:53
 * @LastEditors: 邓达
 * @LastEditTime: 2019-11-13 13:39:04
 -->
<template>
  <div class="studyCourse">
    <div class="header">
      <span class="allCourse" @click="activeAll" :class="allStatus?'textAct':''">全部</span>
      <span class="filterTime" @click="activeStudy" :class="timeStatus?'textAct':''">
        按学习时间
        <div class="sort-order">
          <i class="sort-order-item" :class="timeStatus?isStyle?'asc':'ascAct':'asc'"></i>
          <i class="sort-order-item" :class="timeStatus?isStyle?'active':'desc':'desc'"></i>
        </div>
      </span>
      <span class="filterJoin" @click="activeJoin" :class="joinStatus?'textAct':''">
        按加入时间
        <div class="sort-order">
          <i class="sort-order-item" :class="joinStatus?isActive?'asc':'ascAct':'asc'"></i>
          <i class="sort-order-item" :class="joinStatus?isActive?'active':'desc':'desc'"></i>
        </div>
      </span>
      <span class="icon" @click="openBox">
        <i class="iconfont iconshaixuan"></i>
      </span>
    </div>

    <div class="content">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div
          class="course"
          v-for="(item,index) in list"
          :key="index"
          @click="goCourse(item.hjGoodId)"
        >
          <!-- {{item }} -->
          <span class="position">
            <img :src="decodeURIComponent(item.coursePic)" alt="课程图片" />
            <div class="shadow" v-show="item.hasProcessing===1">
              <i class="iconfont iconPCbofangye_paihangbang"></i>
              <span>直播中</span>
            </div>
          </span>

          <div class="text">
            <span>{{item.courseName}}</span>
            <p>已学习{{item.watchRecordNum}}/{{item.totalRecordNum}}课时</p>
          </div>
        </div>
      </van-list>
    </div>

    <div class="box" v-show="isBox">
      <p :class="boxAll?'textColor':''" @click="allCourse">全部</p>
      <p :class="!boxAll?'textColor':''" @click="payCourse">付费</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "studyCourse",
  data() {
    return {
      isBox: false, // 弹窗的展示
      isActive: false, // 控制加入时间的上下箭头
      isStyle: false, // 控制学习时间的上下箭头
      allStatus: true, // 全部的样式状态维护
      timeStatus: false, // 学习时间样式状态
      joinStatus: false, // 加入时间样式状态
      boxAll: true, // 弹窗的筛选样式
      list: [],
      loading: false,
      finished: false,
      riseOrFall: 1, // 升降排序 1:降序(默认) 2:升序
      queryType: 1, // 条件查询 1:全部 2:付费 3:即将过期 4:已过期
      orderType: "", //排序 1:按学习时间 2:按加入时间 3:全部的状态不传
      page: 0, // 页数
      token: ""
    };
  },
  mounted() {
    this.token = this.$factory.getcookiesInClient("token");
    // localStorage.setItem("userToken", this.token);
    // 兼容[iphone6]
    if (this.list.length === 0) {
      this.init();
    }
  },
  methods: {
    getCourseList() {
      this.$fetch(
        `/hjBaseUrl/goods/api/h5/auth/v2/activityGoods/courseList?riseOrFall=${this.riseOrFall}&queryType=${this.queryType}&orderType=${this.orderType}&limit=10&page=${this.page}&token=${this.token}`
      ).then(data => {
        const list = data.result.list;
        // 数据全部加载完成
        if (list.length > 0) {
          this.list = this.list.concat(list);
        } else {
          this.finished = true;
        }
        this.loading = false;
      });
    },
    // 跳转课程详情
    goCourse(id) {
      this.$router.push({ name: "learnDetail", query: { goodsId: id } });
    },
    // 自动完成执行
    onLoad() {
      this.page += 1;
      if (this.token) {
        this.$fetch(
          `/hjBaseUrl/goods/api/h5/auth/v2/activityGoods/courseList?riseOrFall=${this.riseOrFall}&queryType=${this.queryType}&orderType=${this.orderType}&limit=10&page=${this.page}&token=${this.token}`
        ).then(data => {
          const list = data.result.list;
          // 数据全部加载完成
          if (list.length > 0) {
            this.list = this.list.concat(list);
          } else {
            this.finished = true;
          }
          this.loading = false;
        });
      } else {
        this.finished = true;
        this.loading = false;
      }
    },
    openBox() {
      this.isBox = !this.isBox;
    },
    // 加入时间排序cnp
    activeJoin() {
      this.isActive = !this.isActive;
      this.joinStatus = true;
      this.timeStatus = false;
      this.allStatus = false;
      this.orderType = 2;
      if (this.isActive) {
        this.riseOrFall = 1;
      } else {
        this.riseOrFall = 2;
      }
      this.init();
    },
    // 学习时间排序
    activeStudy() {
      this.isStyle = !this.isStyle;
      this.timeStatus = true;
      this.allStatus = false;
      this.joinStatus = false;
      this.orderType = 1;
      if (this.isStyle) {
        this.riseOrFall = 1;
      } else {
        this.riseOrFall = 2;
      }
      this.init();
    },
    activeAll() {
      this.init();
      this.allStatus = true;
      this.joinStatus = false;
      this.timeStatus = false;
    },
    // 弹窗全部
    allCourse() {
      this.boxAll = true;
      this.queryType = 1;
      this.init();
      this.isBox = false;
    },
    // 弹窗付费
    payCourse() {
      this.boxAll = false;
      this.queryType = 2;
      this.isBox = false;
      this.init();
    },
    // 课程初始化
    init() {
      this.list = [];
      this.page = 1;
      this.getCourseList();
    }
  }
};
</script>

<style lang='less' scoped>
.studyCourse {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .header {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    height: 90px;
    padding: 30px 0 12px 0;
    color: rgba(102, 102, 102, 1);
    display: flex;
    justify-content: space-around;
    font-size: 24px;
    .textAct {
      color: #ff5a1f;
    }
    span {
      display: inline-block;
      border-radius: 24px;
      background: rgba(242, 242, 242, 1);
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      text-align: center;
      line-height: 48px;
    }
    .allCourse {
      width: 132px;
      height: 48px;
      // margin: 0 18px 0 36px;
    }
    .filterTime,
    .filterJoin {
      width: 204px;
      height: 48px;
      position: relative;
    }
    .filterJoin {
      // margin-left: 18px;
    }
    .icon {
      width: 78px;
      height: 48px;
      font-size: 32px;
      // margin: 0 36px 0 18px;
      & i {
        font-size: 32px;
      }
    }
  }

  .content {
    // margin-top: 90px;
    width: 100%;
    flex: 1;
    overflow: scroll;
    .course {
      width: 680px;
      height: 216px;
      padding: 24px 34px 0 36px;
      display: flex;
      flex-direction: row;
      .position {
        position: relative;
        display: inline-block;
        height: 168px;
        height: 300px;
        img {
          width: 300px;
          height: 168px;
          display: inline-block;
          margin-right: 18px;
          border-radius: 4px;
        }
        .shadow {
          position: absolute;
          left: 0;
          top: 122px;
          z-index: 0.9;
          width: 300px;
          height: 46px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 254, 255, 1);
          line-height: 46px;
          & i {
            font-size: 22px;
            display: inline-block;
            margin: 0 10px 0 15px;
          }
        }
      }
      .text {
        width: 362px;
        height: 168px;
        span:first-child {
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        p {
          margin-top: 20px;
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
      }
    }
  }

  .box {
    width: 100%;
    height: 200px;
    position: fixed;
    top: 90px;
    left: 0;
    text-align: center;
    background-color: #fff;
    border-bottom: 2px solid #ddd;
    border-radius: 4px;
    padding: 6px 0 18px 0;
    .textColor {
      color: #ff5a1f;
    }
    p {
      width: 100%;
      height: 96px;
      line-height: 96px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }

  .sort-order {
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // width: 24px;
    // vertical-align: middle;
    // cursor: pointer;
    // overflow: initial;
    position: absolute;
    left: 164px;
    bottom: 46px;
    // left: 164px;
    // top: -48px;

    .sort-order-item {
      width: 0;
      height: 0;
      border: 10px solid transparent;
      position: absolute;

      &.asc {
        border-bottom-color: #c0c4cc;
        top: 2px;
      }

      &.desc {
        border-top-color: #c0c4cc;
        top: 25px;
      }
      &.active {
        border-top-color: #ff5a1f;
        top: 25px;
      }
      &.topActive {
        border-bottom-color: #ff5a1f;
        top: 2px;
      }
    }

    // &.order-asc {
    //   .asc {
    //     border-bottom-color: #ff5a1f;
    //     top: 2px;
    //   }
    // }

    // &.order-desc {
    //   .desc {
    //     border-top-color: #ff5a1f;
    //     top: 25px;
    //   }
    // }
    .active {
      border-top-color: #ff5a1f;
      top: 25px;
    }
    .desc {
      border-top-color: #c0c4cc;
      top: 25px;
    }
    .asc {
      border-bottom-color: #c0c4cc;
      top: 2px;
    }
    .ascAct {
      border-bottom-color: #ff5a1f;
      top: 2px;
    }
  }
}
</style>
<template>
  <div class="studyInput">
    <div class="box">
        <p class="title">最后一步</p>
        <p class=" text text1">您已绑定手机号{{$route.query.mobile}},</p>
        <p class=" text text2">稍后客服会与您联系,</p>
        <p class=" text text3">或者联系我们的客服 <span>13192149418</span></p>
    </div>
  
  </div>
</template>

<script>
import piture from "@/assets/bgPic.jpg";
export default {
  name: "lastWay",
  data() {
    return {};
  }
};
</script>

<style lang='less' scoped>
.studyInput {
  background:url('../../assets/bgPic.jpg') no-repeat fixed top;
  background-size:100% 100%;
  height:100vh;
  
  .box{
      padding-top:100px;
      width:600px;
      height:300px;
      p{
          text-align:center;
          margin-top:10px;
      }
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -300px;
   .title{
       font-size:40px;
       color:#FF7A47;
       margin:50px 0 40px 0;
    }
  .text {
    font-size: 32px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
  }
  
    .text3 {
        span {
        color: rgba(255, 122, 71, 1);
        }
    }
  }

}
</style>
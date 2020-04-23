<!--
 * @Author: 邓达
 * @Description: 
 * @props: 
 * @event: 
 * @Date: 2019-10-22 14:22:43
 * @LastEditors: 邓达
 * @LastEditTime: 2019-10-22 17:53:42
 -->
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>

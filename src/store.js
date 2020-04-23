/*
 * @Author: linweibin
 * @Description: 评论功能
 * @props: 
 * @event: 
 * @Date: 2019-11-14 09:20:20
 * @LastEditors: linweibin
 * @LastEditTime: 2019-11-14 18:09:52
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chatList: [
      // {
      //   sender: "无名氏",
      //   senderId: 2,
      //   senderUid: 3467734,
      //   content: "言语就像风",
      //   richtext: "…..",
      //   sendRole: "1,2"
      // },
      // {
      //   sender: "无名氏",
      //   senderId: 2,
      //   senderUid: 346773466,
      //   content: "沉默是君王之友",
      //   richtext: "…..",
      //   sendRole: "1,2"
      // }
    ],
    newChatInfo: {}
  },
  mutations: {
    changeList(state,data){
     
      if(data){
        state.chatList=[...state.chatList,...data];
        console.log(state.chatList)
      }
    }
  },
  actions: {
    
  }
})

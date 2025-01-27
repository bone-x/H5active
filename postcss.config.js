/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2019-10-24 14:41:57
 * @LastEditors: linweibin
 * @LastEditTime: 2019-10-25 10:36:30
 */
const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");

module.exports = ({ file }) => {
  let rootValue;
  // vant 37.5 [link](https://github.com/youzan/vant/issues/1181)
  if (file && file.dirname && file.dirname.indexOf("vant") > -1) {
    rootValue = 37.5;
  } else {
    rootValue = 75;
  }
  return {
    plugins: [
      autoprefixer(),
      pxtorem({
        rootValue: rootValue,
        propList: ["*"],
        minPixelValue: 2
      })
    ]
  };
};

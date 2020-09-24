/*
 * @Author: gaigai
 * @Date: 2019-10-11 19:19:58
 * @LastEditors  : gaigai
 * @LastEditTime : 2020-09-24 19:54:36
 * @Description:
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 */
module.exports = {
  // 将 ESLint 限制到一个特定的项目，在配置文件里设置 "root": true。ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,
  // 检测ES6代码
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  //
  env: {
    browser: true
  },
  // 消除no-undef影响
  globals: {
    _: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ["airbnb"],
  // required to lint *.vue files
  plugins: ["vue", "html"]
};

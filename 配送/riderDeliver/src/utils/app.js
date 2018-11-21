import util from '../utils/util'
//判断是否登录
let is_login = () => {
  let timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  let user = wx.getStorageSync('loginInfo');
  if (user.expires_in > timestamp) {
    return;
  } else {
    console.log("未登录")
    util.toPages('nT', './login')
  }
}
module.exports = {
  is_login: is_login
}

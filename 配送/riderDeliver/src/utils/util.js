import api from "../api/api"
import timer from '../utils/wxTimer'
//验证是否是手机号码
function vailPhone(number) {
  let flag = false;
  let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (number.length != 11) {
    flag = flag;
  } else if (!myreg.test(number)) {
    flag = flag;
  } else {
    flag = true;
  }
  return flag;
}
//封装toast提示
function toast(title, success) {
  wx.showToast({
    title: title,
    icon: success || 'none',
    duration: 900,
    mask: false,
  });
}
//get请求
function requstGet(url, data, is_token) {
  return requst(url, 'GET', data, is_token)
}
//post请求
function requstPost(url, data, is_token) {
  return requst(url, 'POST', data, is_token)
}
//封装请求接口
function requst(url, method, data = {}, is_token) {
  wx.showNavigationBarLoading()
  // data.method = method
  let header = null;
  if (is_token) {
    let loginInfo = wx.getStorageSync("loginInfo");
    let token = loginInfo.token;
    //header变化
    header = {
      'Accept': 'application/vnd.lingmo.v1+json',
      'Authorization': 'Bearer ' + token,
      'sandbox': 'true'
    }
  } else {
    header = {
      'Accept': 'application/vnd.lingmo.v1+json',
      'sandbox': 'true'
    }
  }
  return new Promise((resove, reject) => {
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        wx.hideNavigationBarLoading()
        resove(res.data)
      },
      fail: function (msg) {
        console.log('reqest error', msg)
        wx.hideNavigationBarLoading()
        reject('fail')
      }
    })
  })
}
//封装跳转
function toPages(options, url, num) {
  if (options == 'nT') {
    wx.navigateTo({
      url: url
    });
  } else if (options == 'rT') {
    wx.redirectTo({
      url: url
    });
  } else if (options == 'sT') {
    wx.switchTab({
      url: url
    });
  } else {
    wx.navigateBack({
      delta: num
    });
  }
}
//封装存储storage
function set(key, data) {
  wx.setStorage({
    key: key,
    data: data
  });
}
module.exports = {
  vailPhone: vailPhone,
  toast: toast,
  get: requstGet,
  post: requstPost,
  toPages: toPages,
  set: set
}

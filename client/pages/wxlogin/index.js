const App = getApp()
Page({

  onLoad:function(){
    var value = wx.getStorageSync('userInfo');
    if (value) {
      wx.redirectTo({
        url: '../0/0',
      })
    }
  },

  getUserInfo(e) {

    let userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', userInfo)
    if (userInfo) {
      wx.redirectTo({
        url: '../0/0',
      })
    }

  }
});

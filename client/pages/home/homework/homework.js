// findwork/b/b.js
const app = getApp();
var chazhao = require("./find.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ident:"",
    objectArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 1000
    })

    var that = this;
    that.setData({
      ident:app.cur_class.ident
    })
    var condition = "classid="+app.cur_class.id;
    var i = 0;
    var chead = "head,settime,content,openid,deadline"
    chazhao.find("homework_issue", chead, condition).then(
      function (res) {
        console.log(res[0]);
        while (res[i] != null) {
          that.data.objectArray = [{ id: res[i], name: i }].concat(that.data.objectArray);
          that.setData({
            objectArray: that.data.objectArray
          })
          i += 5;
        }
      }
    )
  },

  //跳转页面
  goto: function (e) {
    console.log(e.currentTarget.dataset.name)
    if (app.cur_class.ident === "student" || app.cur_class.ident === "assistant") {
      wx.navigateTo({
        url: './homework_submit/homework_submit?elem=' + e.currentTarget.dataset.name,
      })
    }
    else if (app.cur_class.ident === "teacher" || app.cur_class.ident === "founder") {
      wx.navigateTo({
        url: './submit_detail/detail?elem=' + e.currentTarget.dataset.name,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
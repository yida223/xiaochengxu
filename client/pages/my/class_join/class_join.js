// pages/my/class_join/class_join.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      classid:"",
      name:"",
      major:"",
      intro:"",
      num:"",
      ident:""
  },
  openToast: function () {
    wx.showToast({
      title: '已申请',
      icon: 'success',
      duration: 3000
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
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
        var that = this;
        console.log(app.cur_class)
        mysql.find("classes","name,intro,major,num","classid="+app.cur_class.id).then(res=>{
          console.log(res)
          that.setData({
            classid:app.cur_class.id,
            name:res[0],
            intro:res[1],
            major:res[2],
            num:res[3],
            ident:app.cur_class.ident
          })
        })
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
  
  },

  create:function(){
    wx.navigateTo({
      url: "./detail?option=create",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  join: function () {
    wx.navigateTo({
      url: "./detail?option=join",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  del:function(){
    mysql.del("classes","classid="+app.cur_class.id).then(()=>{
      mysql.del("class_ident", "classid=" + app.cur_class.id).then(res=>{
        mysql.update("user_info", "latelyclass=" + app.cur_class.id,"latelyclass=0").then(res=>{
          console.log(res);
          wx.redirectTo({
            url: '../../mxlogin/index',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        })
      })
    })
  },

  exit:function(){
    mysql.del("class_ident", "classid=" + app.cur_class.id+" AND openid='"+app.openid+"'").then(res => {
      console.log(res)
      mysql.update("user_info", "openid='" + app.openid+"'", "latelyclass=0").then(res => {
        console.log(res);
        wx.redirectTo({
          url: '../../0/0',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      })
    })
    
  }
})
// pages/home/tongzhi/tongzhi_detail/detail.js
var app = getApp();
var mysql = require("../../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
        head:"",
        person:"",
        settime:"",
        content:"",
        imagepath:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var time = options.time;
      console.log(time);
      mysql.find("class_inform","imagepath","classid="+app.cur_class.id+" AND settime='"+time+"'").then(res=>{
        console.log(res)
        mysql.file_download(res[0]).then(r=>{
          that.setData({
            head: options.head,
            person: options.person,
            settime: options.settime,
            content: options.content,
            imagepath: r
          });
        })
      })
      
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
  
  },

  prev:function(){
    var that =this;
    var path = [];
    path.push(that.data.imagepath)
    console.log(that.data.imagepath)
    wx.previewImage({
      urls: path,
    })
  }
})
// pages/home/tongzhi/tongzhi.js
var app = getApp();
var mysql = require("../../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tmppath:"../../../../image/camera.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tmppath:res.tempFilePaths[0]
        });
      }
    })
  },
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
  openToast: function () {
    wx.showToast({
      title: '已建立',
      icon: 'success',
      duration: 3000
    });
  },

  submit:function(e){
    var that =this;
      console.log(e);
      var a = e.detail.value;
      var time = mysql.getTime();
      mysql.insert("class_inform","(classid,settime,head,content,openid)value("+app.cur_class.id+",'"+time+"','"+a.head+"','"+a.content+"','"+app.openid+"')").then(res=>{
        console.log(res);
        mysql.img_upload(that.data.tmppath,"class_inform",{settime:time}).then(r=>{
          wx.showToast({
            title: '发布成功',
            icon: 'success',
          });
          setTimeout(function(){
            wx.navigateBack({
              
            })
          },1500)
        })
      })
  }
})
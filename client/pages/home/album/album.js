// pages/album/album.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albums: [],
    ident: app.cur_class.ident
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 700
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
    var that = this;


    mysql.find("class_album", "name,settime,intro,imagepath", "classid=" + app.cur_class.id).then(res => {
      console.log(res);
      if(res && res[0])
      {
      var num = res.length / 4;
      var albums = [];
      console.log(res);
        var multi_download = function(res,num) 
        {
          if(num===0)
            return;
          var item = {};
          item.name = res[(num-1) * 4 + 0];
          //settime只需要年月日
          var str = "";
          var temp = "";
          console.log((num-1))
          console.log(res[(num-1) * 4 + 1])
          temp = res[(num-1) * 4 + 1].split('_')[0]
          str += temp.slice(0, 4) + "/" + temp.slice(4, 6) + "/" + temp.slice(6, 8);
          item.settime = str;
          item.intro = res[(num-1) * 4 + 2];
          console.log(res)
          mysql.file_download(res[(num-1) * 4 + 3]).then(r => {
            console.log(r);
            var item2 = {};
            item2.name = item.name;
            item2.settime = item.settime;
            item2.intro = item.intro;

            item2.imagepath = r;
            console.log(item2)
            albums.push(item2);
            multi_download(res,num-1)
          });
        }
      multi_download(res,num);

      var a = setInterval(function () {
        console.log(albums)
        that.setData({
          albums: albums
        });
        if (albums.length >= num)
          clearInterval(a)
      }, 200)
      }
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
  
  click:function(res){
      console.log(res.currentTarget.dataset.name);
      wx.navigateTo({
        url: './list?name=' + res.currentTarget.dataset.name,
      })
  },

  create:function(){
    wx.navigateTo({
      url: './found',
    })
  }
})
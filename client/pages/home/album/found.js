// pages/home/album/found.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      cover:"",
      button_text:"请上传相册封面"
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
    // this.onShow();
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

  cover:function(){
    var that = this;
      wx.chooseImage({
        count:1,
        success: function(res) {
          that.setData({
            cover:res.tempFilePaths[0],
            button_text:"更换封面"
          })
        },
      })
  },

  send:function(e)//点击完成创建后调用
  {
    var that = this;
    console.log(e);
      if(!that.data.cover)
      {
        wx.showToast({
          title: '相册封面未上传',
          image:"../../../image/sorry.png",
          mask:true 
        })
      }
      else if(!e.detail.value.name)
      {
        wx.showToast({
          title: '相册名未填写',
          image: "../../../image/sorry.png",
          mask: true
        })
      }
      else{
        var name1 = e.detail.value.name;
        var intro = e.detail.value.intro;
        var time = mysql.getTime();
        var imagepath = that.data.cover;

        mysql.find("class_album","name","classid="+app.cur_class.id+" AND name='"+name1+"'").then(res=>{
          if(res && res[0])
          {
            wx.showToast({
              title: '创建失败，该相册名已存在',
              image: "../../../image/sorry.png",
              mask: true
            })
          }
          else{
                var formData = {name:name1};
                console.log(res);
                mysql.insert("class_album","(classid,name,settime,intro)values("+app.cur_class.id+",'"+name1+"','"+time+"','"+intro+"')").then(r=>{
                  console.log(r);
                  mysql.img_upload(imagepath, "album_cover", formData);

                  wx.showToast({
                    title: '创建成功',
                    icon: "success",
                    mask: true,
                    success: function () {
                      setTimeout(function () {
                        wx.navigateBack({});
                      }, 1500)
                    }
                  });
                })

          }
              
        })
        
      }
  },
})
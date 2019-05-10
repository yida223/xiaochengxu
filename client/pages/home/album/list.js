// pages/home/album/list.js
var app = getApp();
var mysql = require("../../../module.js");

Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    imgs: [],
    name:'',
    ident:app.cur_class.ident
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var imgs = [];
      console.log(options.name)
      that.setData({
        name:options.name
      })
     mysql.find("album_img","imagepath","classid="+app.cur_class.id+" AND name='"+that.data.name+"'").then(res=>{
       console.log(res);
       if(res)
       {
       var multi_download=function(res,num)
       {
         if(num === 0)
          return;
         mysql.file_download(res[num-1]).then(r => {
           imgs[num-1] = r;
           multi_download(res,num-1)
         })
       }

        multi_download(res,res.length);

       var a = setInterval(function(){
         that.setData({
           imgs:imgs
         });
         if (imgs && imgs[0])
            clearInterval(a);
         console.log(imgs)
       },200)
       }
     });
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
    // var that = this;
    // var options = {name:that.data.name}
    //   this.onLoad(options);
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

  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    var that = this;
    var re;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var multi_upload = function(res, num) {
          if (num === 0)
          {
            var options = { name: that.data.name }
            that.onLoad(options);
            return;
          }

          mysql.insert("album_img", "(classid,name)value(" + app.cur_class.id + ",'" + that.data.name + "')").then(re => {
            console.log(num)
            var formData = { name: that.data.name }
            mysql.img_upload(res.tempFilePaths[num - 1], "album", formData).then((r)=>{
              multi_upload(res, num - 1);
            })
          });
        } 
        multi_upload(res,res.tempFilePaths.length);

      }
    })
  },

  click:function(e){
    var that = this;
    var path = e.currentTarget.dataset.src;
    console.log(path);
    mysql.file_download("img/user_head/oQIE95e_ZA_7eeAi9TJ0d-Nkow_U.jpg").then(res=>{
      wx.previewImage({
        current:res,
        urls: that.data.imgs,
        success: function (res) {
          console.log(res)
        }
      })
    })

  },

  del:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除本相册吗？',
      success:function(res){
        if(res.confirm)
        {
          mysql.del("album_img","classid="+app.cur_class.id+" AND name='"+that.data.name+"'").then(()=>{
            mysql.del("class_album", "classid=" + app.cur_class.id + " AND name='" + that.data.name + "'").then(()=>{
              wx.navigateTo({
                url: './album',
              });
            });
          });
        }
      }
    })
  }
})
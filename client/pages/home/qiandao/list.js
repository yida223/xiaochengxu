// pages/home/qiandao/list.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      y_num:null,//已签到人数
      n_num:null,//未签到人数

      arr:[],//未签到人员对象数组
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
        var arr=[];
        var length=null;
        var all_num=null;
        //获取总人数
        mysql.find("class_ident","openid","classid="+app.cur_class.id+" AND ident='student'").then(res=>{
     
              all_num = res.length;
        });
        //下面是未签到人员获取
        mysql.find("class_ident","openid","classid="+app.cur_class.id+" AND sign_in='false' AND ident='student'").then(res=>{
         // console.log(res);
         if(res && res[0])
         {
           setTimeout(function () {
             length = res.length;
              console.log(all_num)
             that.setData({
               y_num: all_num - length,
               n_num: length
             });
           } , 1500) 



         for(var i = 0;i < res.length;i++)
         {
           mysql.find("user_info", "name,imagepath", "openid='" + res[i]+"'").then(r=>{

             mysql.file_download(r[1]).then(re=>{//找头像加载到本地
               var item = {};
               item.name = r[0];
               item.imagepath = re;
               console.log(item)
               arr.push(item);
               console.log(arr);
             })

           })
         }
         console.log(that.data.arr[0]);

         var a=setInterval(function(){
           console.log(that.data.arr)
           that.setData({
             arr: arr
           });
           if (that.data.arr && that.data.arr[length-1])
              clearInterval(a);
         },100)

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
        var that = this;
        that.onLoad();
        wx.stopPullDownRefresh();
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
})
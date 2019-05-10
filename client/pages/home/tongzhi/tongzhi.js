// pages/home/tongzhi/tongzhi.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
      settime:[]
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
    var list = [];
    var settime = []
    mysql.find("class_inform", "head,content,openid,settime", "classid=" + app.cur_class.id).then(res => {
      console.log(res);
      var num = res.length / 4;
      if (res && res[0]) {

        var multi_load = function (res, num, list) {
          if (num === 0)
            return;
          mysql.find("user_info", "name", "openid='" + res[(num-1) * 4 + 2] + "'").then(r => {
            var item = {};

            item.head = res[(num-1) * 4 + 0];
            item.content = res[(num - 1) * 4 + 1];
            item.person = r;
            //settime只需要年月日
            settime[res.length / 4-num] = res[(num - 1) * 4 + 3];
            var str = "";
            var temp = "";
            temp = res[(num - 1) * 4 + 3].split('_')[0]
            str += temp.slice(0, 4) + "/" + temp.slice(4, 6) + "/" + temp.slice(6, 8);
            item.settime = str;

            list.push(item);
            console.log(item)
            multi_load(res, num - 1, list);
          })
        }
        multi_load(res, num, list);
      
        var a = setInterval(function () {
          that.setData({
            list: list,
            settime: settime
          });
          console.log(settime)
          if (list.length === num)
            clearInterval(a);
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
  delete: function () {
    var that = this;
    // 提示转发还是删除
    wx.showActionSheet({
      itemList: ['删除', '转发'],
      success: function (res) {
        if (res.tapIndex === 0) {
          // 删除

        }
        else if (res.tapIndex == 1) {
          // 转发

        }
      }
    })
  },

  click:function(e){
      var a = e.currentTarget.dataset;
      console.log(a.time)
     wx.navigateTo({
       url: './tongzhi_detail/detail?settime='+a.settime+"&head="+a.head+"&content="+a.content+"&person="+a.person+"&time="+a.time,
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
  }
})
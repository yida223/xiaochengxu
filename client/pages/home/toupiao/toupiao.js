// pages/vote/vote.js
const app = getApp();
var chazhao = require("./find.js");
var dead;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: []
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
    var condition = "classid = "+app.cur_class.id;
    var i = 0;
    var chead = "head,settime,deadline,selectnum,option1,option2,option3,option4,option5,num1,num2,num3,num4,num5";
    chazhao.find("class_vote", chead, condition).then(
      function (res) {
        console.log(res[0]);
        dead = res[2];
        while (res[i] != null) {
          that.data.array = [{ id: res[i], name: i }].concat(that.data.array);
          that.setData({
            array: that.data.array
          })
          i += 14;
        }
      }
    )
  },

  goto: function (e) {
    var now = chazhao.getTime();
    var now = now.slice(0, 4) + "-" + now.slice(4, 6) + "-" + now.slice(6, 8) + "-" + now.slice(9, 11) + ":" + now.slice(11, 13);
    var cond = "openid='"+app.openid+"'";
    var name = "openid";
    chazhao.find("vote_submit",name,cond).then(
      function(res){
        console.log(res)
        if(res[0]===app.openid || now > dead)
        {
          console.log(e.currentTarget.dataset.name);
          wx.navigateTo({
            url: './toupiao_detail/detail?elem=' + e.currentTarget.dataset.name,
          })
        }
        else 
        {
          console.log(e.currentTarget.dataset.name);
          wx.navigateTo({
            url: './toupiao_choose/detail?elem=' + e.currentTarget.dataset.name,
          })
        }
      }
    )
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
})
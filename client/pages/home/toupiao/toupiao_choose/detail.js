// pages/poll/poll.js
const app = getApp();
var chakan = require("./find.js");
var a = ["单选", "多项中选择2个", "多项中选择3个", "多项中选择4个", "任意选择"];
var arry = [false, false, null, null, null];
var begin;
var num;//最多能选的个数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arry_head: [],
    arry_time: [],
    arry_last: [],
    arry_elect: [],
    arry_option: [],

    inn:[false,false,false,false,false],
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

    var j = parseInt(options.elem);
    console.log(j)
    var that = this;//a.split(':')[1]
    var condition = "classid= " + app.cur_class.id;
    var chead = "head,settime,deadline,selectnum,option1,option2,option3,option4,option5,num1,num2,num3,num4,num5";
    chakan.find("class_vote", chead, condition).then(
      function (res) {
        console.log(res[j]);
        that.data.arry_head = [{ head: res[j] }].concat(that.data.arry_head);
        that.setData({
          arry_head: that.data.arry_head
        })
        begin = res[j + 1];
        that.data.arry_time = [{ time: res[j + 1] }].concat(that.data.arry_time);
        that.setData({
          arry_time: that.data.arry_time
        })
        that.data.arry_last = [{ last: res[j + 2] }].concat(that.data.arry_last);
        that.setData({
          arry_last: that.data.arry_last
        })
        num = parseInt(res[j+3])+1;
        that.data.arry_elect = [{ elect: a[res[j + 3]] }].concat(that.data.arry_elect);
        that.setData({
          arry_elect: that.data.arry_elect
        })
        while (res[j + 4] != "null" && res[j + 4] != 0) {
          console.log(res[j + 4]);
          that.data.arry_option = [{ option: res[j + 4] }].concat(that.data.arry_option);
          that.setData({
            arry_option: that.data.arry_option
          })
          j++;
        }
      }
    )
  },

  //传递每个选项的值
  listerswitch: function (e) {
    var  that = this;
    var true_num = 0;//此时勾选的个数
    var _arry_option = this.data.arry_option;
    var value = e.detail.value;
    console.log("👇");
    console.log("当前所选的值"+typeof value);
    var index = e.target.dataset.index;
    console.log(num)
    var inn1=that.data.inn;//用来储存当前所选的下标
    if(num !== 5){
      for (var i = 0; i < 5; i++)//统计当前选中的个数
      {
        if (inn1[i]) 
        {
          true_num++;
        }
      }
      console.log(true_num)
      if (true_num  >= num) {
        for (var j = 0; j < 5; j++)//找到一个为true的将它变为false
        {
          if (inn1[j] && value) {
            inn1[j] = false;
            break;
          }
        }
        inn1[index] = value;
      }
      else {
        inn1[index] = value;
      }
      console.log(inn1)
    }
    inn1[index] = value;


    _arry_option[index].value = value;
    this.setData({ arry_option: _arry_option });
    //console.log(_arry_option.length);
    console.log("当前选项下标："+index);
    that.setData({
      inn:inn1
    })
    console.log(that.data.inn[index]);
  },

  //提交
  showTopTips: function () {
    var that = this;
    var inn = that.data.inn
    var begintime = "settime='" + begin + "'";
    var record1 = "num1=num1+1";
    var record2 = "num2=num2+1";
    var record3 = "num3=num3+1";
    var record4 = "num4=num4+1";
    var record5 = "num5=num5+1";
    console.log(record1)
    if (inn[0] == true) {
      console.log("arry0")
      chakan.update("class_vote", begintime, record1);
    }
    if (inn[1] == true) {
      console.log("arry1")
      chakan.update("class_vote", begintime, record2);
    }
    if (inn[2] == true) {
      console.log("arry2")
      chakan.update("class_vote", begintime, record3);
    }
    if (inn[3] == true) {
      console.log("arry3")
      chakan.update("class_vote", begintime, record4);
    }
    if (inn[4] == true) {
      console.log("arry4")
      chakan.update("class_vote", begintime, record5);
    }
    var time2 = chakan.getTime();
    var car = "(classid,openid,settime)value("+app.cur_class.id+",'"+app.openid+"','"+time2+"')"
    chakan.insert("vote_submit",car);
    wx.showToast({
      title: '提交成功',
      icon:"success"
    });
    setTimeout(function () {
      wx.switchTab({
        url: '../../home',
      })
    }, 1500)
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
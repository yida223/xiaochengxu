// pages/poll/poll.js
const app = getApp();
var chakan = require("./find.js");
var a = ["单选", "多项中选择2个", "多项中选择3个", "多项中选择4个", "任意选择"];
var arry = [false, false, null, null, null];
var brry = [0,0,0,0,0];
var begin;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arry_percent:[],
    arry_head: [],
    arry_time: [],
    arry_last: [],
    arry_elect: [],
    arry_option: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        var time = res[j+1];
         time = time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8) + "-" + time.slice(9, 11) + ":" + time.slice(11, 13);
        that.data.arry_time = [{ time: time }].concat(that.data.arry_time);
        that.setData({
          arry_time: that.data.arry_time
        })
        that.data.arry_last = [{ last: res[j + 2] }].concat(that.data.arry_last);
        that.setData({
          arry_last: that.data.arry_last
        })
        that.data.arry_elect = [{ elect: a[res[j + 3]] }].concat(that.data.arry_elect);
        that.setData({
          arry_elect: that.data.arry_elect
        })
        var i = 0;
        while (res[j + 4] != "null" && res[j + 4] != 0) {
          
          that.data.arry_option = [{ option: res[j + 4] }].concat(that.data.arry_option);
          that.setData({
            arry_option: that.data.arry_option
          })
          console.log(that.data.arry_option);
          console.log("👇");
          console.log(res)
          console.log(j);
          console.log(parseFloat(res[9 + j]))
          console.log((res[9] + res[10] + res[11] + res[12] + res[13]))
          //console.log( (res[9] + res[10] + res[11] + res[12] + res[13] )*1000000)
          brry[i] = parseFloat(res[9 + j]) / (parseFloat(res[9]) + parseFloat(res[10]) + parseFloat(res[11]) + parseFloat(res[12]) + parseFloat(res[13])  )*100;
          console.log(brry[i]);
          that.data.arry_percent = [{ percent: brry[i] }].concat(that.data.arry_percent);
          that.setData({
            arry_percent: that.data.arry_percent
          })
          console.log(that.data.arry_percent);
          i++;
          j++;
        }
      }
    )
  },

  //传递每个选项的值
  listerswitch: function (e) {
    var _arry_option = this.data.arry_option;
    var value = e.detail.value;
    console.log("👇");
    console.log(value);
    var index = e.target.dataset.index;
    _arry_option[index].value = value;
    this.setData({ arry_option: _arry_option });
    console.log(_arry_option.length);
    console.log(index);
    for (var i = 0; i < _arry_option.length; i++)
      arry[_arry_option.length - 1 - i] = _arry_option[i].value;
    console.log(arry);
  },

  //提交
  showTopTips: function () {
    var begintime = "settime='" + begin + "'";
    var record1 = "num1=num1+1";
    var record2 = "num2=num2+1";
    var record3 = "num3=num3+1";
    var record4 = "num4=num4+1";
    var record5 = "num5=num5+1";
    console.log(record1)
    if (arry[0] == true) {
      console.log("arry0")
      chakan.update("class_vote", begintime, record1);
    }
    if (arry[1] == true) {
      console.log("arry1")
      chakan.update("class_vote", begintime, record2);
    }
    if (arry[2] == true) {
      console.log("arry2")
      chakan.update("class_vote", begintime, record3);
    }
    if (arry[3] == true) {
      console.log("arry3")
      chakan.update("class_vote", begintime, record4);
    }
    if (arry[4] == true) {
      console.log("arry4")
      chakan.update("class_vote", begintime, record5);
    }
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
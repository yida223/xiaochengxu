// findwork/correct/correct.js
const app = getApp();
var chakan = require("./find.js");


var settime;//此次作业的发布时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:null,
    arry_name: [],
    arry_submit: [],
    arry_head: [],
    arry_time: [],
    arry_details: [],
    arry_last: [],
    arry_album: [],
    score:null,
    other:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.flag)
    if(options.flag)
    that.setData({
      flag:options.flag
    });
    var openid = options.openid;
    var name = options.name;
    console.log(name)
    var j = parseInt(options.slem);
    console.log(j)

    var condition = "classid=" + app.cur_class.id;
    var chead = "head,settime,content,openid,deadline"
    chakan.find("homework_issue", chead, condition).then(
      function (res) {
        console.log(res[j]);
        that.data.arry_head = [{ head: res[j] }].concat(that.data.arry_head);
        that.setData({
          arry_head: that.data.arry_head
        })
        settime = res[j + 1];
        that.data.arry_time = [{ time: res[j + 1] }].concat(that.data.arry_time);
        that.setData({
          arry_time: that.data.arry_time
        })
        that.data.arry_details = [{ details: res[j + 2] }].concat(that.data.arry_details);
        that.setData({
          arry_details: that.data.arry_details
        })
        that.data.arry_name = [{ name: name }].concat(that.data.arry_name);
        that.setData({
          arry_name: that.data.arry_name
        })
        that.data.arry_last = [{ last: res[j + 4] }].concat(that.data.arry_last);
        that.setData({
          arry_last: that.data.arry_last
        })
        console.log(res[j + 3] )
        var names = "openid='" + openid + "'";
        var tujian = "imagepath"
        chakan.find("homework_img", tujian, names).then(
          function (mes) {
            console.log(mes)
            var a = function(mes,num)
            {
              if(num === 0)
              {
                console.log(that.data.arry_album)
                that.setData({
                  arry_album: that.data.arry_album
                })
                return;
              }
              console.log(mes[num - 1])
                chakan.file_download(mes[num-1]).then(r=>{
                  console.log(r);
                  that.data.arry_album = [{ album: r }].concat(that.data.arry_album);
                  a(mes,num-1)
                })
            } 
            a(mes,mes.length);
            //that.data.arry_submit = [{ submit: mes[1] }].concat(that.data.arry_submit);
            // that.setData({
            //   arry_submit: that.data.arry_submit
            // })
          }
        )
        //查找分数和批语
        chakan.find("homework_result", "score,other", "classid=" + app.cur_class.id + " AND settime='" + settime + "'").then(re => {
          console.log(settime)
          console.log(re)
          that.setData({
            score: re[0],
            other: re[1]
          })
        })
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  formBindsubmit: function (e) {
    var head = e.detail.value.text;
    var other = e.detail.value.other;
    var shijian = settime;
    var xingming = app.openid;
    var str = "(classid,openid,settime,score,other)value('" + app.cur_class.id + "', '" + xingming + "', '" + shijian + "', " + head +",'"+other+ "')";
    chakan.insert("homework_result", str).then(res => {
      console.log(res)
      wx.switchTab({
        url: '../../home',
      })
    });
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
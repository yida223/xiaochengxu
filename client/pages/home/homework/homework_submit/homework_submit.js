// findwork/d/d.js
const app = getApp();
var chakan = require("./find.js");
var jpgs = new Array();
var name;
var deadline;
var slem;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arry_head: [],
    arry_time: [],
    arry_details: [],
    arry_last: [],
    img_arr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var j = parseInt(options.elem);
    slem = j;
    console.log(j)
    name = j/5;
    var that = this;
    var condition = "classid=" + app.cur_class.id;
    var chead = "head,settime,content,openid,deadline"
    chakan.find("homework_issue", chead, condition).then(
      function (res) {
        console.log(res[j]);
        that.data.arry_head = [{ head: res[j] }].concat(that.data.arry_head);
        that.setData({
          arry_head: that.data.arry_head
        })
        
        that.data.arry_time = [{ time: res[j+1] }].concat(that.data.arry_time);
        that.setData({
          arry_time: that.data.arry_time
        })
        that.data.arry_details = [{ details: res[j + 2] }].concat(that.data.arry_details);
        that.setData({
          arry_details: that.data.arry_details
        })
        deadline = res[j+4]
        that.data.arry_last = [{last:res[j+4]}].concat(that.data.arry_last);
        that.setData({
          arry_last:that.data.arry_last
        })

        //下面开始判断是否已过截止时间，如果过了，就到成绩显示页面
        chakan.find("user_info","name","openid='"+app.openid+"'").then(r=>{//查找到姓名
          var now = chakan.getTime();
          var now = now.slice(0, 4) + "-" + now.slice(4, 6) + "-" + now.slice(6, 8) + "-" + now.slice(9, 11) + ":" + now.slice(11, 13);
          var name = r[0];
          console.log(deadline)
          console.log(now);
          if (now > deadline)
            wx.redirectTo({
              url: '../homework_detail/detail?flag=true'+'&name='+name+'&openid='+app.openid+"&slem="+slem,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
        })

      }
    )


  },

  //作业照片上传
  formBindsubmit: function (e) {
    var image = jpgs[0];
    var condition = "classid="+app.cur_class.id;
    chakan.find("homework_issue", "settime", condition).then(
      function (res) {
        var a = function(res,num) 
        {
          if(num === 0)
          {
            wx.switchTab({
              url: '../../home',
            })
            return;
          }
          

          chakan.insert("homework_img", "(classid,settime,openid)value(" + app.cur_class.id + ",'" + res[name] + "','" + app.openid + "')").then((r) => {
            console.log(r);
            console.log(res)
            chakan.img_upload(jpgs[num-1],"homework_submit",{settime:res[name]}).then(re=>{
              console.log(re);
              a(res,num-1)
            })
          })
        }
        console.log(jpgs)
        a(res,jpgs.length);
      }
    )
  },

  //作业图片选择
  bindchooiceproducr: function () {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          jpgs[i] = tempFilePaths[i];
        }
        wx.showToast({
          title: '正在上传...',
          icon: '',
          mask: true,
          duration: 100
        })
      },
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
// pages/home/homework/homework_creat.js
const app = getApp()
var shangchuan = require("./find.js");
var jpgs = new Array();

var bindtime = "12:01";
var binddata = "2017-09-01";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2018-09-01",
    time: "12:01",
    imagepath:"../../../../image/add.png"
  },
    //上传作业
    formBindsubmit: function (e) {
            var head = e.detail.value.homework;
  },
  //上传作业
  formBindsubmit: function (e) {
    var head = e.detail.value.homework;
    var head1 = e.detail.value.contant;
    var image;
    for (var i = 0, h = jpgs.length; i < h; i++) {
       image = jpgs[i];
    }
    var time = shangchuan.getTime();
    time = time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8) + "-" + time.slice(9, 11) + ":" + time.slice(11, 13);
    console.log(time)
    var lasttime = binddata + "-" + bindtime;
    var str = "(classid,head,content,openid,settime,deadline)value(" + app.cur_class.id + ",'" + head + "', '" + head1 + "','"+app.openid+"','" + time+"', '"+lasttime+"')";
    shangchuan.insert("homework_issue", str).then((res)=>{
      shangchuan.img_upload(image,"homework_issue",{settime:time}).then(r=>{
        console.log(r);
        console.log(res)
        wx.switchTab({
          url: '../../home',
        })
      })
    })

  },

  //作业图片选择
  bindchooiceproducr: function () {
    var that = this;
    wx.chooseImage({
      count:1,
      success: function (res) {
        that.setData({
          imagepath:res.tempFilePaths[0]
        })
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
  openToast: function () {
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 3000
    });
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  //获取时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
    bindtime = e.detail.value;
    console.log(e.detail.value);
  },

  //获取日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    binddata = e.detail.value;
    console.log(e.detail.value);
  },
})
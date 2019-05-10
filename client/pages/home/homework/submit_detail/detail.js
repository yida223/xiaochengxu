// findwork/c/c.js
const app = getApp();
var chakan = require("./find.js")

var les1 = [];
var openids = [];
var slem;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arry_head: [],
    arry_time: [],
    arry_last:[],
    arry_details: [],
    f_student: [],
    unf_student: [],
    j: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    slem = options.elem;
    var j = parseInt(options.elem);
    this.setData({ j: j })
    console.log(j)
    var that = this;
    var condition = "classid=" + app.cur_class.id;
    var chead = "head,settime,content,openid,deadline"
    chakan.find("homework_issue", chead, condition).then(
      function (res) {
        console.log(res[j]);
        that.data.arry_head = [{ head: res[j], num: j }].concat(that.data.arry_head);
        that.setData({
          arry_head: that.data.arry_head
        })
        that.data.arry_time = [{ time: res[j + 1] }].concat(that.data.arry_time);
        that.setData({
          arry_time: that.data.arry_time
        })
        that.data.arry_details = [{ details: res[j + 2] }].concat(that.data.arry_details);
        that.setData({
          arry_details: that.data.arry_details
        })
        that.data.arry_last = [{ last: res[j + 4] }].concat(that.data.arry_last);
        that.setData({
          arry_last: that.data.arry_last
        })
        var times = "settime='" + res[j + 1] + "' GROUP BY openid"
        chakan.find("homework_img", "openid", times).then(
          function (les) {
            var i = 0;
            console.log(les[0]);
            console.log(les)
            for (var i = 0; i < les.length; i++) {
              les1[i] = les[i]
            }
            console.log(les1)
            for(var i = 0;i < les.length;i++)
            {
              openids[i] = les[i]
            }
            var b = function(les1,num)
            {
              if(num <= 0)
              {
                that.setData({
                  f_student: that.data.f_student
                });
                console.log(that.data.f_student)
                 console.log(les1)
                 return;

              }
              chakan.find("user_info", "name", "openid='" + les1[num-1] + "'").then(s => {
                les1[num-1] = s[0];
                console.log(les1[num-1])
                that.data.f_student = [{ student: les1[num-1] }].concat(that.data.f_student);
                b(les1,num-1)
              })
            } 

            b(les1,les1.length);
            console.log(that.data.f_student);
            var condition = "classid="+app.cur_class.id;
            chakan.find("class_ident", "openid", condition).then(
              function (nes) {
                console.log(nes);
                console.log(les1)
                var arr = new Array();
                var j;
                console.log(les)
                for(var i = 0;i < nes.length;i++)
                {
                  for(j = 0;j < les.length;j++)
                  {
                      if(nes[i] === les[j])
                        break;
                  }
                  if(j === les.length)
                    arr[i] = nes[i];
                }
                console.log(arr);
                var m = 0;
                var a = function (arr, num) {
                  if (num <= 0)
                  {
                      console.log(arr);//没交的人的openid数组
                      while (m <= arr.length) {
                        console.log(arr[0]);
                        that.data.unf_student = [{ name: arr[m] }].concat(that.data.unf_student);
                        that.setData({
                          unf_student: that.data.unf_student
                        })
                        m++;
                      }
                      return;
                  }
                  chakan.find("user_info", "name", "openid='" + arr[num - 1] + "'").then(res => {
                    console.log(res)
                    arr[num - 1] = res[0];
                    a(arr, num - 1)
                  })
                }
                a(arr, arr.length);


              }
            )
          }
        )
      }
    )
  },

  goto: function (e) {
    console.log("👉");
    var num = e.currentTarget.dataset.num;
    var index = e.currentTarget.dataset.index;
    console.log(num);
    console.log(e)
    console.log(les1)
    console.log(openids[num])
    wx.navigateTo({
      url: '/pages/home/homework/homework_detail/detail?slem=' + e.currentTarget.dataset.num + "&name=" + les1[index] + "&openid=" + openids[num],
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
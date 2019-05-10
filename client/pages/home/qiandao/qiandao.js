// pages/home/qiandao/qiandao.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */


  data: {    
    //老师的时间选择器数据
    had_start:false,
    value:[0],
    setmins:[2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    setmin:3,
    //老师的时间选择器数据
      ident: '',
        min:0,
        s:0,
        ms:0,
        flag:"正在搜索",//这里有四种取值：“正在搜索”、“正在签到”、“已签到”、“没有正在进行的签到”、“签到时间已到”

        //位置
        teach_loc: { x: null, y: null },
        my_loc: { x: null, y: null },
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
    console.log(app.cur_class);
    that.setData({
      ident:app.cur_class.ident
    });
    var that = this;
    var j = 0;
    if (that.data.ident === 'founder' || that.data.ident === 'teacher')
    {
      mysql.update("class_ident", "classid=" + app.cur_class.id + " AND sign_in='true'", "sign_in='false'").then(res => {
            console.log(res);
      })
    }
    else
    {
      that.timecheck(j)
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
    var ident = this.data.ident;
    if (app.cur_class.ident === "founder" || app.cur_class.ident === "teacher") {
      //console.log("haha");
      mysql.del("teacher_loc", "classid=" + app.cur_class.id).then(res => {
        console.log(res);
      })
    }
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

  
  bindchange:function(e){
    var that =this;
      const val = e.detail.value[0];
      this.setData({
          setmin:that.data.setmins[val]
      });
      console.log(that.data.setmin);
  },

  timecheck:function(j){
    var that = this;
    var cname = " loc,settime,time ";
    var condition = "classid=" + app.cur_class.id;
    console.log(condition);
    mysql.find("teacher_loc", cname, condition).then(res => {
      console.log(j);
      if(res){
       if (res[j]) {
        that.setData({
          flag: "正在签到"
        });
        console.log(that.data.flag);
        var time0 = mysql.getTime().split('_')[1];
        var hour0 = parseInt(time0.slice(0, 2));
        var min0 = parseInt(time0.slice(2, 4));
        var sec0 = parseInt(time0.slice(4, 6));

        var time1 = res[j + 1].split('_')[1];
        var hour1 = parseInt(time1.slice(0, 2));
        var min1 = parseInt(time1.slice(2, 4));
        var sec1 = parseInt(time1.slice(4, 6));
        console.log(parseInt(res[j + 2]) * 60 * 60 - ((hour0 - hour1) * 60 * 60 + (min0 - min1) * 60 + sec0 - sec1))
        var left = parseInt(res[j + 2]) * 60 - ((hour0 - hour1) * 60 * 60 + (min0 - min1) * 60 + sec0 - sec1);//计算所剩的秒
         console.log(left);
        // console.log(parseInt(left / 60))
        // console.log(parseInt(left % 60))
        if (left <= 0) {
          that.setData({
            flag: "没有找到正在进行的签到"
          });
          wx.showModal({
            title: '提示',
            content: '没有找到正在进行的签到',
            showCancel: false,
            confirmText: "确定",
            complete: function () {
              wx.switchTab({
                url: '../home',
              });
            }
          })
          return;//找到的已过期
        }
        that.setData({
          min: parseInt(left / 60),
          s: parseInt(left % 60)
        });

        //下面是开始倒计时
        var min = that.data.min;
        var s = that.data.s;
        var ms = 0;
        var clear1 = setInterval(function () {
          if (ms <= 0)
            ms = 10;
          that.setData({
            ms: ms - 1
          });
          ms--;
        }, 100, ms);


        var clear2 = setInterval(function () {
          if (s <= 0) {
            s = 60;
            min--;
          }
          if (min < 0) {
            that.timeout();
            clearInterval(clear1);
            clearInterval(clear2);
            that.timeout();
            return true;
          }
          that.setData({
            s: s - 1,
            min: min
          });
          s--;
        }, 1000, s);
      }
      else {//找到的为空
         wx.showModal({
           title: '提示',
           content: '签到尚未开启，请稍后重试',
           showCancel: false,
           confirmText: "确定",
           complete:function(){
             wx.switchTab({
               url: '../home',
             });
           }
         })
      }
      }
      else{
        wx.showModal({
          title: '提示',
          content: '网络出现问题，请稍后重试',
          showCancel: false,
          confirmText: "确定",
        })
      }
    })

  },

  timeout: function ()//时间结束时的操作
  {
      var that = this;
      that.setData({
        min:0,
        s:0,
        ms:0,
        flag:"签到时间已到"
      });
  },

  qiandao:function()
  {
    var that = this;
    console.log(this.data.teach_loc)
    var that = this;
    wx.request({
      url: 'http://120.79.151.23/find.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        tname: "teacher_loc",
        cname: "loc",
        condition: "classid=" + app.cur_class.id
      },
      success: function (res) {
        var arr = res.data;
        console.log("249:"+arr);
        var str = arr[0];
        // console.log(str);
        var douhao = str.indexOf(',');
        console.log(parseFloat(str.substring(0, douhao)))
        that.setData({
          teach_loc: {
            x: parseFloat(str.substring(0, douhao)).toFixed(2),
            y: parseFloat(str.substring(douhao + 1)).toFixed(2),
          }
        });
        wx.getLocation({
          success: function (res) {
            app.location.x = res.latitude.toFixed(2);
            app.location.y = res.longitude.toFixed(2);
            that.setData({
              my_loc: {
                x: app.location.x,
                y: app.location.y,
              }
            });
            //console.log(that.data.location);
            // console.log(app.location);
            // console.log(Math.pow(app.location.x - that.data.teach_loc.x, 2));
            var distance = that.distance(that.data.teach_loc.x, that.data.teach_loc.y, app.location.x, app.location.y);
            console.log('老师的位置为：' + that.data.teach_loc.x + ',' + that.data.teach_loc.y + '\n');
            console.log('我的位置为：' + app.location.x + ',' + app.location.y + '\n');
            console.log('距离为：' + distance + '米');

            if (distance <= 50)
              wx.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 1500,
                mask: true,
                success:function(){
                  mysql.update("class_ident","classid="+app.cur_class.id+" AND openid='"+app.openid+"'","sign_in='true'").then(res=>{
                    console.log(res);
                    that.setData({
                      flag: "已签到"
                    });
                  })
                }
              })
            else {
              wx.showToast({
                title: ("签到失败\n距离为" + distance + "米"),
                icon: 'none',
                duration: 1500,
                mask: true,
              })
            }
          },
          fail:function(res){
            console.log(res);
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.userLocation']) {
                  wx.authorize({
                    scope: 'scope.userLocation',
                    success() {
                      // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                      wx.startRecord()
                    }
                  })
                }
              }
            })
          }
        });
      }
    })
  },

  settime:function(){
    var that = this;
    wx.getLocation({
      success: function (res) {
        app.location.x = res.latitude.toFixed(2);
        app.location.y = res.longitude.toFixed(2);
        var record = app.location.x + ',' + app.location.y;
        var time = mysql.getTime()
        console.log(time);
        record = "(classid,loc,settime,time)values(" + app.cur_class.id + ",'" + record  + "','"+time+"',"+that.data.setmin +")";

        mysql.insert("teacher_loc", record).then(function (res) {
          console.log(res);
          that.setData({
            had_start:true,
            min:that.data.setmin
          });

          //下面是开始倒计时
          var min = that.data.min;
          var s = that.data.s;
          var ms = 0;
          var clear1 = setInterval(function () {
            if (ms <= 0)
              ms = 10;
            that.setData({
              ms: ms - 1
            });
            ms--;
          }, 100, ms);


          var clear2 = setInterval(function () {
            if (s <= 0) {
              s = 60;
              min--;
            }
            if (min < 0) {
              that.timeout();
              clearInterval(clear1);
              clearInterval(clear2);
              that.timeout();
              return true;
            }
            that.setData({
              s: s - 1,
              min: min
            });
            s--;
          }, 1000, s);
        });
      },
      fail:function(res){
        console.log(res);
      }
    })   

  },

  distance: function (la1, lo1, la2, lo2) {//计算地球两点的距离
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    //console.log(s);
    return (1000 * s);
  },

  location: function () {
 
  },

  list:function(){
    wx.navigateTo({
      url: './list',
    })
  }
})
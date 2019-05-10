// pages/my/class_join/detail.js
var app = getApp();
var mysql = require("../../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      option:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var that =this;
        that.setData({
          option:options.option
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
      var that = this;
      that.setData({
        zhuce:'class'
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


  storeClassInfo: function (e) {
    var that = this;
    console.log(e.detail.value);
    var info = e.detail.value;
    var time = new Date();
    var record = "(name,intro,major,openid,date)value" + mysql.strvalue([info.name, info.intro, info.major, app.openid, time]);
    mysql.insert("classes", record).then(() => {
      var condition = "date='" + time + "'";
      mysql.find("classes", "classid,name", condition).then(res => {
        console.log(res[0]);
        app.cur_class.id = res[0];
        app.cur_class.name = res[1];
        app.cur_ident = "founder"
        that.headimg("class_head").then(() => {
          ;
          var record = "(classid,openid,ident)value" + mysql.strvalue([app.cur_class.id, app.openid, app.cur_ident]);
          mysql.insert("class_ident", record);
          mysql.update("user_info", "openid='" + app.openid + "'", "latelyclass='" + app.cur_class.id + "'").then(() => {
            console.log("hahaaa")
            wx.redirectTo({
              url: '../../wxlogin/index',
            })
          });

        })
      })
    })
  },

  headimg: function (filename) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        success: function (res) {
          console.log(res);
          mysql.img_upload(res.tempFilePaths[0], filename).then(r => {
            if (r)
              resolve();
            else
              resolve(r);
          })

        },
        fail: function (res) {
          console.log("选择故障");
          resolve();
        },
      })
    })

  },

  look_up: function (e) {//查找班级
    var that = this;
    var value = e.detail.value.value;
    console.log(value)
    //console.log(Number.isInteger(value))
    //console.log(kind+value);
    mysql.find("classes", "classid,name,intro,major,imagepath", "classid=" + value).then(res => {
      console.log(res);
      var arr = new Array();
      console.log(arr);
      var tmp = {
        id: null,
        name: null,
        intro: null,
        major: null,
        imagepath: null,
      };
      if (res && res[0]) {

        for (var j = 0; j < 5; j++) {
          switch (j) {
            case 0: tmp.id = res[j]; break;
            case 1: tmp.name = res[j]; break;
            case 2: tmp.intro = res[j]; break;
            case 3: tmp.major = res[j]; break;
            case 4: {
              mysql.file_download(res[j]).then(r => {
                console.log(r);
                tmp.imagepath = r;
                that.setData({
                  find: "true",
                  find_class: tmp
                });
              });
            }; break;
          }

        }
        console.log(tmp);

      }
      else {
        wx.showToast({
          title: '没有找到班级',
          icon: "none",
          mask: true
        });
      }
    });
  },

  send: function () {
    var that = this;
    var classid = that.data.find_class.id;
    var openid = app.openid;
    var check = "未审核";
    var condition = "classid=" + classid + " AND openid='" + openid + "'" + " AND kind='" + check + "'";
    mysql.find("system_inform", "classid", condition).then(res => {
      if (!(res && res[0])) {
        console.log(res)
        mysql.insert("system_inform", "(classid,openid,kind)value(" + classid + ",'" + openid + "','" + check + "')").then(r => { console.log(r) });

        wx.showToast({
          title: '提交成功',
          icon: "success",
          mask: true
        });
        that.setData({
          send: true
        })
      }
      else {
        wx.showToast({
          title: '已经提交过了,请耐心等待回复',
          icon: "none",
          mask: true
        });
        that.setData({
          send: true
        })
      }
    });
  },

  flush: function () {
    var that = this;
    mysql.find("system_inform", "classid,kind", "openid='" + app.openid + "'").then(res => {
      if (res && res[0]) {
        if (res[1] === '同意')
          wx.redirectTo({
            url: './0',
          });
        else if (res[1] === "拒绝") {
          wx.showToast({
            title: '您的请求被拒绝',
            icon: "none",
            mask: true
          });
          console.log("hasdjkfnkajsbf")
          mysql.del("system_inform", "openid='" + app.openid + "' AND  kind<>'未审核'").then((res) => {
            console.log(res);
            setTimeout(that.return_0, 3000)
          })
        }
        else {
          wx.showToast({
            title: '您的请求尚未回复，请耐心等待',
            icon: "none",
            mask: true
          });
        }
      }

      else {

      }
    })

  },

  return_0: function () {
    wx.redirectTo({
      url: './0',
    })
  }
})
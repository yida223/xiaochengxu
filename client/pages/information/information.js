// pages/information/information.js
var mysql = require("../../module.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    finished:false,
    kind:null,
    head:"",
    Info:{}
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 800
    })

    var that = this;
    console.log(options);

    if(!that.data.finished){
    var option = that.data.option;
    console.log(options.kind);
        switch(options.kind)
        {//加群请求
          case '入班申请':{
            that.setData({
              kind: "系统消息",
              head:"入班申请"
            });
              var condition = "classid=" + app.cur_class.id + " AND kind='未审核'";
              mysql.find("system_inform", "openid", condition).then((res) => {
                if(res && res[0])
                {
                  console.log(res);
                  mysql.find("user_info", "openid,name,qq,phone,other", "openid='" + res[0] + "'").then(r=>{
                    var info = {};
                    info.openid = r[0]
                    info.name = r[1];
                    info.qq = r[2];
                    info.phone = r[3];
                    info.other = r[4];
                    that.setData({
                      Info:info
                    });
                  })
                }
                else{
                  that.setData({
                    finished:false
                  });
                  wx.switchTab({
                    url: '../home/home',
                  })
                }

                  });
          };break;
          case "回复":{
            var condition = " openid='" + app.openid + "' AND kind！='未审核'";
            mysql.find("system_inform", "classid,kind", condition).then((res) => {
              console.log(res);
              if (res && res[0]) {
                var info={};
                info.classid = res[0];
                info.kind = res[1];
                that.setData({
                  Info:info,
                  kind:res[1]
                });
                mysql.find("classes","name","classid="+res[0]).then(r=>{
                  info.name = r;
                  that.setData({
                      Info:info
                  });
                });
              }
              else {
                that.setData({
                  finished: flase
                });

                console.log(res);

              }
            })
          };break;
          //退群提醒
          case '退班提醒': { }; break;
          //群解散提醒
          case '班解散提醒': { }; break;
          case '作业布置': { }; break;
        }
    }
    else{
      wx.switchTab({
        url: '../home/home',
      })
    }
        console.log("haha")
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

  yes:function(e){
    var that = this;

      var condition = "classid=" + app.cur_class.id + " AND openid='" + that.data.Info.openid + "' AND kind='未审核'";
    var record = "kind='同意'";
    console.log(that.data.Info.openid)
    mysql.update("user_info", "openid='" + that.data.Info.openid + "'", "latelyclass=" + app.cur_class.id).then(ree=>{console.log(ree)})
      mysql.update("system_inform",condition,record).then(res=>{
      mysql.update("classes", "classid="+app.cur_class.id, "num=num+1")
        console.log(res);
        record = "(classid,openid,ident)values("+app.cur_class.id+",'"+that.data.Info.openid+"','student')";
      mysql.insert("class_ident",record).then((re)=>{
        console.log(re);
        mysql.find("system_inform", "openid", condition).then((r) => {
          console.log(r)
          if ((r && r[0]))
            wx.redirectTo({
              url: './information?kind=入班申请',
            })
          else {
            wx.switchTab({
              url: '../home/home',
            })
          }
        })
      })
  });

      
  },

  no: function () {
    //console.log("假设此时不同意的相关数据发出");
    var that = this;
    var condition = "classid=" + app.cur_class.id + " AND openid='"+that.data.Info.openid +"' AND kind='未审核'";
    var record = "kind='拒绝'";
    mysql.update("system_inform", condition, record).then(res => {
      console.log(res);
      var condition = "classid=" + app.cur_class.id + " AND kind='未审核'";
      mysql.find("system_inform", "openid", condition).then((r) => {
        console.log(r)
        if((r && r[0]))
        wx.redirectTo({
          url: './information?kind=入班申请',
        })
        else{
          wx.switchTab({
            url: '../home/home',
          })
        }
      })
      })
  },

  next:function(){
    var that = this;
    var condition = " openid='" + app.openid + "' AND kind<>'未审核'";
      mysql.del("system_inform",condition).then((res)=>{
        console.log(res);
        mysql.find("system_inform", "openid", condition).then((r) => {
          console.log(r)
          if ((r && r[0]))
            wx.redirectTo({
              url: './information?kind=回复',
            })
          else {
            wx.switchTab({
              url: '../home/home',
            })
          }
      })
    })
  }
  
})
var app = getApp();
var mysql = require("../../../module.js")
Page({
  data: {
    cover:"../../../image/personal.png",
    name:"",
    other:"",
    qq:"",
    phone:"",

    chakan:false,//检测是否是查看跳转过来的
  },
  
  onLoad:function(options){
    var that = this;
    console.log(options.openid)
    if(options.openid)
    {
      that.setData({
        chakan:true
      });
      mysql.find("user_info", "name,other,qq,phone,imagepath", "openid='" +options.openid + "'").then(res => {
        if (res[4]) {
          mysql.file_download(res[4]).then(r => {
            console.log(r)
            that.setData({
              name: res[0],
              other: res[1],
              qq: res[2],
              phone: res[3],
              cover: r
            });
          })
        }
        else {
          that.setData({
            name: res[0],
            other: res[1],
            qq: res[2],
            phone: res[3],
          })
        }
      })
    }
    else{
      mysql.find("user_info","name,other,qq,phone,imagepath","openid='"+app.openid+"'").then(res=>{
        if(res[4])
        {
          mysql.file_download(res[4]).then(r=>{
            console.log(r)
            that.setData({
              name:res[0],
              other:res[1],
              qq:res[2],
              phone:res[3],
              cover:r     
            });
          })
        }
        else{
          that.setData({
            name: res[0],
            other: res[1],
            qq: res[2],
            phone: res[3],
                      })
        }
      })
    }
  },

  cover: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({
          cover: res.tempFilePaths[0],
        })
      },
    })
  },

  change:function(e){
    var that = this;
      console.log(e.detail);
      var value =  e.detail.value;


      var record =
      "name='"+value.name+"',other='"+value.other+"',qq='"+value.qq+"',phone='"+value.phone+"'";
      mysql.update("user_info","openid='"+app.openid+"'",record).then(res=>{
        console.log(res);
      })
      mysql.img_upload(that.data.cover,"user_head").then(res=>{
        wx.showToast({
          title: '保存成功',
          icon:"sucess"
        })
        setTimeout(function(){
          wx.switchTab({
            url: '../my',
          })
        },1500);
      })
  }
});
// pages/my/class_ident/class_ident.js
var app = getApp();
var mysql = require("../../../module.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arr = [];

      //递归加载所有成员姓名头像和身份
      mysql.find("class_ident","openid,ident","classid="+app.cur_class.id).then(res=>{
        var num = res.length/2;
        console.log(res);
        var a = function(arr,res,num)
        {
          if(num === 0)
          {
            return;
          }
          mysql.find("user_info", "name,imagepath", "openid='"+res[(num-1)*2+0]+"'").then(re=>{
                mysql.file_download(re[1]).then(r=>{
                  var item = {}
                  //判断是否有头像
                  if (r.split(".")[r.split(".").length-1] === "html")
                    item.imagepath = "../../../../image/home.png"//没有头像就给此默认头像
                  else{
                    switch(res[(num-1)*2+1])
                    {
                      case "founder":{item.ident="创建者"};break;
                      case "teacher": { item.ident = "老师" }; break;
                      case "assistant": { item.ident = "班级助手" }; break;
                      case "student": { item.ident = "学生" }; break;
                    }
                  }
                  //判断是否有头像

                  item.openid = res[(num - 1) * 2 + 0];
                  item.name = re[0];
                  item.imagepath = r;

                  console.log(item);
                  arr.push(item);

                  a(arr,res,num-1);
                })
          })
        }

        a(arr,res,num);

        //时刻更新渲染知道全部渲染完为止
        var b = setInterval(function(){
          that.setData({
            arr:arr
          })
          if(arr.length === num)
            clearInterval(b)
        },300)
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

  click:function(e){
      var that = this;
      var value = e.currentTarget.dataset;
      console.log(value);
      if(value.ident !=="创建者")
      {
        console.log(value.ident);
        console.log(app.cur_class.ident);
        if(app.cur_class.ident === "founder" || app.cur_class.ident==="teacher")
        {
          wx.showActionSheet({
            itemList: ['设为老师', '设为班级助手', '设为学生'],
            success: function (res) {
              switch(res.tapIndex)
              {
                case 0:{
                  mysql.update("class_ident","openid='"+value.openid+"'","ident='teacher'").then(r=>{
                    console.log(r)
                    wx.showToast({
                      title: '设置成功',
                      icon:"sueccess"
                    })
                    that.onLoad();
                  })
                };break;

                case 1: {
                  mysql.update("class_ident", "openid='" + value.openid + "'", "ident='assistant'").then(r => {
                    console.log(r)
                    wx.showToast({
                      title: '设置成功',
                      icon: "sueccess"
                    })
                    that.onLoad();
                  })
                 }; break;

                case 2: {
                  mysql.update("class_ident", "openid='" + value.openid + "'", "ident='student'").then(r => {
                    console.log(r)
                    wx.showToast({
                      title: '设置成功',
                      icon: "sueccess"
                    })
                    that.onLoad();
                  })
                 }; break;
              }
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })
        }
      }
  }
})
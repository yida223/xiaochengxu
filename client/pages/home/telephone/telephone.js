var app = getApp();
var mysql = require("../../../module.js");

var taptime = 0;
Page({
  data: {
    people:[],
    paths:[],
    openid:[],
  },
  onLoad: function (options) {
    var that = this;
    var people = [];
    var tmppaths = [];
    var paths = [];
    var openids = [];
    mysql.find("class_ident","openid","classid="+app.cur_class.id).then(res=>{
      console.log(res);
      console.log("haha1")
      if(res && res [0])
      {
        console.log("haha2")
        for(var i = 0;i < res.length;i++)
        {
          tmppaths[i] = "/image/personal.png"//这里是初始化头像的url
        }
        for (var i = 0; i < res.length; i++) {
          openids[i] = res[res.length-1-i]//这里是初始化头像的url
        }
        that.setData({
          paths:tmppaths,
          openids:openids
        });//初始化头像、记录对应数据
        console.log(openids)

        //递归加载数据
        var a = function (res, num, people, paths) {
          if (num === 0) {
            console.log(people);
            that.setData({
              people:people
            });
            return;
          }
          mysql.find("user_info", "name,phone,imagepath", "openid='" + res[num - 1] + "'").then(r => {

            console.log(r)
            var item = {};
            item.name = r[0];
            item.phone = r[1];

            paths[res.length - num] = r[ 2];
            console.log(paths)
            console.log(item);
            people.push(item);
            item = null;
            //console.log(people)

            a(res,num-1,people,paths);
          })
        }




        a(res, res.length, people, paths)
        //console.log(people);
        //console.log(paths);
        //递归加载图片
        var b = function(paths,tmppaths,num)
        {
          console.log(paths[num])
          if (num === res.length)
            {
              return;
            }
            mysql.file_download(paths[num]).then(r => {
              console.log(r)
              if (r.split(".")[r.split(".").length-1] !=="html")
              {
                tmppaths[num] = r;
                that.setData({
                  paths: tmppaths
                });
                b(paths, tmppaths, num + 1)
              }
              else{
                b(paths, tmppaths, num + 1)
              }
            })
        }

        setTimeout(function(){
          b(paths, tmppaths, 0);
        },1500) 
      }


    })

    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 1000
    })
  },
  // 长按号码响应函数
  phoneNumTap: function (e) {
    console.log(e.currentTarget.dataset);
    var phone = e.currentTarget.dataset.phone;
    var name = e.currentTarget.dataset.name;
    var path = e.currentTarget.dataset.imagepath;
    var openid = e.currentTarget.dataset.openid;

    var that = this;
    // 提示呼叫号码还是将号码添加到手机通讯录
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        if (res.tapIndex === 0) {
          // 呼叫号码
          wx.makePhoneCall({
            phoneNumber: phone,
          })
        }
         else if (res.tapIndex == 1) {
          // 添加到手机通讯录
          wx.addPhoneContact({
            firstName: name,//联系人姓名
            mobilePhoneNumber: phone,//联系人手机号
          })
        }
        else  //查看个人资料
        {
        
        }
      }
    })
  },

  click:function(e){
      var value = e.currentTarget.dataset.openid;
      console.log(value)
      wx.navigateTo({
        url: '../../my/information/information?openid='+value,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },

  start:function(e){
    taptime = e.timeStamp;
    console.log(e)
  },

  end:function(e){
    var that = this;
    taptime = e.timeStamp - taptime;
    console.log(taptime)
    if(taptime > 350)
      that.phoneNumTap(e);
    else{
      that.click(e)
    }
  }
})
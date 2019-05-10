// pages/0/0.js
var app = getApp();
var mysql = require("../../module.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    share:false,
    send:false,
    pass:false,
    path:"",
      find_class:{},
      find:"",
      jindu:true,
      zhuce:"",
      option:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      if(options.classid)
      { 
        console.log(options.classid)
        mysql.update("classes", "classid=" + options.classid, "num=num+1");
          that.setData({
            share:options.classid
          });
      }
  },
          


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function () {
        var that = this;
        console.log(app.openid);

        that.getUser().then((res) => {
          //console.log(res[6]);
          if (!res[0]) {
            //console.log("haha")
            that.set_jindu().then(() => {
              that.setData({
                zhuce: "user",
                jindu: false
              });
              wx.showModal({
                title: '提示',
                content: '检测到您尚未注册个人信息，请先注册',
                showCancel: false,
                confirmText: "确定",
              })
            })
          }
          else {
            that.getClass().then((res) => {

              if (res[0] === "0") {
                that.setData({
                  zhuce: "class",
                  jindu: false
                });
                console.log(res[0]);
                wx.showModal({
                  title: '提示',
                  content: '检测到您尚未创建或加入任何班级，请先创建或加入',
                  showCancel: false,
                  confirmText: "确定",
                })
              }
              else {//说明已经加入或创建了某个班级
                wx.switchTab({
                  url: '../home/home',
                });
              }
            });
          }
        })
 
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var value = wx.getStorageSync('openid');
    //console.log(false=="");
    if (value) {
      app.openid = value;
      console.log(app.openid);
    }
    else
      app.getOpenid().then(() => {
        console.log(app.openid);
        that.getUser().then((res) => {
          //console.log(res[6]);
          if (!res[0]) {
            console.log("haha")
            that.set_jindu().then(() => {
              that.setData({
                zhuce: "user",
                jindu: false
              });
              wx.showModal({
                title: '提示',
                content: '检测到您尚未注册个人信息，请先注册',
                showCancel: false,
                confirmText: "确定",
              })
            })
          }
          else {
            that.getClass().then((res) => {

              if (res[0] === "0") {
                that.setData({
                  zhuce: "class",
                  jindu: false
                });
                console.log(res[0]);
                wx.showModal({
                  title: '提示',
                  content: '检测到您尚未创建或加入任何班级，请先创建或加入',
                  showCancel: false,
                  confirmText: "确定",
                })
              }
              else {//说明已经加入或创建了某个班级
                wx.switchTab({
                  url: '../home/home',
                });
              }
            });
          }
        })
      });
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

    set_jindu: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        that.setData({
          jindu: false,
          //zhuce:"user"
        })
      }, 0 )
      setTimeout(resolve, 0, )
    })
  },

  getUser:function(){
    var that = this;
    return new Promise((resolve,reject)=>{
      //console.log(app.openid);
      if (app.openid) {
        mysql.find("user_info", "*", "openid='" + app.openid + "'").then(res => {
          if(!res[0]){
          if(!res[1]){

          }
          else{
            app.user_info.name = res[1];
            app.user_info.qq = res[2];
            app.user_info.phone = res[3];
            app.user_info.studyid = res[4];
            app.user_info.imagepath = res[5];
          }
          }
          resolve(res);
        })
      }
      else {
        new Promise((resolve, reject) => {
          setTimeout(resolve, 1000);
        }).then(() => {
          that.getUser();
        })
      }
    })
  },

  getClass: function()
  {
    var that = this;
    return new Promise((resolve, reject) => {
     // console.log(app.openid);
      if (app.openid) {
        mysql.find("user_info", "latelyclass", "openid='" + app.openid + "'").then(res => {
          console.log(res);
          app.cur_class.id = res[0];
          var condition = "classid='"+app.cur_class.id+"' AND openid='"+app.openid+"'";
          var cname = "ident";
          mysql.find("class_ident",cname,condition).then(res=>{
            console.log(res);
            app.cur_class.ident = res[0];
          }).then(()=>{
            cname = "name,num"
            condition = "classid='" + app.cur_class.id + "'"
            mysql.find("classes", cname, condition).then(res => {
              console.log(res);
              app.cur_class.num = res[1];
              app.cur_class.name = res[0]
            })
          })
          resolve(res);
        })
      }
      else {
        new Promise((resolve, reject) => {
          setTimeout(resolve, 1000);
        }).then(() => {
          that.getClass();
        })
      }
    })
  },
  storeUserInfo:function(e){
      var that = this;
      console.log(e.detail.value);
      var info = e.detail.value;
      if(!info.name)
        wx.showModal({
          title: '提示',
          content: '名称尚未填写',
          showCancel:false,
          confirmText:"确定"
        })
      else{
        app.user_info.name = info.name;
        app.user_info.qq = info.qq;
        app.user_info.phone = info.phone;
        app.user_info.other = info.other;
        if(that.data.share)
        {
          console.log("此时的share:" + that.data.share);
          var record = "(openid,name,qq,phone,other,latelyclass)value" + "('"+app.openid+"','"+ info.name+"','"+ info.qq+"','"+ info.phone+"','"+info.other+"',"+that.data.share+")";
          console.log(that.data.share);
          mysql.insert("class_ident", "(classid,openid,ident)values(" + that.data.share + ",'" + app.openid + "','student')");
        }
        else{
          console.log("此时的share:" + that.data.share);
          var record = "(openid,name,qq,phone,other)value" + mysql.strvalue([app.openid, info.name, info.qq, info.phone, info.other]);
        }
        mysql.insert("user_info",record).then(()=>{
          that.headimg("user_head").then(()=>
          {

              if(!that.data.share)
              {
                that.setData({
                  zhuce: "class"
                });
                wx.showModal({
                  title: '提示',
                  content: '检测到您尚未创建或加入任何班级，请先创建或加入',
                  showCancel: false,
                  confirmText: "确定",
                })
              }
              else
              {
                wx.switchTab({
                  url: '../home/home',
                });
              }

             // console.log(res[6]);
          })
            });
           // wx.navigateTo({
            //  url: '../class_f/class_f',
          //  })
      }
  },

  storeClassInfo:function(e){
      var that = this;
      console.log(e.detail.value);
      var info = e.detail.value;
      var time = new Date();
      var record = "(name,intro,major,openid,date)value"+mysql.strvalue([info.name,info.intro,info.major,app.openid,time]);
      mysql.insert("classes",record).then(()=>{
        var condition = "date='"+time+"'";
        mysql.find("classes","classid,name",condition).then(res=>{
          console.log(res[0]);
          app.cur_class.id = res[0];
          app.cur_class.name = res[1];
          app.cur_class.ident = "founder"
          that.headimg("class_head").then(()=>{
;
              var record = "(classid,openid,ident)value" + mysql.strvalue([app.cur_class.id,app.openid,app.cur_ident]);
              mysql.insert("class_ident",record);
              mysql.update("user_info","openid='"+app.openid+"'","latelyclass='"+app.cur_class.id+"'").then(()=>{
                console.log("hahaaa")
                wx.switchTab({
                  url: '../home/home',
                });
              });
              
          })
      })
    })
  },

  headimg:function(filename){
    return new Promise((resolve,reject)=>{
      wx.chooseImage({
        count: 1,
        success: function (res) {
          console.log(res);
          mysql.img_upload(res.tempFilePaths[0], filename).then(r => {
              if(r)
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

  create:function(){
    var that = this;
    that.setData({
      zhuce:null,
      option:"create"
    });
  },

  join: function () {
    var that = this;
    that.setData({
      zhuce: null,
      option: "join"
    });
  },

  look_up:function(e){//查找班级
      var that = this;
      var value =e.detail.value.value;
      console.log(value)
      //console.log(Number.isInteger(value))
      //console.log(kind+value);
      mysql.find("classes","classid,name,intro,major,imagepath","classid="+value).then(res=>{
        console.log(res);
        var arr=new Array();
        console.log(arr);
        var tmp={
          id:null,
          name:null,
          intro:null,
          major:null,
          imagepath:null,
        };
        if(res && res[0])
        {

            for(var j = 0;j < 5;j++)
            {
              switch(j)
              {
                case 0:tmp.id = res[j];break;
                case 1:tmp.name = res[j];break;
                case 2: tmp.intro = res[j];break;
                case 3: tmp.major = res[j]; break;
                case 4:{
                  mysql.file_download(res[j]).then(r=>{
                    console.log(r);
                    tmp.imagepath = r;
                    that.setData({
                      find: "true",
                      find_class: tmp
                    });
                  });
                } ;break;
              }
              
            }
          console.log(tmp);

        }
        else
        {
          wx.showToast({
            title: '没有找到班级',
            icon: "none",
            mask: true
          });
        }
      });
  },

  send:function(){
    var that = this;
    var classid = that.data.find_class.id;
    var openid = app.openid;
    var check="未审核";
    var condition = "classid="+classid+" AND openid='"+openid+"'"+" AND kind='"+check+"'";
    mysql.find("system_inform","classid",condition).then(res=>{
      if(!(res && res[0])){
        console.log(res)
        mysql.insert("system_inform","(classid,openid,kind)value("+classid+",'"+openid+"','"+check+"')").then(r=>{console.log(r)});

        wx.showToast({
          title: '提交成功',
          icon: "success",
          mask: true
        });
        that.setData({
          send:true
        })
      }
      else{
        wx.showToast({
          title: '已经提交过了,请耐心等待回复',
          icon:"none",
          mask:true
        });
        that.setData({
          send: true
        })
        wx.redirectTo({
          url: './0/0',
        })
      }
    });
  },

  flush:function(){
    var that = this;
    mysql.find("system_inform","classid,kind","openid='"+app.openid+"'").then(res=>{
      if(res && res[0])
      {
        if(res[1]==='同意')
          wx.redirectTo({
            url: './0',
          });
        else if(res[1]==="拒绝")
        {
          wx.showToast({
            title: '您的请求被拒绝',
            icon: "none",
            mask: true
          });
          console.log("hasdjkfnkajsbf")
          mysql.del("system_inform","openid='" + app.openid + "' AND  kind<>'未审核'").then((res)=>{
            console.log(res);
            setTimeout(that.return_0,3000) 
          })
        }
        else{
          wx.showToast({
            title: '您的请求尚未回复，请耐心等待',
            icon: "none",
            mask: true
          });
          setTimeout(function(){
            wx.redirectTo({
              url: './0/0',
            })
          },1500)
        }
      }

      else{

      }
    })

  },

  return_0:function(){
    wx.redirectTo({
      url: './0',
    })
  }
})
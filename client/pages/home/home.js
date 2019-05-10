var constant = require("../../util/constant.js");
var app = getApp();
var mysql = require("../../module.js")


var inform_time ="";

Page({
data:{
    join:false,
    join_num:0,

    inform:true,
    vote:false,
    homework:false,

    head:{inform:"班费筹集",time1:"2018/6/9",
      vote: "本周出游投票", time2: "2018/6/9",
      homework: "高数作业", time3: "2018/6/9"},

    reply:false,
    reply_num:0,

    category_list: [],

    imgUrls: [

      { id: 1, img: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg" },

      { id: 2, img: "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg" },

      { id: '成功', img: "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg" },

    ],

    indicatorDots: true, //是否显示画板指示点

    autoplay: true, //是否自动切换

    circular: false, //是否采用衔接滑动

    interval: 5000,

    duration: 1000

  },

  onItemClick: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.name)
    switch(event.currentTarget.dataset.name)
    {
        case "邀请":{
          console.log("haha")
          var res = {};
          res.from = "button";
          that.onShareAppMessage(res);
        };break

    }

    //所需要进行的逻辑处理



  },
  bitclick: function () {
    console.log("按钮被点击")
   /* this.setData({"内容"})*/
  },
  onLoad: function () {
    var that = this;
    console.log(app.cur_class);

    var category_list = constant.category_list.concat();
    this.setData({
      category_list: category_list
    });

    that.check();
 
  },

  onPullDownRefresh:function(){
      var that = this;
      that.check();
      wx.stopPullDownRefresh();
  },

  onShow:function()
  {
    var that= this;
    that.check();

    var head = {}
    //加载一则班级通知信息
    mysql.find("class_inform", "head,settime", "classid=" + app.cur_class.id).then(res => {
      console.log(res)
      if (res && res[0]) {
        head.inform = res[0];

        //time
        var str = "";
        var temp = "";
        inform_time = res[1]
        temp = res[1].split('_')[0]
        str += temp.slice(0, 4) + "/" + temp.slice(4, 6) + "/" + temp.slice(6, 8);
        head.time1 = str;
        that.setData({
          inform: true
        })
      }

      //加载一则投票信息
      mysql.find("class_vote", "head,settime", "classid=" + app.cur_class.id).then(re => {
        if (re && re[0]) {
          head.vote = re[0];

          //time
          var str = "";
          var temp = "";
          temp = re[1].split('_')[0]
          str += temp.slice(0, 4) + "/" + temp.slice(4, 6) + "/" + temp.slice(6, 8);
          head.time2 = str;
          that.setData({
            vote: true
          })
        }

        //加载一则作业通知
        mysql.find("homework_issue", "head,settime", "classid=" + app.cur_class.id).then(r => {
          if (r && r[0]) {
            head.homework = r[0];

            //time
            var str = "";
            var temp = "";
            temp = r[1].split('-')
            str += temp[0] + "/" + temp[1] + "/" + temp[2];
            head.time3 = str;
            that.setData({
              homework: true
            })
          }
          that.setData({
            head: head
          })

        })
      })
    })
  },


  check:function(){//检测当前身份要加载的数据
      var that = this;
      
      //这个是所有身份的用户都有通知的
      var condition = "openid='"+app.openid+"' AND kind！='未审核'";
      mysql.find("system_inform", "classid", condition).then((res) => {
        console.log(res);
        if (res && res[0]) {
          that.setData({
            reply: true,
            reply_num: res.length/2,
          });
        }
        else{
          that.setData({
            reply: false,
            reply_num: 0,
          });
        }
      })
       //下面是下载所有系统消息到动态里
      if (app.cur_class.ident !== 'student') {
        var condition = "classid=" + app.cur_class.id + " AND kind='未审核'";
        mysql.find("system_inform", "classid", condition).then((res) => {
          console.log(res);
          if (res && res[0])
          {
            that.setData({
              join: true,
              join_num:res.length,
            });
          }
          else{
            that.setData({
              join: false,
              join_num: 0,
            });
          }
        })
      }
      else{
        
      }
  },


  onShareAppMessage: function(res){
    console.log(res)
    if(res.from==="button")
    {
      return {
        title: "快点加入："+app.cur_class.name,
        imageUrl:"./share.jpg",
        path: "pages/0/0?classid=" + app.cur_class.id
      }
    }
    else{
      return {
        title: "班群小助手",
        imageUrl: '/image/scenery.jpg',
        path: "pages/wxlogin/index"
    }
    }
  },
  
  navigate_shenqing: function(){
    
    wx.navigateTo({
      url: '../information/information?kind=入班申请',
    })
  },

    navigate_reply: function () {

    wx.navigateTo({
      url: '../information/information?kind=回复',
    })
  },

  detail:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.kind);
    switch (e.currentTarget.dataset.kind)
    {
      case "inform":{///进入最近一次班级通知的页面

        var head="";var content="";var settime=that.data.head.time1;var time = inform_time;var person="";
        console.log(time);
        console.log(app.cur_class.id)
            mysql.find("class_inform","openid,head,content","classid="+app.cur_class.id+" AND settime='"+time+"'").then(res=>{
              console.log(res);
              if(res[0])
              {
                  mysql.find("user_info","name","openid='"+res[0]+"'").then(r=>{
                    head = res[1];
                    content = res[2];
                    person = r[0];
                    wx.navigateTo({
                      url: './tongzhi/tongzhi_detail/detail?settime=' + settime + "&head=" + head + "&content=" + content + "&person=" + person + "&time=" + time,
                  })

              })
            }
            })
      };break;
      case "vote": {
        wx.navigateTo({
          url: './toupiao/toupiao',
        })
       }; break;
      case "homework": { 
        wx.navigateTo({
          url: './homework/homework',
        })
      }; break;
    }
  }
})
const app = getApp()

Page({
 
  data: {
   /* btns: [
      {url:'/pages/wxlogin/index',text:'登录组件'},
      { url:'/pages/my/information/information',text:'个人信息'},
    ]*/
    userListInfo: [{
      url: '/pages/my/class_join/class_join',
      icon: '/image/join.png',
      text: '班级相关'
    }, {
      url: '/pages/my/information/information',
      icon: '/image/personal.png',
      text: '个人信息'
      }, {
        url: '/pages/my/class_ident/class_ident',
        icon: '/image/personal.png',
        text: '成员身份'
      }, {
      url: '',
      icon: '/image/iconfont-help.png',
      text: '常见问题'
    }],


    userInfo:{}
  },
  onLoad: function (options) {

  },

  onShow:function(){
    var that = this;
    //console.log(wx.getStorageSync('userInfo'))
    if (app.globalData.isOnLaunch) {
      this.initPage(wx.getStorageSync('userInfo'))
    } else {
      console.log(wx.getStorageSync('userInfo'))
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      this.initPage(wx.getStorageSync('userInfo')).then(
        () => {
          console.log(that.data.userInfo)
        }
      )
    }
  },
  initPage(userInfo) {
    return new Promise((resolve, reject) =>{
      this.setData({userInfo: userInfo},() => {
        console.log(userInfo)
        resolve()
      })
    })
  },
  
  navigator(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },

  service:function(){
    console.log("haha")
  
  },
  
  fail:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    if(index === 3)//当常见问题开发后此处改
    {
      wx.showToast({
        title: '尚未开启',
        image: "../../image/sorry.png"
      })
    }
  }
})

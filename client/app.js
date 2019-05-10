//app.js


App({
    cur_class:{
      id: "7",
      name: "还是",
      ident: "teacher",
      num:"4",
    },

    user_info:{
      name: false,
        qq: false,
        phone: false,
        other: false,
    },

    location:{
      x: false,
      y: false
    },
    openid: 'oQIE95Y8846tUoReK1T5dS7BFsEA',


    onLaunch: function () {

    },

    onShow:function(){
     
    },
///获取openid并存入缓存
    getOpenid: function () {
      var that = this;
      return new Promise((resolve,reject)=>{
        var flag = false;
        wx.login({
          success(res) {
            // console.log(res);
            wx.request({
              url: 'https://www.blacklighter.cn/openid_trans.php',
              data: {
                code: res.code
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (r) {

                that.openid = r.data
                
                wx.setStorage(
                  {
                    key: "openid",
                    data: r.data
                  }
                )
                console.log("本地缓存没有openid,已创建");
                resolve();
              },
              fail: function (res) {
                console.log(res);
                resolve();
              },

            })
          }
        });
      })
    },

    login() {
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            console.log(res)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            resolve(res)
          }
        })
      })
    },
    // 获取用户信息
    // wx.getUserInfo 不需要依赖 wx.login 就能调用得到数据
    getUserInfo() {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync('userInfo', res.userInfo)
                this.globalData.isOnLaunch = true

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.onLaunchReadyCallback) {
                  this.onLaunchReadyCallback(res)
                }
              }
            })
          } else {
            wx.reLaunch({
              url: '/pages/wxlogin/index'
            })
          }
        }
      })
    },
    globalData: {
      isOnLaunch: false // 使用该变量来标示 onLaunch 中的异步请求是否完成（登录、获取用户信息）
    }
})

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  run: [
    
    { step: "4200"} ,
    { step: "4300" },
    { step: "4100" },
    { step: "4000" },
    { step: "4800" }
    
  ]
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

    this.initPage(wx.getStorageSync('userInfo'))
    this.step();
  },
  step: function () {
    var run_length =
      this.data.run.length
    //按步数排序 获取数据数组的长度

    for (var i =
      0; i < run_length; i++) {

      for (var j =
        0; j < run_length - i -
        1; j++) {

        let run_step1 =
          this.data.run[j].step

        let run_step2 =
          this.data.run[j + 1].step

        let run_index1 =
          this.data.run[j]

        let run_index2 =
          this.data.run[j + 1]

        if (run_step1 < run_step2) {
          //对比相邻两个数组元素的大小

          let zhongjie1 = run_index2.step
          //把大的数组元素的值赋值给一个中介


          run_index2.step = run_index1.step
          //把小的数组元素赋值给大的数组元素

          run_index1.step = zhongjie1
          //把中介获得的大的数组元素的值赋值给小的数组元素

        }

      }

    }

   // console.log(this.data.run)

    this.setData({

      run: this.data.run,
      //把更改的数组setData给原数组元素
      //step: true,

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
  initPage(userInfo) {
    return new Promise((resolve, reject) => {
      this.setData({ userInfo: userInfo }, () => {
        resolve()
      })
    })
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
  
  }
})
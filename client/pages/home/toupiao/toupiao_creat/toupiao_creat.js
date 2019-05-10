const app = getApp();
var chakan = require("./find.js");
var bindtime="12:01";
var votetype;
var binddata="2017-09-01";
var image;
var heads;
var arry = [null, null, null, null, null];
Page({
  data: {
    optionList: [
      {
        icon: ''
      },
      {
        icon: ''
      }
    ],
    first: "",
    second: "",
    showAddBtn: 1,
    date: "2017-09-01",
    time: "12:01",
    voteType: ['单选', '多选，最多2项', '多选，无限制'],
    voteTypeIndex: 0,
    files: []
  },

  //获取标题
  bindhead: function (e) {
    var that = this;
    that.setData({
      first: e.detail.value
    })
    heads = e.detail.value;
  },

  //投票类型（单选或多选）
  updateVoteType: function () {
    let _optionList = this.data.optionList;
    let _voteType = this.data.voteType;
    _voteType = [];
    _optionList.map(function (obj, i) {
      if (i === 0) {
        _voteType.push('单选');
      } else {
        _voteType.push('多选，最多' + (i + 1) + '项');
      }
      console.log(i)
      console.log(_voteType)
    })
    _voteType.push('多选，无限制');
    this.setData({ voteType: _voteType });
    console.log("✌");
  },

  //发布
  showTopTips: function () {
    var lasttime = binddata + "-" + bindtime;
    console.log(lasttime);
    console.log(votetype);
    console.log(heads);
    console.log(arry);
    var time = chakan.getTime();
    var record = "(classid,settime,head,deadline,selectnum,option1,option2,option3,option4,option5)value(" + app.cur_class.id + ",'" + time + "','" + heads + "','" + lasttime + "','" + votetype + "','" + arry[0] + "','" + arry[1] + "','" + arry[2] + "','" + arry[3] + "','" + arry[4] + "')"
    chakan.insert("class_vote", record).then(
      function (res) {
        console.log(res);
        wx.showToast({
          title: '发布成功',
          icon:"success"
        });
        setTimeout(function(){
          wx.switchTab({
            url: '../../home',
          })
        },1500)
      }
    )
  },

  //获取单选或多选
  bindVoteTypeChange: function (e) {
    this.setData({
      voteTypeIndex: e.detail.value
    })
    votetype = e.detail.value;
    console.log(e.detail.value);
  },

  //获取时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
    bindtime = e.detail.value;
    console.log(e.detail.value);
  },

  //获取日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    binddata = e.detail.value;
    console.log(e.detail.value);
  },

  //选项输入
  recordValue: function (e) {
    let _optionList = this.data.optionList;
    let _index = e.target.dataset.index;
    let value = e.detail.value;
    _optionList[_index].value = value;
    this.setData({ optionList: _optionList });
    console.log(value);
    for (var i = 0; i < _optionList.length; i++)
      arry[i] = _optionList[i].value;
    console.log(arry);
  },

  //添加选项
  addOption: function (e) {
    let _optionList = this.data.optionList;
    _optionList.push({ icon: '/images/common/5.png' })
    this.setData({ optionList: _optionList });
    // 选项大于5个后移除添加按钮
    if (_optionList.length >= 5) {
      this.setData({ showAddBtn: 0 });
    }
    // 更新投票选项
    this.updateVoteType();
  },

  //选项前的图片添加
  delOption: function (e) {
    let _index = e.target.dataset.index;
    let _optionList = this.data.optionList;
    _optionList.splice(_index, 1);
    this.setData({ optionList: _optionList })
    // 更新投票选项
    this.updateVoteType();
  },

  //选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1, // 最多可以选择的图片张数
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        image = tempFilePaths[0];
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  //显示图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  }
});
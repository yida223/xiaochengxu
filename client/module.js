var app = getApp();

function insert(tname, record) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://www.blacklighter.cn/insert.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        tname: tname,
        record: record
      },
      success: function (res) {
        console.log("插入时连接数据库成功");
        resolve(res.data);
      },
      fail: function (res) {
        console.log("插入时连接数据库失败");
        resolve(res.data)
      },
    })
  })
}

function del(tname, condition) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://www.blacklighter.cn/del.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        tname: tname,
        condition: condition
      },
      success: function (res) {
        console.log("删除时连接数据库成功");
        resolve(res.data);
      },
      fail: function (res) {
        console.log("删除时连接数据库失败");
        resolve(res.data);
      }
    })
  })
}

function update(tname, condition, record) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://www.blacklighter.cn/update.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        tname: tname,
        condition: condition,
        record: record
      },
      success: function (res) {
        console.log("更新时连接数据库成功");
        resolve(res.data);
      },
      fail: function (res) {
        console.log("更新时连接数据库失败");
        resolve(res.data);
      }
    })
  })
}

function find(tname, cname, condition) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://www.blacklighter.cn/find.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        tname: tname,
        cname: cname,
        condition: condition,
      },
      success: function (res) {
        console.log("查找时连接数据库成功");
        //console.log(res.data);
        resolve(res.data);
      },
      fail: function (res) {
        console.log("查找时连接数据库失败");
        resolve(res.data);
      }
    })
  })
}

//该接口用于上传图片
function img_upload(path, filename, formData)//path为图片选择后的地址，php会根据filename名判断是否要向数据库添加额外信息
{
  if (!formData)
    var formData = {}; 
  formData.postfix = ".png";//后缀
  formData.filename = filename;//img具体的逻辑类型
   
  if (!formData.openid)
    formData.openid = app.openid;
  if (!formData.classid)
    formData.classid = app.cur_class.id;

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://www.blacklighter.cn/img_upload.php',
      filePath: path,
      formData: formData,
      name: "img",
      success: function (res) {
        console.log(res.data);
        resolve();
      },
      fail: function (res) {
        console.log("上传失败:" + res.data);
        resolve();
      }
    })
  }
  )
}

function strvalue(x) {
  console.log(x);
  var str = "(";
  for (var i = 0; i < x.length; i++) {
    if (i != x.length - 1)
      str += ("'" + x[i] + "',");
    else {
      str += ("'" + x[i] + "')");
    }
  }
  console.log(str)
  return str;
}

function file_download(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: "https://www.blacklighter.cn/" + url,
      success: function (res) {
        resolve(res.tempFilePath);
      },
      fail: function (res) {
        console.log("下载文件失败：" + res);
      }
    })
  });
}

function file_del(url) {//服务器文件删除
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://www.blacklighter.cn/file_del.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        path: url
      },
      success: function (res) {
        //console.log(res.data);
        console.log(res.data + "删除文件时一定要记得删除对应数据库数据");
        resolve();
      }
    })
  });
}

function getTime() {//以“年月日_时分秒”的格式返回一个当前时间的字符串 
  var str = "";
  var a = new Date();
  var time = [a.getMonth()+1, a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds()] ;
  str += a.getFullYear();
  for(var i = 0;i < 2;i++)
  {
    if(time[i]<10)
      time[i]= '0'+time[i];
    str += time[i];
  }
  str += '_';
  for (var i = 2; i < time.length; i++) {
    if (time[i] < 10)
      time[i] = '0' + time[i];
    str += time[i];
  }
  return str;
}

module.exports.getTime = getTime;
module.exports.file_del = file_del;
module.exports.file_download = file_download;
module.exports.img_upload = img_upload;
module.exports.insert = insert;
module.exports.del = del;
module.exports.update = update;
module.exports.find = find;
module.exports.strvalue = strvalue;

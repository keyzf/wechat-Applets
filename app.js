//app.js定义页面启动入口
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getWeatherInfo:function(city,fc){
    wx.request({
      url: "https://free-api.heweather.com/s6/weather/forecast?location="+city+"&key=5a27e7497fb849729ced5631fe9260cd",
      success:function(res){
        fc(res.data)
      },
      fail:function(){
        console.log("fail")
      }
    })
  },
  getLifestyleInfo:function(city,fc){
    wx.request({
      url: "https://free-api.heweather.com/s6/weather/lifestyle?location=" + city +"&key=5a27e7497fb849729ced5631fe9260cd",
      success:function(res){
        console.log(res)
        fc(res.data)
      }
    })
  },
  getCurWeatherInfo:function(city,fc){
    wx.request({
      url: "https://free-api.heweather.com/s6/weather/now?location=" + city + "&key=5a27e7497fb849729ced5631fe9260cd",
      success: function (res) {
        console.log(res)
        fc(res.data)
      }
    })
  },
  globalData: {
    userInfo: null,
  }
})

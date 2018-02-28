//index.js
//获取应用实例
import{
  formatTime
}from "../../utils/util.js"
const app = getApp()
var today=formatTime(new Date())
var cityArray=require("../../utils/citys.js")
var picToUrl = {
  '紫外线指数': "https://t1.picb.cc/uploads/2018/02/03/sI6Bc.png",
  '中雨': 'https://t1.picb.cc/uploads/2018/02/03/sIf8j.png',
  '中雪': "https://t1.picb.cc/uploads/2018/02/03/sIwwy.png",
  '阵雨': 'https://t1.picb.cc/uploads/2018/02/28/YjCS0.png',
  '强阵雨': 'https://t1.picb.cc/uploads/2018/02/28/YjCS0.png',
  '运动指数': 'https://t1.picb.cc/uploads/2018/02/03/sIk7X.png',
  '雨夹雪': "https://t1.picb.cc/uploads/2018/02/03/sIgeg.png",
  '阴': 'https://t1.picb.cc/uploads/2018/02/03/sI2aR.png',
  '小雨': "https://t1.picb.cc/uploads/2018/02/03/sIy1w.png",
  '小雪': "https://t1.picb.cc/uploads/2018/02/03/s6o2W.png",
  "洗车指数": "https://t1.picb.cc/uploads/2018/02/03/s6YXL.png",
  "雾霾": "https://t1.picb.cc/uploads/2018/02/03/s6K8i.png",
  "雾": "https://t1.picb.cc/uploads/2018/02/03/s6EZv.png",
  "特大暴雨": "https://t1.picb.cc/uploads/2018/02/03/s6zTD.png",
  "舒适度指数": "https://t1.picb.cc/uploads/2018/02/03/s6s7u.png",
  "晴间多云": "https://t1.picb.cc/uploads/2018/02/03/s6Una.png",
  "雷阵雨": "https://t1.picb.cc/uploads/2018/02/03/s6xm0.png",
  "风": "https://t1.picb.cc/uploads/2018/02/03/s6B5F.png",
  "晴": "https://t1.picb.cc/uploads/2018/02/03/s69Dd.png",
  "多云": "https://t1.picb.cc/uploads/2018/02/03/s6XZt.png",
  "大雨": "https://t1.picb.cc/uploads/2018/02/03/s60TM.png",
  "大雪": "https://t1.picb.cc/uploads/2018/02/03/s6pqT.png",
  "大风": "https://t1.picb.cc/uploads/2018/02/03/s6jn6.png",
  "大暴雪": "https://t1.picb.cc/uploads/2018/02/03/s6aD7.png",
  "暴雪":"https://t1.picb.cc/uploads/2018/02/03/s6aD7.png",
  "暴雨": "https://t1.picb.cc/uploads/2018/02/03/s6Nme.png",
  "旅游指数": "https://t1.picb.cc/uploads/2018/02/03/s6Ta1.png",
  "空气污染扩散条件指数": "https://t1.picb.cc/uploads/2018/02/03/s6R2J.png",
  "感冒指数": "https://t1.picb.cc/uploads/2018/02/03/s6FXr.png",
  "穿衣指数": "https://t1.picb.cc/uploads/2018/02/03/s6QQs.png",
  "冻雨":"https://t1.picb.cc/uploads/2018/02/03/snJWX.png",
  "阵雪":"https://t1.picb.cc/uploads/2018/02/08/zkACa.png"
}
Page({
  data: {
    'picUrl':picToUrl,
    "provinces":[],
    'cities':[],
    'districts':[],
    'weatherInfo':null,//7天的天气信息
    'lifestyle':null,//生活指数信息
    'city':'',//当前城市
    'province':"",//当前省
    'curWeather':null,//实时天气
    'value':[0,0,0],
    'values':[0,0,0],
    "selectCityView":false,
    'lifestyleIndex':{'comf':"舒适度指数","drsg":"穿衣指数","flu":"感冒指数","sport":"运动指数","trav":"旅游指数","uv":"紫外线指数","cw":"洗车指数","air":"空气污染扩散条件指数"}
  },
  onLoad: function () {
    //console.log(this.data.picUrl)
    this.getLocation()
    var that=this
    cityArray.init(that)
    var cityInfo=that.data.cityInfo
    const provinces=[]
    const cities=[]
    const districts=[]
    for(var i=0;i<cityInfo.length;i++){
      provinces.push(cityInfo[i].name)
    }
    //console.log(provinces)
    for(var i=0;i<cityInfo[0].sub.length;i++){
      cities.push(cityInfo[0].sub[i].name)
    }
    //console.log(cities)
    for(var i=0;i<cityInfo[0].sub[0].sub.length;i++){
      districts.push(cityInfo[0].sub[0].sub[i].name)
    }
    //console.log(districts)
    that.setData({
      'provinces':provinces,
      'cities':cities,
      'districts':districts
    })
    //console.log(today)
  },
  getLocation:function(){
    var that=this
    wx.getLocation({
      type:'wgs84',
      success: function(res) {
        //console.log(res)
        var longitude=res.longitude
        var latitude=res.latitude
        that.getCityInfo(latitude,longitude)
      }
    })
  }, 
  getCityInfo: function (latitude, longitude) {
    var that=this
    wx.request({
      url: "https://api.map.baidu.com/geocoder/v2/?ak=GsY2E5cPeYz4ZkQtmNTG4ULwZH2WZkex&location=" + latitude + ',' + longitude + '&output=json',
      success: function (res) {
        //console.log(res)
        var currentCity = res.data.result.addressComponent.district
        var curProvince = res.data.result.addressComponent.province
        that.setData({
          city:currentCity,
          province:curProvince
        })
        app.getWeatherInfo(that.data.city,function(data){
          that.setData({
            weatherInfo:data.HeWeather6[0].daily_forecast
          })
        })
        app.getLifestyleInfo(that.data.city, function (data) {
          that.setData({
            lifestyle: data.HeWeather6[0].lifestyle
          })
        })
        app.getCurWeatherInfo(that.data.city,function(data){
          that.setData({
            curWeather: data.HeWeather6[0].now
          })
        })

      },
      fail: function () {
        console.log("定位失败")
      }
    })
  },
  addCity:function(){
    var show = this.data.selectCityView
    if(show===true){
      this.setData({
        selectCityView:false
      })
    }else{
      this.setData({
        selectCityView: true
      })
    }
  },
  cancel:function(){
    this.setData({
      selectCityView: false
    })
  },
  confirm:function(){
    var that=this
    var district=this.data.districts[this.data.values[2]]
    var province=this.data.provinces[this.data.values[0]]
    this.setData({
      province:province,
      city:district,
      selectCityView:false
    })
    app.getWeatherInfo(district, function (data) {
      that.setData({
        weatherInfo: data.HeWeather6[0].daily_forecast
      })
    })
    app.getLifestyleInfo(district, function (data) {
      that.setData({
        lifestyle: data.HeWeather6[0].lifestyle
      })
    })
    app.getCurWeatherInfo(district, function (data) {
      that.setData({
        curWeather: data.HeWeather6[0].now
      })
    })
  },
  bindChange:function(e){
    //console.log(e)
    var cityInfo=this.data.cityInfo
    var value=e.detail.value
    var values=this.data.values
    if(value[0]!=values[0]){
      let cities=[],districts=[]
      for (let i = 0; i < cityInfo[value[0]].sub.length; i++) {
        cities.push(cityInfo[value[0]].sub[i].name)
      }
      for (let i = 0; i < cityInfo[value[0]].sub[0].sub.length; i++) {
        districts.push(cityInfo[value[0]].sub[0].sub[i].name)
      }
      this.setData({
        cities:cities,
        districts:districts,
        values:value,
        value:[value[0],0,0]
      })
    }

    if(value[1]!=values[1]){
      let districts = []
      for (let i = 0; i < cityInfo[value[0]].sub[value[1]].sub.length; i++) {
        districts.push(cityInfo[value[0]].sub[value[1]].sub[i].name)
      }
      this.setData({
        districts: districts,
        values:value,
        value:[value[0],value[1],0]
      })
    }
    if(value[2]!=values[2]){
      this.setData({
        values: value,
      })
    }
  },
})

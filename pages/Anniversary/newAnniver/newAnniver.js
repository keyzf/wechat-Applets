import {
  formatTime
} from "../../../utils/util.js"
Page({
  data: {
    "date":'',
    'inputTxt':''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var today=formatTime(new Date())
    //console.log(today)
    this.setData({
      date:today
    })
    //console.log(today)
  },
  inputEvent:function(e){
    //console.log(e.detail.value)
    this.setData({
      inputTxt:e.detail.value
    })
  },
  bindDateChange:function(e){
    //console.log(e.detail.value)
    this.setData({
      date:e.detail.value
    })
  },
  saveEvent:function(){
    var pageArray=getCurrentPages()
    //console.log(pageArray)
    var txt=this.data.inputTxt
    var date=this.data.date
    var aDate=date.split("-")
    var oDate=new Date(aDate[1]+"-"+aDate[2]+"-"+aDate[0])
    let curDate=new Date()
    let saveDate = formatTime(new Date())
    let id = curDate.getTime()
    var days=parseInt(Math.abs(curDate-oDate)/(1000*60*60*24))
    var anniver={"date":date,'text':txt,'time':days,'id':id,'saveDate':saveDate}
    wx.navigateBack({
      success:function(res){
        //console.log(pageArray[pageArray.length - 2].data.Anniversary)
        var anniversary = pageArray[pageArray.length - 2].data.Anniversary
        anniversary.splice(0, 0, anniver)
        pageArray[pageArray.length-2].setData({
          Anniversary: anniversary,
          showTip:false
        })
        wx.setStorage({
          key: 'Anniversary',
          data: anniversary,
        })
      }
    })
  }
})
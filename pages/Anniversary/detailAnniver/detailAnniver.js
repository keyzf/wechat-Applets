// pages/detailAnniver/detailAnniver.js
import {
  formatTime
} from "../../../utils/util.js"
Page({
  data: {
    'event':'',
    'date':'',
    'detailId':0
  },
  onLoad: function (options) {
    var op=JSON.parse(options.detail)
    //console.log(op)
    this.setData({
      event: op.text,
      date: op.date,
      detailId: op.id
    })
  },
  inputEvent:function(e){
    //console.log(e.detail.value)
    this.setData({
      event: e.detail.value
    })
  },
  bindDateChange:function(e){
   // console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  delEvent:function(){
    var id = this.data.detailId
    var pages = getCurrentPages()
    //console.log(pages)
    wx.navigateBack({
      success: function (res) {
        var Anniver = pages[0].data.Anniversary
        for (let i = 0; i < Anniver.length;) {
          if (Anniver[i].id === id) {
            Anniver.splice(i, 1)
            break
          } else {
            i++
          }
        }
        pages[0].setData({
          Anniversary: Anniver,
          showTip:Anniver.length===0?true:false
        })
        wx.setStorage({
          key: 'Anniversary',
          data: Anniver,
        })
        wx.setStorage({
          key: 'AnniversaryNewDate',
          data: formatTime(new Date()),
        })
      }
    })
  },
  saveEvent:function(){
    var id=this.data.detailId
    var pages=getCurrentPages()
    var date=this.data.date
    var aDate = date.split("-")
    var oDate = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0])
    var curDate = new Date()
    var days = parseInt(Math.abs(curDate - oDate) / (1000 * 60 * 60 * 24))
    //console.log(pages)
    var anniver = { 'text': this.data.event, 'date': this.data.date, 'time': days, 'id': this.data.detailId}
    wx.navigateBack({
      success:function(res){
        var Anniver=pages[0].data.Anniversary
        for(let i=0;i<Anniver.length;){
          if(Anniver[i].id===id){
            Anniver[i]=anniver
            break
          }else{
            i++
          }
        }
        pages[0].setData({
          Anniversary:Anniver
        })
        wx.setStorage({
          key: 'Anniversary',
          data: Anniver,
        })
        wx.setStorage({
          key: 'AnniversaryNewDate',
          data: formatTime(new Date()),
        })
      }
    })
  }
})
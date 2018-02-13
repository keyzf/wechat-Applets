import{
  formatTime
}from "../../utils/util.js"
Page({
  data: {
    "Anniversary":[],
    'newDate':'',
    'showTip':true
  },
  onLoad: function (options) {
    var Anniversary = wx.getStorageSync("Anniversary")
    if(typeof Anniversary!=='object'){
      Anniversary=[]
    }
    var newDate = wx.getStorageSync("AnniversaryNewDate")
    var curDate=formatTime(new Date())
    if(newDate!==curDate&&Anniversary.length!==0){
      for(let i=0;i<Anniversary.length;i++){
        Anniversary[i].time+=1
      }
    }
    this.setData({
      Anniversary: Anniversary,
      showTip:Anniversary.length===0?true:false
    })
  },
  addAnniver:function(){
    wx.navigateTo({
      url: 'newAnniver/newAnniver',
    })
  },
  clickAnniver:function(e){
    //console.log(e)
    var anniver
    var that=this
    //console.log(e.currentTarget.dataset.anniverId)
    var anniverId = e.currentTarget.dataset.anniverId
    for (let i = 0; i < that.data.Anniversary.length;){
      if (that.data.Anniversary[i].id === anniverId){
        anniver = that.data.Anniversary[i]
        break
      }else{
        i++
      }
    }
    wx.navigateTo({
      url: 'detailAnniver/detailAnniver?detail='+JSON.stringify(anniver),
    })
  }
})
//logs.js
const util = require('../../utils/util.js')
const date=new Date()
const y=date.getFullYear()
const mon=date.getMonth()
const d=date.getDate()-1
var years=[],months=[],days=[]
for(let i=1990;i<=y;i++){
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
var indexOfYear=years.indexOf(y)
Page({
  data: {
    'inOrOut':0,//0表示支出，1表示收入
    'bills': [],//账单历史记录
    'consumeType':'', //消费类型
    'billBtnShow':false,
    'incomeViewShow':false,
    'expendViewShow':false,
    'totalExpenses':0.00,
    'totalIncome':0.00,
    'surplus':0.00,
    'inputViewShow':false,
    'years':years,
    'months':months,
    'days':days,
    'value':[indexOfYear,mon,d],
    'values': [indexOfYear,mon, d],
    'event':'',
    'moneyStr':null,
    "money":0
  },
  onLoad: function () {
    var history = wx.getStorageSync('billsHistory')
    //console.log(typeof history)
    if (typeof history !== "object") {
      history = { 'bills': [], 'totalExpenses': 0, 'totalIncome': 0,"surplus":0}
    }
    this.setData({
      bills:history.bills,
      totalExpenses: history.totalExpenses,
      totalIncome:history.totalIncome,
      surplus:history.surplus
    })
    //console.log(history)
  },
  deleteItem:function(e){
    var that=this
    var billId=e.currentTarget.dataset.billsId
    var bills=this.data.bills
    var money
    for(let i=0;i<bills.length;){
      if(bills[i].id===billId){
        money=bills[i].money
        console.log(money)
        wx.showModal({
          title: '删除',
          content: '是否删除此记录？',
          success:function(res){
            if(res.confirm===true){
              bills.splice(i,1)
              if (money >= 0) {
                that.setData({
                  bills: bills,
                  totalIncome: Number((that.data.totalIncome - money).toFixed(2)),
                  surplus:Number((that.data.surplus-money).toFixed(2))
                })
              } else {
                that.setData({
                  bills: bills,
                  totalExpenses: Number((that.data.totalExpenses + money).toFixed(2)),
                  surplus: Number((that.data.surplus - money).toFixed(2))
                })
              }
              var history = { 'bills': that.data.bills, 'totalExpenses': that.data.totalExpenses, 'totalIncome': that.data.totalIncome ,"surplus":that.data.surplus}
              wx.setStorage({
                key: 'billsHistory',
                data: history,
              })
            }
          }
        })
        break
      }else{
        i++;
      }
    }
  },
  bindChange:function(e){
    var val=e.detail.value
    var values=this.data.value
    if(val[0]!=values[0]){
      let months=[],days=[]
      for(let i=1;i<=12;i++){
        months.push(i)
      }
      for(let i=1;i<=31;i++){
        days.push(i)
      }
      this.setData({
        months:months,
        days:days,
        values:val,
        value: [val[0], 0, 0],
      })
    }
    if(val[1]!=values[1]){
      let year=this.data.years[val[0]]
      let days=[]
      if(val[1]===1&&year%4===1){
        for(let i=1;i<=28;i++){
          days.push(i)
        }
      }
      if (val[1] === 1 && year % 4 === 0) {
        for (let i = 1; i <= 29; i++) {
          days.push(i)
        }
      }
      if (val[1] === 1 && year % 4 !== 1) {
        for (let i = 1; i <= 28; i++) {
          days.push(i)
        }
      }
      if (val[1] === 0||val[1] === 2||val[1] === 4 || val[1] === 6 || val[1] === 7 || val[1] === 9 || val[1] === 11) {
        for (let i = 1; i <= 31; i++) {
          days.push(i)
        }
      }
      if (val[1] === 3 || val[1] === 5 || val[1] === 8 || val[1] === 10){
        for(let i=1;i<=30;i++){
          days.push(i)
        }
      }
      this.setData({
        days:days,
        values:val,
        value:[val[0],val[1],0]
      })
    }
    if(val[2]!=values[2]){
      this.setData({
        values:val
      })
    }
  },
  eventinput:function(e){
    this.setData({
      event:e.detail.value
    })
  },
  moneyinput:function(e){
    //console.log(Number(e.detail.value))
    var money=Number(Number(e.detail.value).toFixed(2))
    console.log(money)
    if(isNaN(money)){
      return
    }else{
      this.setData({
        money:money
      })
    } 
  },
  addToHistory:function(){
    console.log(this.data.money)
    var values=this.data.values
    var bills=this.data.bills
    var date=this.data.years[values[0]]+'-'+this.data.months[values[1]]+'-'+this.data.days[values[2]]
    if(this.data.money===null){
      return
    }
    if(this.data.inOrOut===1){
      var expensesRecord = { 'date': date, "type": this.data.consumeType, "money": this.data.money, "event": this.data.event, 'id': new Date().getTime()}
    }else{
      var expensesRecord = { 'date': date, "type": this.data.consumeType, "money": -this.data.money, "event": this.data.event ,'id':new Date().getTime()}
    }
    //console.log(expensesRecord)
    bills.splice(0,0,expensesRecord)
    if (this.data.inOrOut === 1) {
      this.setData({
        billBtnShow: false,
        incomeViewShow: false,
        expendViewShow: false,
        inputViewShow: false,
        bills: bills,
        event:"",
        totalIncome: Number((this.data.totalIncome + this.data.money).toFixed(2)),
        //surplus: Number((this.data.totalIncome - this.data.totalExpenses).toFixed(2))
      })
    } else {
      this.setData({
        billBtnShow: false,
        incomeViewShow: false,
        expendViewShow: false,
        inputViewShow: false,
        bills: this.data.bills,
        event:"",
        totalExpenses: Number((this.data.totalExpenses + this.data.money).toFixed(2)),
        //surplus:Number((this.data.totalIncome-this.data.totalExpenses).toFixed(2))
      })
    }
    this.setData({
      surplus: Number((this.data.totalIncome - this.data.totalExpenses).toFixed(2))
    })
    var history = wx.getStorage({
      key: 'billsHistory',
      success: function (res) { },
    })
    if (typeof history !== "object") {
      history = { 'bills': [], 'totalExpenses': 0, 'totalIncome': 0,"surplus":0}
    }
    history.bills=this.data.bills
    history.totalExpenses = this.data.totalExpenses
    history.totalIncome=this.data.totalIncome,
    history.surplus=this.data.surplus
    //console.log(history)
    wx.setStorageSync('billsHistory', history)
  },
  addExpend:function(e){
    //console.log(e)
    this.setData({
      inOrOut:0,
      consumeType:e.currentTarget.id,
      inputViewShow:true
    })
  },
  addIncome:function(e){
    //console.log(e.currentTarget.id)
    this.setData({
      inOrOut:1,
      consumeType:e.currentTarget.id,
      inputViewShow:true
    })
  },
  addCount:function(){
    var billBtn = this.data.billBtnShow
    if (billBtn === true) {
      this.setData({
        billBtnShow: false,
        expendViewShow:false,
        incomeViewShow:false,
        inputViewShow:false
      })
    } else {
      this.setData({
        billBtnShow: true
      })
    }
  },
  incomeShow:function(){
    var income = this.data.incomeViewShow
    if(income===true){
      this.setData({
        incomeViewShow:false
      })
    }else{
      this.setData({
        incomeViewShow:true,
        expendViewShow:false,
        inOrOut:1
      })
    }
  },
  expendShow:function(){
    var expend = this.data.expendViewShow
    if (expend === true) {
      this.setData({
        expendViewShow: false
      })
    } else {
      this.setData({
        expendViewShow: true,
        incomeViewShow:false,
        inOrOut:0
      })
    }
  },
})

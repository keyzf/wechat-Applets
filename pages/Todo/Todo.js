import{
  formatTime
} from "../../utils/util.js"
Page({
  data: {
    "todoList":[],
    "todoinput":null,
    "uncompletedNum":0,
    "inputContent":'',
  },
  btnClick:function(){
    if(this.data.todoinput!==null){
      const newTodo={
        "id":new Date().getTime(),
        "todo":this.data.todoinput,
        "completed":false
      }
      this.data.todoList.push(newTodo)
      this.setData({
        "todoinput":null,
        "todoList":this.data.todoList,
        "uncompletedNum":this.data.uncompletedNum+1,
        "inputContent":''
      })
      this.storageHistory() 
    }
  },
  storageHistory:function(){
    var today = formatTime(new Date())
    //console.log(today)
    var history=wx.getStorage({
      key: 'todoHistory',
      success: function(res) {},
    })
    if(typeof history!== "object"){
      history=[]
    }
    console.log(history)
    if(history[0]===today){
      history[1] = this.data.todoList
    }else{
      history[1] = this.data.todoList
      history[0]=today
    }
    wx.setStorage({
      key: 'todoHistory',
      data: history,
    })
  },
  input:function(event){
    this.setData({todoinput:event.detail.value})
  },
  toggleTodo:function(e){
    console.log(e)
    const todoId = e.currentTarget.dataset.todoId
    for (var i = 0; i < this.data.todoList.length; i++) {
      if (this.data.todoList[i].id === todoId) {
        if(this.data.todoList[i].completed===false){
          this.data.todoList[i].completed=true
          this.data.uncompletedNum-=1
        }else{
          this.data.todoList[i].completed=false
          this.data.uncompletedNum += 1
        }
      }
    }
    this.setData({
      todoList:this.data.todoList,
      uncompletedNum: this.data.uncompletedNum
    })
    this.storageHistory()
  },
  deleteTodo:function(e){
    const todoId=e.currentTarget.dataset.todoId
    for(var i=0;i<this.data.todoList.length;i++){
      if (this.data.todoList[i].id===todoId){
        if(this.data.todoList[i].completed===false){
          this.data.uncompletedNum-=1
        }
        this.data.todoList.splice(i,1)
        
      }
    }
    this.setData({
      todoList:this.data.todoList,
      uncompletedNum:this.data.uncompletedNum
    })
    this.storageHistory()  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var history = wx.getStorageSync('todoHistory')
    var today = formatTime(new Date())
    if(typeof history!=="object"){
      history=[]
    }else{
      if(history[0]!==today){
        this.setData({
          "todoList": [],
          "uncompletedNum": 0
        })
      }else{
        this.setData({
          "todoList": history[1],
          "uncompletedNum": history[1].length
        })
      }
    }
  }
})
// pages/publish/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('Publish page loaded')
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getUserInfo: function() {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getUserInfo'
      },
      config: {
        env: 'cloud1-4gwxmwly93725352'
      }
    }).then(res => {
      if (res.result.success) {
        this.setData({
          userInfo: res.result.userInfo
        })
      }
    }).catch(err => {
      console.error('获取用户信息失败：', err)
    })
  },

  handlePublish: function () {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '发布中...',
    })

    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'createActivity',
        title: 'new act'
      },
      config: {
        env: 'cloud1-4gwxmwly93725352'
      }
    }).then(res => {
      wx.hideLoading();
      console.log('createActivity succ: ', res)
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 2000
      })
      
      const pages = getCurrentPages()
      const indexPage = pages.find(page => page.route === 'pages/feed/index')
      if (indexPage) {
        indexPage.onLoad()
      }
      
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    }).catch(err => {
      wx.hideLoading();
      console.log('createActivity err: ', err)
      wx.showToast({
        title: '获取活动列表失败',
        icon: 'none'
      });
    });
  }

})
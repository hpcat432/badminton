// pages/publish/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkOpenId()
    this.checkUserInfo()
  },

  checkUserInfo: function () {
    if (app.userInfo == null) {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getUser'
        },
        config: {
          env: 'cloud1-4gwxmwly93725352'
        }
      }).then(res => {
        let data = res.result.data.data
        let info = {
          avatarUrl: data[0].userInfo.avatar,
          userName: data[0].userInfo.userName
        }
        if (data.length > 0) {
          app.userInfo = info
        }
      }).catch(err => {
        console.log(err)
      });
    } else {
      console.log('cached userInfo: ', app.userInfo)
    }

  },

  checkOpenId: function () {
    if (!app.openid || app.openid.length <= 0) {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOpenId'
        },
        config: {
          env: 'cloud1-4gwxmwly93725352'
        }
      }).then(res => {
        console.log(res.result.openid)
        app.openid = res.result.openid
      })
    } else {
      console.log('cached openId: ' + app.openid)
    }
  },

  onInput: function (e) {
    this.setData({
      activityName: e.detail.value
    });
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

  gotoMap() {
    // wx.navigateTo({
    //   url: '/pages/utils/map/index',
    // });
    wx.chooseLocation({})
      .then(res => {
        console.log('res: ', res)
      })
      .catch(err => {
        console.log('err: ', err)
      })
  },

  handlePublish: function () {
    console.log('handlePublish : ', app.userInfo, this.data.activityName)
    return;

    wx.showLoading({
      title: '发布中...',
    })

    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'createActivity',
        title: this.data.inputValue
      },
      config: {
        env: 'cloud1-4gwxmwly93725352'
      }
    }).then(res => {
      wx.hideLoading();
      console.log('createActivity succ: ', res.result)
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
        title: '失败',
        icon: 'none'
      });
    });
  }

})
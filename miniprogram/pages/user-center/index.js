const {
  envList
} = require('../../envList');

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    avatarUrl: ''
  },

  onLoad() {
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
      if (data.length > 0) {
        this.setData({
          avatarUrl: data[0].userInfo.avatar,
          userName: data[0].userInfo.userName
        })
      } else {
        this.setData({
          avatarUrl: '/images/icons/avatar.png',
          userName: '请点击登录'
        })
      }
    }).catch(err => {
      console.log(err)
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  getOpenId() {
    wx.login({
      success: (res) => {
        console.log('getOpenId : ', res)
      },
    })
  },

  registerOrEdit(e) {
    const userName = (this.data.userName.length > 0 && this.data.userName != '请点击登录') ? encodeURIComponent(this.data.userName) : ''
    const avatarUrl = this.data.avatarUrl.length > 0 ? encodeURIComponent(this.data.avatarUrl) : 'null'
    console.log('userName: ', userName)
    const url = `/pages/user/userEdit/index?userName=${userName}&avatar=${avatarUrl}`
    wx.navigateTo({
      url: url
    })
  },

  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },

});
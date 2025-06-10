const {
  envList
} = require('../../envList');
const app = getApp();

// pages/user-center/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    avatarUrl: '',
    statusBarHeight: 0,
    userInfo: {},
    showTip: false,
    title: '',
    content: '',
    userINfo: null,
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
    
    // 获取用户信息
    // this.getUserInfo();

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
      console.log('getUser', data)
      if (data.length > 0) {
        this.setData({
          avatarUrl: data[0].userInfo.avatar,
          userName: data[0].userInfo.userName,
          userInfo: data[0].userInfo
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
    // const avatarUrl = undefined
    const {gender, zyLevel} = this.data.userInfo
    console.log('registerOrEdit : ', this.data.userInfo)
    const url = `/pages/user/userEdit/index?userName=${userName}&avatar=${avatarUrl}&gender=${gender}&zyLevel=${zyLevel}`
    wx.navigateTo({
      url: url
    })
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      const db = wx.cloud.database();
      const userInfo = await db.collection('users').where({
        _openid: app.globalData.openid
      }).get();
      
      if (userInfo.data.length > 0) {
        this.setData({
          userInfo: userInfo.data[0]
        });
      }
    } catch (error) {
      console.error('获取用户信息失败：', error);
    }
  },

  handleMyActivities() {
    console.log('handleMyActivities')
    wx.navigateTo({
      url: '/pages/activity/list/index',
      success: () => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 处理我的收藏
  handleMyFavorites() {
    wx.navigateTo({
      url: '/pages/my-favorites/index'
    });
  }
});
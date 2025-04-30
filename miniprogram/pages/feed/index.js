Page({
  data: {
    activityList: []
  },

  onLoad: function (options) {
    this.fetchActivityList();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected:1
      })
    }
  },

  fetchActivityList() {
    wx.showLoading({
      title: '加载中...',
    });
    
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'fetchActivityList'
      },
      config: { env: 'cloud1-4gwxmwly93725352'}
    }).then(res => {
      wx.hideLoading();
      const activityList = res.result.dataList || [];
      console.log('activityList size : ', activityList[0].owner)
      this.setData({
        activityList
      });
    }).catch(err => {
      wx.hideLoading();
      console.error('获取活动列表失败：', err);
      wx.showToast({
        title: '获取活动列表失败',
        icon: 'none'
      });
    });
  }
}) 
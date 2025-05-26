Page({
  data: {
    activityId: '',
    activityDetail: null
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        activityId: options.id
      });
      // 获取活动详情
      this.getActivityDetail();
    }
  },

  // 获取活动详情
  getActivityDetail() {
    wx.showLoading({
      title: '加载中...',
    });

    const db = wx.cloud.database();
    db.collection('activity').doc(this.data.activityId).get().then(res => {
      wx.hideLoading();
      console.log('活动详情：', res.data);
      this.setData({
        activityDetail: res.data
      });
    }).catch(err => {
      wx.hideLoading();
      console.error('获取活动详情失败：', err);
      wx.showToast({
        title: '获取活动详情失败',
        icon: 'none'
      });
    });
  },

  // 处理地点点击事件
  handleClickLocation() {
    console.log('点击了地点：', this.data.activityDetail.location);
    // TODO: 实现地点点击后的功能
    // wx.openLocation({
    //   name: this.data.activityDetail.location
    // })

    let location = this.data.activityDetail.location

    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name
    })

  }
}) 
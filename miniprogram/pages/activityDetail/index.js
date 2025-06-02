const app = getApp()
const utils = require('../../utils/utils.js')

Page({
  data: {
    activityId: '',
    activityDetail: null,
    statusBarHeight: 0
  },

  onLoad: function(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    if (options.id) {
      this.setData({
        activityId: options.id
      });
      // 获取活动详情
      this.getActivityDetail();
    }
  },

  // 格式化日期，添加星期几
  formatDate: function(dateStr) {
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date = new Date(dateStr);
    const weekDay = weekDays[date.getDay()];
    return `${dateStr} (${weekDay})\u00A0\u00A0`;
  },

  // 获取活动详情
  getActivityDetail() {
    const db = wx.cloud.database()
    const _ = db.command
    const activityId = this.data.activityId

    db.collection('activity')
      .doc(activityId)
      .get()
      .then(res => {
        const activity = res.data
        // 格式化日期
        if (activity.date) {
          activity.formattedDate = this.formatDate(activity.date)
        }
        // 使用selectTags作为标签数据
        activity.tags = activity.selectTags || []
        // 检查是否是活动创建者
        const isOwner = activity.creatorId === app.globalData.openid
        this.setData({
          activityDetail: activity,
          loading: false,
          isOwner: isOwner
        })
      })
      .catch(err => {
        console.error('获取活动详情失败：', err)
        wx.showToast({
          title: '获取活动详情失败',
          icon: 'none'
        })
        this.setData({
          loading: false
        })
      })
  },

  handleParticipate() {
    if (this.isOwner()) {
      console.log('活动创建者操作')
    } else {
      console.log('参与者操作')
      let userInfo = {
        openid: app.globalData.openid,
        ...app.globalData.userInfo
      }
      console.log('handleParticipate', userInfo)
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'joinActivity',
          activityId: this.data.activityId,
          userInfo: userInfo
        },
        config: {
          env: 'cloud1-4gwxmwly93725352'
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      });
    }
  },

  isOwner() {
    return this.data.activityDetail && this.data.activityDetail.creatorId === app.globalData.openid;
  },

  // 处理地点点击事件
  handleClickLocation() {
    console.log('点击了地点：', this.data.activityDetail.location);
    let location = this.data.activityDetail.location;
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name
    });
  },

  // 处理返回按钮点击
  handleBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          // 如果返回失败，则跳转到活动列表页
          wx.switchTab({
            url: '/pages/feed/index'
          });
        }
      });
    } else {
      // 如果没有上一页，则跳转到活动列表页
      wx.switchTab({
        url: '/pages/feed/index'
      });
    }
  }
}) 
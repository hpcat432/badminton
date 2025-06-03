const app = getApp()
const utils = require('../../utils/utils.js')

Page({
  data: {
    activityId: '',
    activityDetail: null,
    statusBarHeight: 0,
    showConfirmPopup: false,
    participateRemark: '',
    isJoined: false  // 添加是否已报名状态
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
        // 检查是否已报名
        const isJoined = activity.participants.some(
          participant => participant.openid === app.globalData.openid
        )
        this.setData({
          activityDetail: activity,
          loading: false,
          isOwner: isOwner,
          isJoined: isJoined
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
    if (this.data.isJoined) {
      // 如果已报名，则退出活动
      this.exitActivity();
    } else {
      // 如果未报名，则弹出报名确认框
      this.setData({ showConfirmPopup: true });
    }
  },

  hideConfirmPopup() {
    this.setData({ showConfirmPopup: false });
  },

  onRemarkInput(e) {
    this.setData({ participateRemark: e.detail.value });
  },

  confirmParticipate() {
    this.setData({ showConfirmPopup: false });
    let userInfo = {
      openid: app.globalData.openid,
      ...app.globalData.userInfo,
      remark: this.data.participateRemark
    };
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
      console.log(res.result)
      if (res.result.code == -50001) {
        wx.showToast({
          icon: 'none',
          title: res.result.message,
        })
      } else if (res.result.code === 0) {
        wx.showToast({
          title: '报名成功',
        })
        // 报名成功后刷新活动详情
        this.getActivityDetail();
      } else {
        wx.showToast({
          icon: 'none',
          title: res.result.message || '报名失败',
        })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        icon: 'none',
        title: '报名失败，请稍后重试',
      })
    });
  },

  exitActivity() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出该活动吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'exitActivity',
              activityId: this.data.activityId
            },
            config: {
              env: 'cloud1-4gwxmwly93725352'
            }
          }).then(res => {
            console.log(res.result)
            if (res.result.code === 0) {
              wx.showToast({
                title: '退出成功',
              })
              // 刷新活动详情
              this.getActivityDetail();
            } else {
              wx.showToast({
                icon: 'none',
                title: res.result.message || '退出失败',
              })
            }
          }).catch(err => {
            console.log(err)
            wx.showToast({
              icon: 'none',
              title: '退出失败，请稍后重试',
            })
          });
        }
      }
    });
  },

  isOwner() {
    console.log('isOwner : ', app.globalData.openid)
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
  },

  handleEdit() {
    // 跳转到编辑页面
    wx.redirectTo({
      url: `/pages/publish/index?id=${this.data.activityId}`
    });
  }
}) 
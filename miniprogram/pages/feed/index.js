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

  // 格式化日期，添加星期几
  formatDate: function(dateStr) {
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date = new Date(dateStr);
    const weekDay = weekDays[date.getDay()];
    return `${dateStr} (${weekDay})\u00A0\u00A0`;
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
      // 处理每个活动的日期格式
      activityList.forEach(item => {
        if (item.date) {
          item.formattedDate = this.formatDate(item.date);
        }
      });
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
  },

  // 跳转到活动详情页
  goToActivityDetail(e) {
    try {
      console.log('点击活动详情，事件对象：', e);
      const activityId = e.currentTarget.dataset.id;
      console.log('活动ID：', activityId);
      
      if (!activityId) {
        console.error('活动ID不存在');
        wx.showToast({
          title: '活动信息不完整',
          icon: 'none'
        });
        return;
      }

      wx.navigateTo({
        url: `/pages/activityDetail/index?id=${activityId}`,
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
    } catch (error) {
      console.error('处理点击事件出错：', error);
      wx.showToast({
        title: '系统错误',
        icon: 'none'
      });
    }
  },
}) 
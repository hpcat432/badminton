// pages/publish/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: undefined,
    activityName: '',
    location: '',
    userInfo: null,
    startTime: '',
    endTime: '',
    date: '',
    placeNum: -1,
    memberNum: -1,
    showTrainingPopup: false,
    selectedTags: [],
    newTag: '',
    tagList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkOpenId()
    this.checkUserInfo()
    this.checkEditInfo(options.id)
    console.log('onLoad tagList:', this.data.tagList)
    this.setData({
      tagList: ['高远球', '杀球', '网前球','吊球', '发球', '步伐']
    }, () => {
      console.log('after setData tagList:', this.data.tagList)
    })
  },

  /**
   * 检查并渲染编辑信息
   */
  checkEditInfo: function(activityId) {
    if (!activityId) return;
    const db = wx.cloud.database();
    this.setData({
      activityId: activityId
    })
    db.collection('activity').doc(activityId).get()
      .then(res => {
        const activity = res.data;
        // 渲染活动信息到页面
        this.setData({
          activityName: activity.title || '',
          location: activity.location || '',
          date: activity.date || '',
          startTime: activity.startTime || '',
          endTime: activity.endTime || '',
          placeNum: activity.placeNum || '',
          memberNum: activity.memberNum || '',
          selectedTags: activity.selectedTags || [],
        });
      })
      .catch(err => {
        console.error('获取活动信息失败', err);
        wx.showToast({
          title: '获取活动信息失败',
          icon: 'none'
        });
      });
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

  onInputPlaceNum: function (e) {
    this.setData({
      placeNum: e.detail.value
    });
  },

  onInputMemberNum: function (e) {
    this.setData({
      memberNum: e.detail.value
    });
  },

  onStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  onEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    });
  },

  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
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
    wx.chooseLocation({})
      .then(res => {
        console.log(res)
        let address = res.name;
        if (address.length > 10) {
          address = address.substring(0, 10) + '...';
        }
        this.setData({
          location: {
            name: address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
        console.log('res: ', res);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  },

  handlePublish: function () {
    wx.showLoading({
      title: '发布中...',
    })
    let type = this.data.activityId ? 'editActivity' : 'createActivity'
    let data = {
      type: type,
      title: this.data.activityName,
      location: this.data.location,
      userInfo: app.userInfo,
      date: this.data.date,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      placeNum: this.data.placeNum,
      memberNum: this.data.memberNum,
      selectedTags: this.data.selectedTags,
    }
    if (this.data.activityId) {
      data.activityId = this.data.activityId
    }
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: data,
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
  },

  showTrainingPopup: function() {
    console.log('showTrainingPopup')
    console.log('tagList:', this.data.tagList)
    this.setData({
      showTrainingPopup: true
    });
  },

  hideTrainingPopup: function() {
    console.log('hideTrainingPopup, selectedTags:', this.data.selectedTags)
    this.setData({
      showTrainingPopup: false
    });
  },

  onTagInput: function(e) {
    this.setData({
      newTag: e.detail.value
    });
  },

  addTag: function() {
    if (this.data.newTag && !this.data.selectedTags.includes(this.data.newTag)) {
      this.setData({
        selectedTags: [...this.data.selectedTags, this.data.newTag],
        newTag: ''
      });
    }
  },

  removeTag: function(e) {
    const index = e.currentTarget.dataset.index;
    const tags = [...this.data.selectedTags];
    tags.splice(index, 1);
    this.setData({
      selectedTags: tags
    });
  },

  selectTag: function(e) {
    const tag = e.currentTarget.dataset.tag;
    if (!this.data.selectedTags.includes(tag)) {
      this.setData({
        selectedTags: [...this.data.selectedTags, tag]
      });
    }
  }

})
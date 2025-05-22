// pages/publish/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    console.log('onLoad tagList:', this.data.tagList)
    this.setData({
      tagList: ['高远球', '杀球', '网前球','吊球', '发球', '步伐']
    }, () => {
      console.log('after setData tagList:', this.data.tagList)
    })
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

  onTimeChange: function(e) {
    this.setData({
      time: e.detail.value
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
          location: address
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
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'createActivity',
        title: this.data.activityName,
        location: this.data.location,
        userInfo: app.userInfo,
        date: this.data.date,
        startTime: this.data.startTime,
        endTime: this.data.endTimes,
        placeNum: this.data.placeNum,
        memberNum: this.data.memberNum,
        selectedTags: this.data.selectedTags,
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
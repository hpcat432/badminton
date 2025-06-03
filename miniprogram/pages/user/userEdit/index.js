// pages/publish/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../../images/icons/avatar.png',
    userName: '',
    avatarChanged: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const avatar = decodeURIComponent(options.avatar);
    const userName = (options.avatar !== 'null') ? decodeURIComponent(options.userName) : '';
    console.log('profile avatar : ', avatar)
    console.log('profile userName : ', userName)
    this.setData({
      avatarUrl: avatar,
      userName: userName
    })
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

  onChooseAvatar(e) {
    console.log(e.detail.avatarUrl)
    this.setData({
      avatarChanged: true,
      avatarUrl: e.detail.avatarUrl
    })
    // this.data.avatarUrl = e.detail.avatarUrl
  },

  onInput(e) {
    console.log(e.detail.value)
    this.data.userName = e.detail.value
  },

  uploadUserInfoToDb: function(avatar) {
    let userInfo = {
      userName: this.data.userName,
      avatar: avatar,
      createTime: Date.now(),

    }
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'createUser',
        userInfo: userInfo
      },
      config: {
        env: 'cloud1-4gwxmwly93725352'
      }
    }).then(res => {
      console.log(res)
      const pages = getCurrentPages()
      const indexPage = pages.find(page => page.route === 'pages/user-center/index')
      if (indexPage) {
        indexPage.onLoad()
      }
      setTimeout(() => {
        wx.navigateBack()
      }, 500)
    })
  },

  isValidAvatar: function() {
    return this.data.avatarUrl.includes('tmp') || this.data.avatarUrl.includes('cloud')
  },

  uploadUserInfo: function () {
    if (this.data.userName.length <= 0 || !this.isValidAvatar()) {
      wx.showToast({
        title: "请设定头像和用户名",
        icon: 'none',
        duration: 2000
      });
      return
    }
    if (!this.data.avatarUrl.includes('cloud')) {
      wx.cloud.uploadFile({
        cloudPath: this.data.userName + '_avatar.png',
        filePath: this.data.avatarUrl
      }).then(res => {
        this.uploadUserInfoToDb(res.fileID)
      })
    } else {
      this.uploadUserInfoToDb(this.data.avatarUrl)
    }
  },

  onConfirmChange() {
    this.uploadUserInfo()
  }

})
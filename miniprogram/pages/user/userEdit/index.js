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
    gender: '',
    showGenderPicker: false,
    zyLevel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const avatar = decodeURIComponent(options.avatar);
    const userName = (options.userName) ? decodeURIComponent(options.userName) : undefined;
    const gender = options.gender
    const zyLevel = options.zyLevel
    const genderCN = this.getGenderCN(gender)
    console.log('user edit avatar: ', avatar)
    this.setData({
      avatarUrl: avatar,
      userName: userName,
      gender: genderCN, // 可根据需要初始化
      zyLevel: zyLevel
    })
  },

  getGenderCN(gender) {
    if (gender === 'male') {
      return '男'
    } else if (gender === 'female') {
      return '女'
    } else {
      return undefined
    }
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

  onInputLevel(e) {
    this.setData({ zyLevel: e.detail.value });
  },

  getGenderEn: function(gender) {
    if (gender === '男') {
      return 'male'
    } else if (gender === '女') {
      return 'female'
    } else {
      return undefined
    }
  },

  uploadUserInfoToDb: function(avatar) {
    let userInfo = {
      userName: this.data.userName,
      avatar: avatar,
      gender: this.getGenderEn(this.data.gender),
      zyLevel: this.data.zyLevel,
      createTime: Date.now(),
    }
    console.log('uploadUserInfoToDb : ', userInfo)
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
  },

  // 性别选择相关
  onShowGenderPicker() {
    this.setData({ showGenderPicker: true });
  },
  onHideGenderPicker() {
    this.setData({ showGenderPicker: false });
  },
  onGenderPickerTap(e) {
    // 阻止冒泡，防止点击弹窗内容关闭弹窗
  },
  onSelectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      gender,
      showGenderPicker: false
    });
  },

})
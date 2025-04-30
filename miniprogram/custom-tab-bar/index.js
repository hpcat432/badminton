Component({
  data: {
    selected: 0,
    color: "#A2A9B0",
    selectedColor: "#07C160",
    list: [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "../images/icons/examples.png",
        "selectedIconPath": "../images/icons/examples-active.png"
      },
      {
        "pagePath": "pages/feed/index",
        "text": "活动",
        "iconPath": "../images/icons/examples.png",
        "selectedIconPath": "../images/icons/examples-active.png"
      },
      {
        "pagePath": "pages/user-center/index",
        "text": "我",
        "iconPath": "../images/icons/usercenter.png",
        "selectedIconPath": "../images/icons/usercenter-active.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = '/' + data.path
      wx.switchTab({url})
      console.log('switchTab index : ', data.index)
    },
    onPublishTap() {
      wx.navigateTo({
        url: '/pages/publish/index'
      })
    }
  }
})
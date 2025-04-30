const { envList } = require('../../envList');

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showTip: false,
    title:"",
    content:""
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected:2
      })
    }
  },

  getOpenId() {
    wx.login({
      success: (res) => {
        console.log('getOpenId : ', res)
      },
    })
    // wx.getUserProfile({
    //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     console.log('getUserProfile name: ', res.userInfo.nickName)
    //   },
    //   fail: (err) => {
    //     console.log('getUserProfile err: ', err.errMsg)
    //   }
    // })
    // wx.showLoading({
    //   title: '',
    // });
    // wx.cloud
    //   .callFunction({
    //     name: 'quickstartFunctions',
    //     data: {
    //       type: 'getOpenId',
    //     },
    //     config: {
    //       env: 'cloud1-4gwxmwly93725352'
    //     }
    //   })
    //   .then((resp) => {
    //     console.log('getOpenId', resp.result)
    //     this.setData({
    //       haveGetOpenId: true,
    //       openId: resp.result.openid,
    //     });
    //     wx.hideLoading();
    //   })
    //   .catch((e) => {
    //     wx.hideLoading();
    //     console.error('getOpenId', e.errMsg)
    //     const { errCode, errMsg } = e
    //     if (errMsg.includes('Environment not found')) {
    //       this.setData({
    //         showTip: true,
    //         title: "云开发环境未找到",
    //         content: "如果已经开通云开发，请检查环境ID与 `miniprogram/app.js` 中的 `env` 参数是否一致。"
    //       });
    //       return
    //     }
    //     if (errMsg.includes('FunctionName parameter could not be found')) {
    //       this.setData({
    //         showTip: true,
    //         title: "请上传云函数",
    //         content: "在'cloudfunctions/quickstartFunctions'目录右键，选择【上传并部署-云端安装依赖】，等待云函数上传完成后重试。"
    //       });
    //       return
    //     }
    //   });
  },

  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },
});

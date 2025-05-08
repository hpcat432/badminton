// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "cloud1-4gwxmwly93725352",
        traceUser: true,
      });
    }

    this.globalData = {
      openId: '',
      userInfo: null
    };
  },

  getUserInfo: function() {
    // 检查是否已登录
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              this.syncUserInfo(res.userInfo);
            }
          });
        } else {
          // 未授权，引导用户授权
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              wx.getUserInfo({
                success: res => {
                  this.globalData.userInfo = res.userInfo;
                  this.syncUserInfo(res.userInfo);
                }
              });
            }
          });
        }
      }
    });
  },

  syncUserInfo: function(userInfo) {
    // 调用云函数同步用户信息
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'syncUserInfo',
        userInfo: userInfo
      },
      config: {
        env: 'cloud1-4gwxmwly93725352'
      }
    }).then(res => {
      console.log('用户信息同步成功', res);
    }).catch(err => {
      console.error('用户信息同步失败', err);
    });
  }
});

const app = getApp()

function getOpenId() {
  console.log('getOpenId')
  if (!app.globalData.openid || app.globalData.openid.length <= 0) {
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
      app.globalData.openid = res.result.openid
    })
  } else {
    console.log('cached openId: ' + app.globalData.openid)
  }
}

module.exports = {
  getOpenId: getOpenId
}
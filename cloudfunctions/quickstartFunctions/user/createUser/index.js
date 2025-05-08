const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const wxContext = cloud.getWXContext()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db.collection('user').get()
    console.log('server user', res)
    if (res.data && res.data.length > 0) {
      let item = res.data[0]
      const result = await db.collection('user').doc(item._id).update({
        data: {
          openId: wxContext.OPENID,
          userInfo: event.userInfo
        }
      })
      return {
        success: true,
        data: result
      }
    } else {
      const result = await db.collection('user').add({
        data: {
          openId: wxContext.OPENID,
          userInfo: event.userInfo
        }
      })
      return {
        success: true,
        data: result
      }
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 

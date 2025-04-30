const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const now = new Date()

  try {
    const result = await db.collection('activity').add({
      data: {
        title: event.title || '新活动',
        description: event.description || '活动描述',
        startTime: event.startTime || now,
        endTime: event.endTime || new Date(now.getTime() + 24 * 60 * 60 * 1000),
        createTime: now,
        updateTime: now,
        status: 'active',
        creator: wxContext.OPENID,
        participants: []
      }
    })
    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('创建活动失败', err)
    return {
      success: false,
      error: err
    }
  }
} 

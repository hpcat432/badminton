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
        startTime: event.startTime,
        endTime: event.endTime,
        createTime: event.createTime,
        status: 'active',
        creatorId: wxContext.OPENID,
        owner: event.userInfo,
        participants: [event.userInfo],
        location: event.location,
        placeNum: event.placeNum,
        memberNum: event.memberNum,
        selectedTags: event.selectedTags,
        date: event.date,
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

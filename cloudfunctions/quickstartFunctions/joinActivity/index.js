const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { activityId, userInfo } = event

  try {

    // return { success: true, msg: 'test' }


    // 获取当前活动
    console.log('activityId : ', activityId)
    const res = await db.collection('activity').doc(activityId).get()
    const currentParticipants = res.data.participants || []
    console.log('res : ', res.data.title)
    // 判断是否已经报名过
    const alreadyJoined = currentParticipants.some(p => p.openid === userInfo.openid)
    if (alreadyJoined) {
      return { success: false, msg: '已经报名过了' }
    }

    // 添加报名者
    currentParticipants.push(userInfo)

    // 更新记录
    await db.collection('activity').doc(activityId).update({
      data: {
        participants: currentParticipants
      }
    })

    return { success: true }
  } catch (e) {
    return { success: false, error: e }
  }
}

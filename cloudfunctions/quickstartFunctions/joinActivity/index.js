const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const {
    activityId,
    userInfo
  } = event

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
      return {
        code: -500001,
        success: false,
        message: '您已经参加过该活动'
      }
    }

    // 检查活动是否已满
    if (res.data.participants.length >= res.data.memberNum) {
      return {
        code: -500001,
        success: false,
        message: '活动已满'
      }
    }

    // 添加报名者
    currentParticipants.push(userInfo)

    // 更新记录
    await db.collection('activity').doc(activityId).update({
      data: {
        participants: currentParticipants
      }
    })

    return {
      code : 0,
      success: true
    }
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}
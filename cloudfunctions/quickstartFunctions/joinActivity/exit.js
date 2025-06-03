const cloud = require('wx-server-sdk')
const { FAIL, SUCCESS } = require('../consts/errorCodes')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { activityId } = event
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  try {
    // 获取活动信息
    const activity = await db.collection('activity').doc(activityId).get()
    const activityData = activity.data

    // 检查用户是否在参与者列表中
    const isJoined = activityData.participants.some(
      participant => participant.openid === wxContext.OPENID
    )

    if (!isJoined) {
      return {
        code: FAIL,
        message: '您尚未参加该活动'
      }
    }

    // 从参与者列表中移除当前用户
    await db.collection('activity').doc(activityId).update({
      data: {
        participants: _.pull({
          openid: wxContext.OPENID
        })
      }
    })

    return {
      code: SUCCESS,
      message: '退出成功'
    }
  } catch (error) {
    console.error('退出活动失败：', error)
    return {
      code: FAIL,
      message: '退出失败，请稍后重试'
    }
  }
} 
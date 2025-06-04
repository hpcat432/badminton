const cloud = require('wx-server-sdk')
const { FAIL } = require('../consts/errorCodes')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { activityId } = event

  try {
    // 检查是否是活动创建者
    const activity = await db.collection('activity').doc(activityId).get()
    if (activity.data.creatorId !== wxContext.OPENID) {
      return {
        code: FAIL,
        message: '您不是活动创建者，无法编辑'
      }
    }

    // 更新活动数据
    await db.collection('activity').doc(activityId).update({
      data: {
        title: event.title || '新活动',
        startTime: event.startTime,
        endTime: event.endTime,
        createTime: event.createTime,
        status: 'active',
        creatorId: wxContext.OPENID,
        owner: event.userInfo,
        location: event.location,
        placeNum: event.placeNum,
        memberNum: event.memberNum,
        selectedTags: event.selectedTags,
        date: event.date,
      }
    })

    return {
      code: 0,
      message: '编辑成功'
    }
  } catch (error) {
    console.error('编辑活动失败：', error)
    return {
      code: FAIL,
      message: '编辑失败，请稍后重试'
    }
  }
}

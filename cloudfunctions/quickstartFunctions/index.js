const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const createCollection = require('./createCollection/index');
const selectRecord = require('./selectRecord/index');
const updateRecord = require('./updateRecord/index');
const sumRecord = require('./sumRecord/index');
const fetchGoodsList = require('./fetchGoodsList/index');
const genMpQrcode = require('./genMpQrcode/index');
const fetchActivityList = require('./fetchActivityList/index');
const createActivity = require('./createActivity/index');
const editActivity = require('./createActivity/edit');
const createUser = require('./user/createUser/index');
const getUser = require('./user/getUser/index');
const joinActivity = require('./joinActivity/index');
const exitActivity = require('./joinActivity/exit');
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  switch (event.type) {
    case 'getOpenId':
      return {
        event,
        openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
      };
    case 'getUserInfo':
      try {
        // 先获取用户信息
        const userInfo = await db.collection('user').where({
          _openid: wxContext.OPENID
        }).get();

        if (userInfo.data.length > 0) {
          return {
            success: true,
            userInfo: userInfo.data[0]
          };
        } else {
          // 如果没有找到用户信息，返回基本openid信息
          return {
            success: true,
            userInfo: {
              _openid: wxContext.OPENID,
              nickname: '未设置昵称',
              avatarUrl: ''
            }
          };
        }
      } catch (err) {
        console.error('获取用户信息失败', err);
        return {
          success: false,
          error: err
        };
      }
      case 'getMiniProgramCode':
        return await getMiniProgramCode.main(event, context);
      case 'createCollection':
        return await createCollection.main(event, context);
      case 'selectRecord':
        return await selectRecord.main(event, context);
      case 'updateRecord':
        return await updateRecord.main(event, context);
      case 'sumRecord':
        return await sumRecord.main(event, context);
      case 'fetchGoodsList':
        return await fetchGoodsList.main(event, context);
      case 'genMpQrcode':
        return await genMpQrcode.main(event, context);
      case 'fetchActivityList':
        return await fetchActivityList.main(event, context);
      case 'createUser':
        return await createUser.main(event, context);
      case 'getUser':
        return await getUser.main(event, context);
      case 'createActivity':
        return await createActivity.main(event, context);
      case 'editActivity':
        return await editActivity.main(event, context);
      case 'joinActivity':
        return await joinActivity.main(event, context);
      case 'exitActivity':
        return await exitActivity.main(event, context);
      default:
        return {
          success: false,
            error: '未知的操作类型'
        };
  }
};
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  if (event.creatorId) {
    const result = await db.collection('activity')
      .where({ creatorId: event.creatorId })
      .skip(0)
      .limit(10)
      .get();
    return {
      dataList: result?.data,
    };
  } else {
    const result = await db.collection('activity')
      .skip(0)
      .limit(10)
      .get();
    return {
      dataList: result?.data,
    };
  }
};


// const cloud = require('wx-server-sdk');
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// const db = cloud.database();

// exports.main = async (event, context) => {
//   const result = await db.collection('goods')
//     .skip(0)
//     .limit(10)
//     .get();
//   return {
//     dataList: result?.data,
//   };
// };
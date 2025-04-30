const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const result = await db.collection('activity')
    .skip(0)
    .limit(10)
    .get();
  console.log('fetchActivityList success')
  return {
    dataList: result?.data,
  };
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
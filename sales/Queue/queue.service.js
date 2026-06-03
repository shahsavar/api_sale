const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
module.exports = {

  getQueueList,
  getOrderPriorityUIData,
  queueChangeNobat,
  getResponNotQueuePickList,
  queueControlAdd,
  getModelsInRespon,


}

async function getQueueList(req) {

  try {

    const { IdModel } = req.body.firstParams;
    let userFilter = `flag>0 and idFactor=0 and IdModel=${IdModel}`
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VQueue", "*", userFilter);
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }

}

async function getOrderPriorityUIData(req) {
  try {


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.usGetOrderPriorityUIData')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      orderPriorityUserId: result.recordsets[0],

    };
  } catch (err) {
    console.log('err.err', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function queueChangeNobat(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { idQueue, type, periority, Comment, LetterNo, LetterDate, idOrderPeriority } = req.body;
   
  
    console.log("req.body ==>", req.body)

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idQueue", sql.Int, idQueue)
      .input("Type", sql.VarChar(20), type )
      .input("UserId", sql.VarChar(10), UserLogin)
      .input("periority", sql.Int, periority)
      .input("Comment", sql.NVarChar(150), Comment)
      .input("LetterNo", sql.VarChar(25), LetterNo)
      .input("LetterDate", sql.VarChar(10), LetterDate)
      .input("idOrderPeriority", sql.Int, idOrderPeriority)
      .output("msgRet", sql.NVarChar(200))
      .execute("Sale.sale.uspQueueChangeNobat");


      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "ذخیره اطلاعات  با موفقیت انجام شد",
  
        }
      else return {
        statusResult: 1,
        message: result.output.msgRet,
      }
    } catch (err) {
      console.log("err.message", err.message)
      return {
        statusResult: 2,
        message: "خطا در برقراری ارتباط با پایگاه داده ای",
      };
    }
}

async function getResponNotQueuePickList(req) {

  let userFilter='Flag>1 and Mande<>0'
  const { flag } = req.body.firstParams;
  if(flag==2) 
  userFilter+=' and id in(select idrespon from TResponNotQueue)'


  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VRespon', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {

    return err
  }
}
async function queueControlAdd(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { idRespon, TakhfifFactor , SoudTadil , MaxKhodro} = req.body;

   

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idRespon', sql.Int, idRespon)
      .input('TakhfifFactor', sql.Numeric(18,0), TakhfifFactor)
      .input('SoudTadil', sql.Numeric(18,0), SoudTadil)
      .input('Manual', sql.TinyInt, 1 )
      .input('MaxKhodro', sql.Int, MaxKhodro )
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspQueueControlAdd')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات  با موفقیت انجام شد",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log("err.message", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }

}
async function getModelsInRespon(req, res) {
  try {

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwModelsInRespon', '*')
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(query)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }
}
const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
module.exports = {

    getDueDeliver,
    dueDeliverInsert,
    dueDeliverUpdate,
    dueDeliverDelete,
    changeMojavezModel,

}

////////////////////  عناوین دوره تحویل

async function getDueDeliver(req) {

  try {
    let userFilter = ''
    
    
    const pool = await pools.getPool('Sale');
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VDueDeliver", "*", userFilter);
    let result = await pool.request().query(query)

    // console.log("getAmarKhodro.query==>" , query)
    
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

async function dueDeliverInsert(req) {
  try {

    
    const {ID ,Title,HeadMonth,HeadDay,TailMonth,TailDay,GroupDueDeliver} = req.body;
    let spName = "sale.uspDueDeliverInsert";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("Title", sql.NVarChar(45), Title)
      .input("HeadMonth", sql.VarChar(2), HeadMonth)
      .input("HeadDay", sql.VarChar(2), HeadDay)
      .input("TailMonth", sql.VarChar(2), TailMonth)
      .input("TailDay", sql.VarChar(2), TailDay)
      .input("GroupDueDeliver", sql.Int, GroupDueDeliver)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

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

async function dueDeliverUpdate(req) {
  try {

     const {ID ,Title,HeadMonth,HeadDay,TailMonth,TailDay,GroupDueDeliver} = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale');

    let result = await pool.request()
     .input("ID", sql.Int, ID)
      .input("Title", sql.NVarChar(45), Title)
      .input("HeadMonth", sql.VarChar(2), HeadMonth)
      .input("HeadDay", sql.VarChar(2), HeadDay)
      .input("TailMonth", sql.VarChar(2), TailMonth)
      .input("TailDay", sql.VarChar(2), TailDay)
      .input("GroupDueDeliver", sql.Int, GroupDueDeliver)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspDueDeliverUpdate')
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "ذخیره اطلاعات با موفقیت انجام شد",
  
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
async function dueDeliverDelete(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
  
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
    .input("ID", sql.Int, req.body.ID)
    .input("UserID", sql.VarChar(10), UserLogin)
    .input("clientIp", sql.VarChar(50), clientIp)
    .output("msgRet", sql.NVarChar(200))
    .execute('Sale.sale.uspDueDeliverDelete')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: 'اطلاعات شریک اصلاح گردید',
    };
  } catch (err) {
  
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

////////////////////////// انواع مدل ها

async function changeMojavezModel(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { ID} = req.body;


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, ID)
      .input('UserCode', sql.VarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspChangeMojavezModel')

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
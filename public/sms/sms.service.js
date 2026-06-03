const sql = require("mssql");
const pools = require("../../_helpers/pool-manegment");
const { SqlCommandCreator } = require("../../_helpers/SqlCommandCreator");
const { getPersianDate } = require("../../_helpers/persian.calender");
const { sendMessage, sendMessagesAll } = require('../../_helpers/sendMessage');
const axios = require("axios");
const axiosConfig = {
  async: true,
  crossDomain: false,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
  processData: true,
};
module.exports = {
  getMessageContent,
  getMessageContentAll,
  getInitPaymentSum,
  getSMSRespon,
  getCustomers,
  getCustomerCount,
  getCustomerUIData,
  getAgency,
  getFactorSanad,
  getSanadMalekiat,
  getSanadMalekiatTahvili,
  getPaymentSms,
  getPrsnClassForSms,
  getGroupsAmoozesh,
  getBazrasiDesc,
  getTebKarForSMS,
  getPersonel,
  getMobileConfirm,
  getMoavenatBarnameRiziList,
  getMessageOut,
  getAgencyCapacityMaster,
  getAgencyCapacity,
  getClientIdTypeUserAccess,
  getAgencyIntroBank,
  getSuggestion,
  getSuggestionB,
  getSuggestionDetail,
  suggestionAction,
  getCartableInfo,
  delMoavenatBarnameRizi,
  saveMoavenatBarnameRizi,
  updateMoavenatBarnameRizi,
  AgencyCapacityInit,
  AgencyCapacityEdit,
  getAgencyResponsReport,
  getInternetResponsDayWithTotalCount,
  getCartableInfoList,
  getCartableInfoListAll,
  addCartableInfo,
  deleteCartableInfo,
  getIntPaymentlogReport,
  getIntPaymentlogReportGroup,
  getAgencyRemind,
  getAgencyRemindCartable,
  getResponCartable,
  getFactorCartable,
  getAgencyTransfer,
  getRegisterInfo,
  getRegisterList,
  registerEdit,
  getProjects,
  getSaleProjectColor,
  getSaleProjectUsage,
  getColorWithModel,
  getUsageWithModel,
  addBaseColorWithModel,
  addBaseUsageWithModel,
  deleteBaseColorWithModel,
  deleteBaseUsageWithModel,
  getMsgCount,
  sendSingeMessage,
  sendMessages,
  sendMessagesAllFormDB,
  getJarimeCalculateList,
  saveMessageContent,
  deleteMessageContent,
  getCustomerCodeForSMS,
  getCustomerMobilForSMS,
  getSuggestionDefect,
  getSuggestionDefectUIData,
  SuggestionDefectSave,
  SuggestionDefectUpdate,
  updateSuggestionDefectValue,
  SuggestionDefectDelete,
  getSendMessages,
  sendMessageAPI,
  getVamcoTolidData,
  getCharkheshgarTolidData,
  getMessageType,
  getMessageContentParam,
  getMessageContentParamDetail,
  messageContentParamInsert,
  MessageContentParamUpdate,
  messageContentParamDelete,
  messageContentParamDetailInsert,
  messageContentParamDetailUpdate,
  messageContentParamDetailDelete,
  updateDueDeliverProg,
  deleteDueDeliverProg,
  getNotTransfer,
  initCartable,
  getCreditValue,
  getPrefactorsForSms,
  getAgencyCapacityControl,
  createSuggestion,
  getSuggestionUIData,
 
};
//----------------------
async function addCartableInfo(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .input("pid", sql.Int, req.body.pid)
      .execute("MIS.dbo.uspAddCartableInfo");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  ایجاد کارتابل" };
  }
}
async function deleteCartableInfo(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .input("pid", sql.Int, req.body.pid)
      .execute("MIS.dbo.uspDeleteCartableInfo");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  ایجاد کارتابل" };
  }
}
async function getCartableInfoList(req, res, next) {
  try {
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VCartableInfo",
      "*"
    );
    const pool = await pools.getPool("MIS");
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCartableInfoListAll(req, res, next) {
  try {
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VCartableInfoAll",
      "*"
    );
    const pool = await pools.getPool("MIS");
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getColorWithModel(req, res, next) {
  try {
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "Sale.dbo.VRelatBaseColorWithModel",
      "*",
      req.body.firstFilter
    );
    const pool = await pools.getPool("MIS");
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getUsageWithModel(req, res, next) {
  try {
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "Sale.dbo.VRelatBaseUsageWithModel",
      "*",
      req.body.firstFilter
    );
    const pool = await pools.getPool("MIS");
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getInitPaymentSum(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .output("loginCount", sql.Int)
      .output("orderCount", sql.Int)
      .output("saleCount", sql.Int)
      .output("smsCount", sql.Int)
      .output("freeRemindCount", sql.Int)
      .execute("MIS.dbo.spLoginSaleHistoryCount");

    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VInitPaymentSum",
      "*"
    );
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
      loginCount: result.output.loginCount,
      orderCount: result.output.orderCount,
      saleCount: result.output.saleCount,
      smsCount: result.output.smsCount,
      freeRemindCount: result.output.freeRemindCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCartableInfo(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = await pool.request().execute("MIS.dbo.uspGetCartableInfo");

    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSMSRespon(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSMSRespon",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCustomers(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VCustomer",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCustomerCount(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VCustomerCount",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log("err.message", err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCustomerUIData(req) {
  try {
    // var IdCustomer=req.privateData
    // const {systemCode}=req.body;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      // .input('IdCustomer', sql.Int, IdCustomer)
      .execute("sale.spGetCustomerUIData");
    // var registerInfo=result.recordsets[0][0];

    return {
      statusResult: 0,
      message: "خواندن موفق",
      //   registerInfo:registerInfo,
      cities: result.recordsets[0],
      // agencies:result.recordsets[2],
      // mojaver:result.recordsets[3]
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgency(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VAgency",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgencyTransfer(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = "select * from MIS.dbo.VAgency";
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rightRows: resultq.recordsets[0],
      leftRows: [],
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getInternetResponsDayWithTotalCount(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.vwInternetResponsDayWithTotalCount",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getFactorSanad(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VFactorSanad",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSanadMalekiat(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSanadMalekiat",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSanadMalekiatTahvili(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSanadMalekiatTahvili",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getPaymentSms(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VPaymentSms",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getPrsnClassForSms(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VPrsnClassForSms",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getGroupsAmoozesh(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.vwSmsForGroupsAmoozesh",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getBazrasiDesc(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VBazrasiDesc",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getTebKarForSMS(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VTebKarForSMS",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getPersonel(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VPersonel",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getMobileConfirm(req) {
  try {
    let obj = req.privateData;
    let userLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.vwMobileConfirm",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
      userLogin: userLogin,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getMoavenatBarnameRiziList(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VMoavenatBarnameRizi",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getMessageOut(req) {
  try {

    let obj = req.privateData;
    let userLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("permissionName", sql.VarChar(50), "Sms.Report.01")
      .input("userName", sql.VarChar(50), userLogin)
      .output("firstFilter", sql.VarChar(500))
      .execute("UsersDB.dbo.uspAspNetReadUserFirstFilter");

    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VMessageOut",
      "*",
      result.output.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


async function getAgencyCapacityMaster(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VAgencyCapacityMaster",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgencyCapacity(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VAgencyCapacity",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getClientIdTypeUserAccess(req) {
  try {
    let obj = req.privateData;
    let userName = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("userName", sql.VarChar(20), userName)
      .execute("MIS.dbo.uspGetClientIdTypeUserAccess");

    return {
      statusResult: 0,
      rows: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgencyRemind(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VAgencyRemind",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgencyIntroBank(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VIntroBank",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getNotTransfer(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(req.body.lazyParams, "[MIS].[dbo].[VInitPaymentIntCustomer]", "*", `isnull(idPaymentSale,0)=0`);
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSuggestion(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSuggestion",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSuggestionB(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSuggestionB",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCustomerMobilForSMS(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.TCustomerMobilForSMS",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getCustomerCodeForSMS(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VCustomerCodeForSMS",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSuggestionDefect(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSuggestionDefect",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSuggestionDefectUIData(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .execute("MIS.dbo.uspGetSuggestionDefectUIData");

    return {
      statusResult: 0,
      SussgestionDefectObjects: result.recordset,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function SuggestionDefectSave(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("Code", sql.NVarChar(250), req.body.Code)
      .input("Title", sql.NVarChar(250), req.body.Title)
      .input("ObjectId", sql.Int, req.body.objectId.value)
      .execute("MIS.dbo.uspSuggestionDefectSave");

    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,

      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function SuggestionDefectUpdate(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("id", sql.NVarChar(250), req.body.ID)
      .input("Code", sql.NVarChar(250), req.body.Code)
      .input("Title", sql.NVarChar(250), req.body.Title)
      .input("ObjectId", sql.Int, req.body.objectId.value)
      .execute("MIS.dbo.uspSuggestionDefectUpdate");

    return {
      statusResult: 0,
      message: "بروزآوری با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,

      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function updateSuggestionDefectValue(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("id", sql.Int, req.body[0])
      .input("Code", sql.VarChar(10), req.body[1])
      .execute("MIS.dbo.uspUpdateSuggestionDefectValue");

    return {
      statusResult: 0,
      message: "بروزآوری با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function SuggestionDefectDelete(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("id", sql.Int, req.body.Id)
      .execute("MIS.dbo.uspSuggestionDefectDelete");

    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    console.log("err.message", err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSuggestionDetail(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSuggestionDetail",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function delMoavenatBarnameRizi(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const { Id } = req.body;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("Id", sql.Int, req.body.Id)
      .execute("MIS.dbo.uspDelMoavenatBarnameRizi");

    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function saveMoavenatBarnameRizi(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("Name", sql.NVarChar(50), req.body.Name)
      .input("MobileNumber", sql.NChar(11), req.body.MobileNumber)
      .input("CreateUserName", sql.NVarChar(20), UserLogin)
      .input("G1", sql.Bit, req.body.G1)
      .input("G2", sql.Bit, req.body.G2)
      .input("G3", sql.Bit, req.body.G3)
      .input("G4", sql.Bit, req.body.G4)
      .input("G5", sql.Bit, req.body.G5)
      .execute("MIS.dbo.uspSaveMoavenatBarnameRizi");

    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function updateMoavenatBarnameRizi(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("Id", sql.NVarChar(50), req.body.Id)
      .input("Name", sql.NVarChar(50), req.body.Name)
      .input("MobileNumber", sql.NChar(11), req.body.MobileNumber)
      .input("CreateUserName", sql.NVarChar(20), UserLogin)
      .input("G1", sql.Bit, req.body.G1)
      .input("G2", sql.Bit, req.body.G2)
      .input("G3", sql.Bit, req.body.G3)
      .input("G4", sql.Bit, req.body.G4)
      .input("G5", sql.Bit, req.body.G5)
      .execute("MIS.dbo.uspUpdateMoavenatBarnameRizi");

    return {
      statusResult: 0,
      message: "بروزاوری با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function AgencyCapacityInit(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;

    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("Total", sql.Int, req.body.SumNumberOfRegistrationInternet)
      .input("CapacityType", sql.Int, req.body.CapacityType)
      .input("CapacityPercent", sql.Int, req.body.CapacityPercent)
      .input("Capacity", sql.Int, req.body.Capacity)
      .input("CapacityMax", sql.Int, req.body.CapacityMax)
      .input("Ameliyat", sql.Bit, req.body.Ameliyat)
      .input("Agency", sql.Bit, req.body.Agency)
      .input("OstanControl", sql.Bit, req.body.OstanControl)
      .input("SalControl", sql.Bit, req.body.SalControl)
      .input("CpacityViewControl", sql.Bit, req.body.CpacityViewControl)
      .input("UserId", sql.VarChar(128), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.spAgencyCapacityInit");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }

    return {
      statusResult: 0,
      message: "اصلاح با موفقیت انجام شد",
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function AgencyCapacityEdit(req) {
  try {
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("idAgencyCode", sql.Int, req.body.IdAgencyCode)
      .input("capacity", sql.Int, req.body.Capacity)
      .input("capacityMax", sql.Int, req.body.CapacityMax)
      .input("userId", sql.VarChar(128), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.spAgencyCapacityEdit");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: result.output.msgRet,
    };
  } catch (err) {
    console.log("err.message :>> ", err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgencyResponsReport(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VAgencyResponReport",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getIntPaymentlogReport(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VIntPaymentlogReport",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getIntPaymentlogReportGroup(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VIntPaymentlogReportGroup",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getAgencyRemindCartable(req) {
  try {
    let CompanyId = req.privateData.CompanyId;
    const firstFilter = "IdAgencyCode=" + CompanyId;
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VAgencyRemind",
      "*",
      firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getResponCartable(req, res, next) {
  try {
    let CompanyId = req.privateData.CompanyId;
    const firstFilter = "IDAgencyCommission=" + CompanyId;
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSMSRespon",
      "*",
      firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getFactorCartable(req, res, next) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var userFirstFilter = ''
    if (UserLogin.toLowerCase().startsWith('ikd')) {
      var CompanyId = req.privateData.CompanyId;
      userFirstFilter = "IdAgencyCode=" + CompanyId;
    }
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VFactorCartable",
      "*",
      req.body.firstFilter,
      userFirstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getRegisterInfo(req, res, next) {
  try {
    const { nationalCode } = req.body;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("systemCode", sql.VarChar(50), "SaleInternet")
      .input("userName", sql.VarChar(50), nationalCode)
      .execute("MIS.dbo.uspAspNetGetRegisterInfo");
    var registerInfo = result.recordsets[0][0];

    return {
      statusResult: 0,
      message: "خواندن موفق",
      registerInfo: registerInfo,
      cities: result.recordsets[1],
      agencies: result.recordsets[2],
      mojaver: result.recordsets[3],
      disable: result.recordsets[4].length > 0,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getRegisterList(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VIntCustomer",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function registerEdit(req) {
  try {
    let userName = req.privateData.UserLogin;
    var clientIp = req.ip;
    const {
      idIntCustomer,
      nationalCode,
      firstName,
      lastName,
      fatherName,
      birthDate,
      birthCityId,
      certificateNumber,
      mobileNumber,
      phoneNumber,
      address,
      addressCityId,
      postalCode,
      issueCityId,
      issueDate,
      sexId,
      agencyId,
      Activity
    } = req.body;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("idIntCustomer", sql.Int, idIntCustomer)
      .input("nationalCode", sql.VarChar(15), nationalCode)
      .input("firstName", sql.NVarChar(50), firstName)
      .input("lastName", sql.NVarChar(50), lastName)
      .input("fatherName", sql.NVarChar(50), fatherName)
      .input("birthDate", sql.VarChar(10), birthDate)
      .input("birthCityId", sql.Int, birthCityId)
      .input("issueDate", sql.VarChar(10), issueDate)
      .input("issueCityId", sql.Int, issueCityId)
      .input("certificateNumber", sql.VarChar(20), certificateNumber)
      .input("sexId", sql.Int, sexId)
      .input("mobileNumber", sql.VarChar(12), mobileNumber)
      .input("phoneNumber", sql.VarChar(50), phoneNumber)
      .input("address", sql.NVarChar(250), address)
      .input("addressCityId", sql.Int, addressCityId)
      .input("agencyId", sql.Int, agencyId)
      .input("postalCode", sql.VarChar(10), postalCode)
      .input("Activity", sql.TinyInt, Activity)
      .input("userName", sql.VarChar(20), userName)
      .input("clientIP", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(500))
      .execute("MIS.dbo.uspAspNetRegisterEdit");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "ثبت اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    console.log("err.message ==>", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getProjects(req) {
  try {

    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "Sale.dbo.VSaleProjects",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSaleProjectColor(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSaleProjectColor",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getSaleProjectUsage(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VSaleProjectUsage",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function addBaseColorWithModel(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .input("idsaleProject", sql.Int, req.body.idSaleProject)
      .input("idBaseColor", sql.Int, req.body.IDBaseColor)
      .execute("MIS.dbo.uspAddBaseColorWithModel");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  ایجاد کارتابل" };
  }
}
async function addBaseUsageWithModel(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .input("idsaleProject", sql.Int, req.body.idSaleProject)
      .input("idBaseUsage", sql.Int, req.body.IDBaseUsage)
      .execute("MIS.dbo.uspAddBaseUsageWithModel");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  ایجاد کارتابل" };
  }
}
async function deleteBaseColorWithModel(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .input("idsaleProject", sql.Int, req.body.IDSaleProject)
      .input("idBaseColor", sql.Int, req.body.IdBaseColor)
      .execute("MIS.dbo.uspDeleteBaseColorWithModel");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  ایجاد کارتابل" };
  }
}
async function deleteBaseUsageWithModel(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .input("idsaleProject", sql.Int, req.body.IDSaleProject)
      .input("idBaseUsage", sql.Int, req.body.IdBaseUsage)
      .execute("MIS.dbo.uspDeleteBaseUsageWithModel");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  ایجاد کارتابل" };
  }
}
async function getMsgCount(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VContentKeyMsgCount",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getJarimeCalculateList(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VJarimeCalculate",
      "*",
      req.body.firstFilter
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getMessageContent(req, res, next) {

  try {
    let userFilter = ''
    var userLogin = req.privateData.UserLogin;
    const { messageType } = req.body.firstParams
    let query2 = `select  messageType as value , messageTypeName as label  from MIS.dbo.tblMessageType where messageType=${messageType}`
    if (userLogin != 'smsadmin')
      userFilter = `userCode='${userLogin}' and messageType=${messageType} `;
    else
      userFilter = `messageType=${messageType} `;

    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(req.body.lazyParams, "MIS.dbo.vMessageContent", "*", userFilter);
    let result2 = await pool.request().query(query2)
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      messageTypeList: result2.recordset,
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function getMessageContentAll(req, res, next) {
  try {
    const { messageType } = req.body.firstParams
    let query2 = `select  messageType as value , messageTypeName as label  from MIS.dbo.tblMessageType`
    let userFilter = ``;
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(req.body.lazyParams, "MIS.dbo.vMessageContent", "*", userFilter);
    let result2 = await pool.request().query(query2)
    let resultq = await pool.request().query(query);
    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      messageTypeList: result2.recordset,
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function saveMessageContent(req) {
  try {
    const { message, messageTitle, messageType } = req.body;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("message", sql.NVarChar(sql.MAX), message)
      .input("messageTitle", sql.NVarChar(100), messageTitle)
      .input("messageType", sql.Int, messageType)
      .input("userCode", sql.VarChar(20), req.privateData.UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspSaveMessageContent");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "ثبت اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    console.log("err :>> ", err);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function deleteMessageContent(req) {
  try {
    const { messageId } = req.body;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("messageId", sql.Int, messageId)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspDeleteMessageContent");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    return {
      statusResult: 0,
      message: "ثبت اطلاعات با موفقیت انجام شد",
    };
  } catch (err) {
    console.log("err :>> ", err);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}
async function suggestionAction(req) {
  try {
    //console.log('req.doby :>> ', req.body);
    let obj = req.privateData;
    let userLogin = obj.UserLogin;
    var message = req.body.message;
    if (req.body.bazresi == 1) {
      message =
        message +
        `
      مدیریت بازرسی و نظارت
      `;
    }
    var postData = {
      mobileNo: req.body.mobileNumber,
      message: message,
      clientTypeId: 66,
      userName: userLogin,
      clinetKey: "10",
    };

    //اگر تایپ فقط پیامک باشد مجاز به ارسال هستیم غیر از آن مثل ارسال به کارتابل و مردود و ... نیازی نیست
    if (req.body.responType == 1) {
      //console.log('message :>> sms');
      sendSingeMessage(postData);
    }

    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("suggestionId", sql.Int, req.body.suggestionId)
      .input("responType", sql.Int, req.body.responType)
      .input("cartableId", sql.Int, req.body.cartable)
      .input("message", sql.NVarChar(sql.MAX), message)
      .input("mobile", sql.VarChar(15), req.body.mobileNumber)
      .execute("MIS.dbo.uspSuggestionSendToCartable");

    return {
      statusResult: 0,
    };
  } catch (err) {
    console.log("err :>> ", err);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}



//متد ارسال پیامک یک عددی جدید ----------------------------------------------New-------------------------------------
async function sendSingeMessage(req) {
  if (!req.userName)
    var userName = req.privateData.UserLogin;
  else
    var userName = req.userName;
  if (!req.message)
    var message = req.body.message;
  else
    var message = req.message;
  if (!req.mobileNo)
    var mobileNo = req.body.mobileNo;
  else
    var mobileNo = req.mobileNo;
  if (!req.clinetKey)
    var clinetKey = req.body.clinetKey;
  else
    var clinetKey = req.clinetKey;
  if (!req.clientTypeId)
    var clientTypeId = req.body.clientTypeId;
  else
    var clientTypeId = req.clientTypeId;

  if (!mobileNo || mobileNo.length != 11 || !mobileNo.startsWith("09"))
    return "خطا در ساختار موبایل";

  let sendResult = await sendMessage(mobileNo, message, userName, clientTypeId, clinetKey)

  return sendResult
}

//متد جدید ارسال پیامک لیست شده جدید ----------------------------------------New-------------------------------------
async function sendMessages(req, res, next) {

  try {
    const {
      message,
      messageId,
      selectedRows,
      contentType,
      messageType,
      contentMessageType,
    } = req.body;

    let userName = req.privateData.UserLogin;
    var listNumbers = [];
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("messageId", sql.Int, messageId)
      .execute("MIS.dbo.getTodayMessageOut");
    if (result.recordset.length > 0) {
      for (var i = 0; i < selectedRows.length; i++) {
        let indexList = result.recordset.filter(
          (x) => x.MobileNumber == selectedRows[i].MobileNumber
        );
        if (!indexList || indexList.length <= 0) {
          if (contentType == 1)
            listNumbers.push({
              MobileNumber: selectedRows[i].MobileNumber,
              FactorNo:selectedRows[i].FactorNo,
              content: `${message} \nشماره شاسی: ${selectedRows[i].shasiNofull} \nمدل خودرو: ${selectedRows[i].TitleModel}`,
            });
          else if (messageType == 14 && contentMessageType)
            listNumbers.push({
              MobileNumber: selectedRows[i].MobileNumber,
              content: selectedRows[i].SmsContentFarsi,
            });
          else listNumbers.push({ MobileNumber: selectedRows[i].MobileNumber });
        }
      }
    } else
      for (var i = 0; i < selectedRows.length; i++) {
        if (contentType == 1)
          listNumbers.push({
            MobileNumber: selectedRows[i].MobileNumber,
            FactorNo:selectedRows[i].FactorNo,
            content: `${message} \nشماره شاسی: ${selectedRows[i].shasiNofull} \nمدل خودرو: ${selectedRows[i].TitleModel}`,
          });
        else if (messageType == 14 && contentMessageType)
          listNumbers.push({
            MobileNumber: selectedRows[i].MobileNumber,
            content: selectedRows[i].SmsContentFarsi,
          });
        else listNumbers.push({
          MobileNumber: selectedRows[i].MobileNumber,
          content: message,
        });
      }
    if (listNumbers.length <= 0) {
      return {
        statusResult: 0,
        message: "این پیام قبلا برای این افراد ارسال شده است",
        count: 0,
      };
    }
    let sendResult = await sendMessagesAll(listNumbers, userName, 666, 666, messageType, contentType, contentMessageType)
    return sendResult
  }
  catch (err) {
    //console.log('err :>> ', err.message);
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای یا ارسال پیام' }
  }
}

//متد جدید ارسال پیامک لیست شده جدید بطریق خواندن از دیتابیس جدید --------New----------ALL تیک خورده باشه---------------------------
async function sendMessagesAllFormDB(req) {
  try {
  
    const { message, messageId, contentType, messageType, contentMessageType } = req.body;
    let today = getPersianDate();
    var query = SqlCommandCreator(
      req.body.lazyParams,
      req.body.tableName,
      `MobileNumber,'${message}' AS content`,
      req.body.firstFilter,
      `MobileNumber!='' and MobileNumber not in(Select DISTINCT case WHEN LEFT(destNo,2)='98' THEN '0'+SUBSTRING(destNo,3,10) ELSE destNo END AS MobileNumber FROM [MIS].[dbo].[TMessageOut] WHERE clientIdType='500' AND clientId='${messageId}' AND senttime>='${today}')`
    );
    if (contentType == 1)
    {
     
      query = SqlCommandCreator(
        req.body.lazyParams,
        req.body.tableName,
        `MobileNumber,'${message}'+'\nشماره شاسی: '+ShasiNofull+'\nمدل خودرو: '+TitleModel AS content , FactorNo`,
        req.body.firstFilter,
        `MobileNumber!='' and  MobileNumber not in(Select DISTINCT case WHEN LEFT(destNo,2)='98' THEN '0'+SUBSTRING(destNo,3,10) ELSE destNo END AS MobileNumber FROM [MIS].[dbo].[TMessageOut] WHERE clientIdType='16'  AND senttime>='${today}')`
      );
     
    }
    else if (messageType == 14 && contentMessageType)
      query = SqlCommandCreator(
        req.body.lazyParams,
        req.body.tableName,
        `MobileNumber,SmsContentFarsi AS content`,
        req.body.firstFilter,
        `MobileNumber!='' and  MobileNumber not in(Select DISTINCT case WHEN LEFT(destNo,2)='98' THEN '0'+SUBSTRING(destNo,3,10) ELSE destNo END AS MobileNumber FROM [MIS].[dbo].[TMessageOut] WHERE clientIdType='500' AND clientId='${messageId}' AND senttime>='${today}')`
      );
    const pool = await pools.getPool("MIS");
    let resultq = await pool.request().query(query);
    var rows = resultq.recordsets[0];

    if (rows.length > 0) {
      let userName = req.privateData.UserLogin;

      //console.log('All Numbers....', listNumbers.MobileNumber)
      
      let sendResult = await sendMessagesAll(rows, userName, 777, 777, messageType, contentType, contentMessageType)
      return sendResult
    }
  }
  catch (err) {
    //console.log('err :>> ', err.message);
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای یا ارسال پیام' }
  }
}

//ارسال پیامک توسط نرم افزارهای مستقل شرکت مانند آموزش و پیشنهادات جدید....New---------------781 Pishnahadat--------780 Amouzesh - Ideh----------------
//https://sms.ikd.ir/api/sms/sendmessageapi
async function sendMessageAPI(req, res) {
  try {
    var clientIp = req.ip;
    const { userName, password, message, mobileNumber, clientTypeId } = req.body

    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("userName", sql.VarChar(20), userName)
      .input("password", sql.VarChar(20), password)
      .input("clientIp", sql.VarChar(50), clientIp)
      .input("clientTypeId", sql.VarChar(20), clientTypeId)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspCheckPermissionSmsApi");
    // if (
    //   (clientIp.includes("172.19.1.") || clientIp.includes("172.19.4.") || clientIp.includes("172.19.6.")) &&
    //   userName == "ikcoUser12345" &&
    //   password == "12345678!"
    // ) {
    if(result.output.msgRet==""){
      var postData = {
        mobileNo: mobileNumber,
        message: message,
        clientTypeId: clientTypeId ? clientTypeId : 780,
        userName: userName,
        clinetKey: "33",
      };
      return sendSingeMessage(postData);
    }
    else {
      return { statusResult: 1, message: result.output.msgRet };
    }
  } catch (err) {
    return { statusResult: 2, message: "خطا در ارسال پیام" };
  }
}

async function getCreditValue() {
  try {
    const response = await axios.post('http://services.mizbansms.com/api/Customer/Credites', {
      usertype: 2,
      username: "09192248625",
      password: "0073740721",
    });
    //console.log('resData.data :>> ', response.data);
    return response.data;

  }
  catch (err) {
    console.log("err", err);
    return {
      statusResult: 1,
      message: "خطا در  دریافت اطلاعات اعتبار - " + err.message,
      count: 0,
    };
  }
}

async function getSendMessages(req, res, next) {
  try {
    const { IdIntCustomer, destNo } = req.body.firstParams;
    if (IdIntCustomer && IdIntCustomer != 0)//مقدار دارد
    {
      //مشاهده پیامکهای ارسال شده به مشتری در پروفایل مشتری که ممکن است تغییر موبایل داده و نیاز است که پیامکهای قدیمی ارسال شده هم نمایش داده شود
      //بعد از تغییر موبایل ، شماره تلفن همراه قدیمی در جدولی درج می شود
      //مشاهده پیامهای ارسالی به مشتری در پروفایل مشتری
      var userFilter = `IdIntCustomer=${IdIntCustomer} or destNo='${destNo}'`; //
      var query = SqlCommandCreator(
        req.body.lazyParams,
        "MIS.dbo.VMessageOutChangedMobil",
        "*",
        userFilter
      );
      const pool = await pools.getPool("MIS");
      let resultq = await pool.request().query(query);
      return {
        statusResult: 0,
        rows: resultq.recordsets[0],
        totalRecords: resultq.recordsets[1][0].totalCount,
      };
    }
    
    else {
      //مشاهده پیامهای ارسالی به مشتری در نمایندگی ها و پیش فاکتور
      var userFilter = "1=0";
      if (req.body.firstFilter) userFilter = req.body.firstFilter;
      else {
        userFilter = `destNo='${req.privateData.Mobile}'`;
      }
      var query = SqlCommandCreator(
        req.body.lazyParams,
        "MIS.dbo.VMessageOut",
        "*",
        userFilter
      );
      const pool = await pools.getPool("MIS");
      let resultq = await pool.request().query(query);
      return {
        statusResult: 0,
        rows: resultq.recordsets[0],
        totalRecords: resultq.recordsets[1][0].totalCount,
      };
    }
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای" ,
    };
  }
}

// async function checkIPService(clientIp, serviceNumber, userName, password) {
//   try {
//     const pool = await pools.getPool("MIS");
//     let result = await pool
//       .request()
//       .input("clientIp", sql.VarChar(50), clientIp)
//       .input("serviceNumber", sql.Int, serviceNumber)
//       .input("messageType", sql.Int, messageType)
//       .input("userName", sql.VarChar(20), userName)
//       .input("password", sql.VarChar(20), password)
//       .output("msgRet", sql.NVarChar(200))
//       .execute("MIS.dbo.uspCheckIPService");
//     return result.output.msgRet;
//   } catch (err) {
//     return err.message;
//   }
// }

// const axiosConfigToken = (strData) => {
//   const strBuffer = Buffer.from(strData);
//   const strBase64 = strBuffer.toString("base64");
//   return {
//     headers: {
//       "Content-Type": "application/json;charset=UTF-8",
//       Authorization: `Basic ${strBase64}`,
//     },
//   };
// };

async function getVamcoTolidData(res) {
  try {
    let today = getPersianDate();
    const pool = await pools.getPool('Tolid')
    let result = await pool.request()
      .input('Company', sql.NVarChar(100), 'Vamco')
      .output('id', sql.Int)
      .output('LastOkStartDate', sql.NVarChar(10))
      .execute('Tolid.dbo.uspSubGroupActionInsert');

    var id = result.output.id
    var LastOkStartDate = result.output.LastOkStartDate //دریافت آخرین تاریخ موفق دریافت دیتاها

    // دریافت دیتا براساس دو روز قبل صورت می گیرد
    let resultD = await pool.request()
      .input("Date", sql.VarChar(10), today)
      .input("Mah", sql.Int, 0)
      .input("Rooz", sql.Int, -1)
      .execute('Tolid.dbo.AddDate');
    var todayMinus = resultD.output[''];

    //oldAddress
    //var v = 'http://185.83.196.122:7070/ikd/api/MyTest?PropertiesList=ModelCode;ModelTitle;Group;DateTolid;NumberOfProduct;NumberOfSentToDiesel&Type=VW_IKD_Tolid&FromDate=' + LastOkStartDate + '&ToDate=' + today;

    var v = 'http://5.160.65.106:7070/ikd/api/MyTest?PropertiesList=ModelCode;ModelTitle;Group;DateTolid;NumberOfProduct;NumberOfSentToDiesel&Type=VW_IKD_Tolid&FromDate=' + LastOkStartDate + '&ToDate=' + todayMinus;
    let encoded = encodeURI(v);
    let res = await axios.get(encoded)

    if (res.status == 200) {      //آیا دیتا با موفقیت از مبدا دریافت شده است
      var jsonData = res.data
      var parsejson = JSON.stringify(jsonData);

      let result1 = pool.request()
        .input("jsonData", sql.NVarChar(sql.MAX), parsejson)
        .input("type", sql.Int, 1)  //Vamco
        .execute("Tolid.dbo.uspSubGroupTolidInsert");

      let result2 = pool.request()
        .input("id", sql.Int, id)
        .input("Flag", sql.Int, 1) //Flag موفق
        .input("ErrorDescr", sql.NVarChar(250), '')
        .execute("Tolid.dbo.uspSubGroupActionUpdate");
    }
    else {                          //اگر خطا گرفتیم
      let result3 = pool.request()
        .input("id", sql.Int, id)
        .input("Flag", sql.Int, 2)  //Flag ناموفق
        .input("ErrorDescr", sql.NVarChar(250), 'status: ' + res.status + ' ' + 'پاسخی از سمت سرور مبدا دریافت نشد')
        .execute("Tolid.dbo.uspSubGroupActionUpdate");
    }
    return { statusResult: 0, message: "فراخوانی با موفقیت انجام شد" };
  }

  catch (err) {
    const pool = await pools.getPool('Tolid')
    let result4 = pool.request()
      .input("id", sql.Int, id)
      .input("Flag", sql.Int, 2)   //Flag ناموفق
      .input("ErrorDescr", sql.NVarChar(250), err.message)
      .execute("Tolid.dbo.uspSubGroupActionUpdate");
    return { statusResult: 2, message: err.message };
  }
}

async function getCharkheshgarTolidData(res) {
  try {
    let today = getPersianDate();
    const pool = await pools.getPool('Tolid')
    let result = await pool.request()
      .input('Company', sql.NVarChar(100), 'Charkheshgar')
      .output('id', sql.Int)
      .output('LastOkStartDate', sql.NVarChar(10))
      .execute('Tolid.dbo.uspSubGroupActionInsert');

    var id = result.output.id
    var LastOkStartDate = result.output.LastOkStartDate   //دریافت آخرین تاریخ موفق دریافت دیتاها

    //"http://94.183.68.35:8050 //------------------------------------------Old  IP Address
    var v = "http://94.182.20.35:8050/api/login";
    let url = encodeURI(v);
    var postData = {
      email: 'diesel@charkheshgar.com',
      password: 'b3Zq3Ov!C|D~@7?QDDU#d3s-5]J5}%F,',
    };
    var res = await axios.post(url, postData, axiosConfig);
    var token = res.data

    //دریافت اطلاعات تولید در شرکت
    // var v = 'http://94.182.20.35:8050/api/getProductionReport?date=14031201&end_date=14031201';
    var v = 'http://94.182.20.35:8050/api/getProductionReport?date=' + LastOkStartDate.replaceAll('/', '') + "&end_date=" + LastOkStartDate.replaceAll("/", "");
    let encoded = encodeURI(v);
    let res2 = await axios.get(encoded, { headers: { "Authorization": `Bearer ${token.data.token}` } })

    if (res2.status == 200) {     // آیا دیتای تولید با موفقیت از مبدا دریافت شده است
      var jsonData = res2.data
      var parsejson = JSON.stringify(jsonData);

      //دریافت اطلاعات توقف خط در شرکت
      // var vt = 'http://94.182.20.35:8050/api/getStopReport?date=14041106&end_date=14041106';
      var vt = 'http://94.182.20.35:8050/api/getStopReport?date=' + LastOkStartDate.replaceAll('/', '') + "&end_date=" + LastOkStartDate.replaceAll("/", "");
      let encodedV = encodeURI(vt);
      let resT = await axios.get(encodedV, { headers: { "Authorization": `Bearer ${token.data.token}` } })

      if (resT.status == 200) {     // آیا دیتای توقف با موفقیت از مبدا دریافت شده است

        var jsonTavaghofData = resT.data
        var parsejsonTavaghof = JSON.stringify(jsonTavaghofData);

        //درج اطلاعات تولید در دیتابیس
        let result1 = pool.request()
          .input("jsonData", sql.NVarChar(sql.MAX), parsejson)
          .input("type", sql.Int, 2) //Charkheshgar
          .execute("Tolid.dbo.uspSubGroupTolidInsert");

        //درج اطلاعات توقف در دیتابیس
        let resultT = pool.request()
          .input("jsonData", sql.NVarChar(sql.MAX), parsejsonTavaghof)
          .input("type", sql.Int, 2) //Charkheshgar
          .execute("Tolid.dbo.uspSubGroupTavaghofInsert");

        let result2 = pool.request()
          .input("id", sql.Int, id)
          .input("Flag", sql.Int, 1)  //Flag موفق
          .input("ErrorDescr", sql.NVarChar(250), '')
          .execute("Tolid.dbo.uspSubGroupActionUpdate");
      }
    }
    else {                          //اگر خطا گرفتیم
      let result3 = pool.request()
        .input("id", sql.Int, id)
        .input("Flag", sql.Int, 2)  //Flag ناموفق
        .input("ErrorDescr", sql.NVarChar(250), 'status: ' + res2.status + ' ' + 'پاسخی از سمت سرور مبدا دریافت نشد')
        .execute("Tolid.dbo.uspSubGroupActionUpdate");
    }
    return { statusResult: 0, message: "فراخوانی با موفقیت انجام شد" };
  }
  catch (err) {
    const pool = await pools.getPool('Tolid')
    let result4 = pool.request()
      .input("id", sql.Int, id)
      .input("Flag", sql.Int, 2)   //Flag ناموفق
      .input("ErrorDescr", sql.NVarChar(250), err.message)
      .execute("Tolid.dbo.uspSubGroupActionUpdate");
    return { statusResult: 2, message: err.message };
  }
}

async function getMessageType(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'MIS.dbo.tblMessageType', '*', req.body.firstFilter)
    let pool = await pools.getPool('MIS')
    let result = await pool.request().query(myQuery);

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    return err
  }
}

async function getMessageContentParam(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'MIS.dbo.vwMessageContentParam', '*', req.body.firstFilter)
    let pool = await pools.getPool('MIS')
    let result = await pool.request().query(myQuery);

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    return err
  }
}

async function getMessageContentParamDetail(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'MIS.dbo.vwMessageContentParamDetail', '*', req.body.firstFilter)
    let pool = await pools.getPool('MIS')
    let result = await pool.request().query(myQuery);

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    return err
  }
}

async function messageContentParamInsert(req) {
  try {
    //console.log('req.body :>> ', req.body);
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("MessageType", sql.Int, req.body.MessageType)
      .input("MessageContent", sql.NVarChar(sql.MAX), req.body.MessageContent)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspMessageContentParamInsert");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` پارامتر پیام با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    //console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function MessageContentParamUpdate(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("MessageContentParamId", sql.Int, req.body.MessageContentParamId)
      .input("MessageContent", sql.NVarChar(sql.MAX), req.body.MessageContent)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspMessageContentParamUpdate");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` پارامتر پیام بروزآوری گردید`,
    };
  } catch (err) {
    //console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function messageContentParamDelete(req) {
  try {
    //console.log('req.body :>> ', req.body);
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("MessageContentParamId", sql.Int, req.body.MessageContentParamId)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspMessageContentParamDelete");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` پارامتر پیام حذف گردید`,
    };
  } catch (err) {
    //console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function messageContentParamDetailInsert(req) {
  try {
    //console.log('req.body :>> ', req.body);
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("MessageContentParamId", sql.Int, req.body.MessageContentParamId)
      .input("ParamType", sql.Int, req.body.ParamType)
      .input("FieldName", sql.VarChar(100), req.body.FieldName)
      .input("MessageContentParamNo", sql.Int, req.body.MessageContentParamNo)

      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspMessageContentParamDetailInsert");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` پارامتر پیام با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function messageContentParamDetailUpdate(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("MessageContentParamDetailId", sql.Int, req.body.MessageContentParamDetailId)
      .input("ParamType", sql.Int, req.body.ParamType)
      .input("FieldName", sql.VarChar(100), req.body.FieldName)
      .input("MessageContentParamNo", sql.Int, req.body.MessageContentParamNo)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspMessageContentParamDetailUpdate");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` پارامتر پیام بروزآوری گردید`,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function messageContentParamDetailDelete(req) {
  try {
    //console.log('req.body :>> ', req.body);
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("MessageContentParamDetailId", sql.Int, req.body.MessageContentParamDetailId)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspMessageContentParamDetailDelete");

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` پارامتر جزئیات پیام حذف گردید`,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function updateDueDeliverProg(req) {
  try {
    const { ID, NumberOfRegistrationInternet, IsActive } = req.body
    console.log('req.body :>> ', req.body);
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("ID", sql.NVarChar(50), ID)
      .input("NumberOfRegistrationInternet", sql.Int, NumberOfRegistrationInternet)
      .input("IsActive", sql.Bit, IsActive)
      .input("UserLogin", sql.VarChar(20), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspUpdateDueDeliverProg");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      }
    }
    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function deleteDueDeliverProg(req) {
  try {
    const { ID, NumberOfRegistrationInternet, IsActive } = req.body
    console.log('req.body :>> ', req.body);
    let obj = req.privateData;
    let UserLogin = obj.UserLogin;
    const pool = await pools.getPool("MIS");
    let result = await pool
      .request()
      .input("ID", sql.NVarChar(50), ID)
      .input("UserLogin", sql.VarChar(20), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute("MIS.dbo.uspDeleteDueDeliverProg");
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      }
    }
    return {
      statusResult: 0,
      message: "ذخیره با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function initCartable(req) {
  try {
    const pool = await pools.getPool("MIS");
    let result = pool
      .request()
      .execute("MIS.dbo.uspInitCartable");

    return {
      statusResult: 0,
    };
  } catch (err) {
    return { statusResult: 2, message: "خطا در  بروزرسانی" };
  }
}

async function getPrefactorsForSms(req, res, next) {
  try {
    const pool = await pools.getPool("MIS");
    var query = SqlCommandCreator(
      req.body.lazyParams,
      "MIS.dbo.VPrefactorForSms",
      "*"
    );
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rows: resultq.recordsets[0],
      totalRecords: resultq.recordsets[1][0].totalCount,
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}


async function getAgencyCapacityControl(req) {
  try {
    const pool = await pools.getPool("MIS");
    var query = "select * from MIS.dbo.VAgencyCapacityControle";
    let resultq = await pool.request().query(query);

    return {
      statusResult: 0,
      rightRows: resultq.recordsets[0],
      leftRows: [],
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای " + err.message,
    };
  }
}


async function getSuggestionUIData(req, res, next) {
  try {
    // console.log('reqSuggggggggggggg :>> ', req.body);
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('locationCode', sql.Int, req.body.locationCode)
      .input('TypeAgency', sql.Int, req.body.TypeAgency)
      .execute('dbo.uspGetSuggestionUIData')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      suggestionObject: result.recordsets[0],
      suggestionDefect: result.recordsets[1],
      suggestionCars: result.recordsets[2],
      agencies: result.recordsets[3],
    };
  } catch (err) {
    // console.log('err :>> ', err.message); 
    throw err
  }
}

async function createSuggestion(req, res, next) {
  try {
    const { locationCode, nationalCode, mobileNumber, firstName, lastName, email, description, shassiNo, idSuggestionDefect, idSuggestionCar, responCode, paygiriId, companyName, KilometerKarkard, IDAgencyCode } = req.body;
    let userName = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('mobileNumber', sql.VarChar(15), mobileNumber)
      .input('nationalCode', sql.VarChar(15), nationalCode)
      .input('firstName', sql.NVarChar(50), firstName)
      .input('lastName', sql.NVarChar(50), lastName)
      .input('email', sql.VarChar(80), email)
      .input('description', sql.NVarChar(4000), description)
      .input('shassiNo', sql.VarChar(50), shassiNo)
      .input('defectId', sql.Int, idSuggestionDefect)
      .input('khodroId', sql.Int, idSuggestionCar)
      .input('responCode', sql.VarChar(10), responCode)
      .input('locationCode', sql.Int, locationCode)
      .input('paygiriId', sql.Int, paygiriId)
      .input('companyName', sql.NVarChar(50), companyName)
      .input('KilometerKarkard', sql.Int, KilometerKarkard)
      .input('IDAgencyCode', sql.Int, IDAgencyCode)
      .output('identity', sql.Int)
      .output('msgRet', sql.NVarChar(500))
      .execute('dbo.uspCreateSuggestion');
    //console.log('result.output.msgRet :>> ', result.output.msgRet);
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet,
      };
    }
    if (result.output.identity == 0) {
      return {
        statusResult: 0,
        message: 'ثبت اطلاعات با موفقیت انجام شد',
      };
    }
    var message = ''
    message = `مخاطب گرامی با سلام و سپاس پیام شما با شماره پیگیری ${result.output.identity} در سیستم ثبت گردید در نخستین فرصت نتایج بررسی آن،جهت استحضار تقدیم میگردد
      اداره کل ارتباط با مشتریان شرکت ایران خودرو دیزل`

    let sendResult = await sendMessage(mobileNumber, message, userName, 910, 33)

    if (sendResult != '') {
      return {
        statusResult: 0,
        message: "ذخیره با موفقیت انجام شد",
      };
    }
    // return {
    //     statusResult: 0,
    //     message: 'ذخیره با موفقیت انجام شد'
    // };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' + err.message }
  }
}

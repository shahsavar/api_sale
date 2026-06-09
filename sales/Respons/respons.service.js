const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const requestIp = require('request-ip');
const os = require('node:os');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const cryptoService = require('../../public/crypto/crypto.service');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
const { errorMonitor } = require('node:events');
const fs = require('fs');
const { getPersianDate } = require('../../_helpers/persian.calender');




const axiosConfig = {
  "async": true,
  "crossDomain": false,
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    'Access-Control-Allow-Origin': "*",
  },
  "processData": true,
  "encoding": null
};
module.exports = {
  getRespons,
  getResponUIData,
  getResponExtraUIData,
  getSaleProjectsForRespon,
  getResponRadifNo,
  getColorOrder,
  getUsageOrder,
  responInsert,
  responDelete,
  responUpdate,

  getRelatResponWithCustomer,
  getResponWithCustomerUIData,
  responWithCustomerInsert,
  responWithCustomerUpdate,
  responWithCustomerDelete,
  setForResponOwner,
  setForResponNumbering,
  setForResponPartner,
  setActiveCustomer,
  printRespon,
  checkAllowPrintRespon,
  getTarhinPrintData,
  getResponsIsFactorForHoghughiCustomers,
  transferSaleData,
  //////////  استرداد تعهد
  getEsterdadResponList,
  getEsterdadExtraData,
  EsterdadResponInsert,
  EsterdadResponUpdate,
  EsterdadResponDelete,
  getMablaghEsterdadExtra,
  getEsterdadMablaghList,
  getPayUsedEsterdadList,
  PayUsedEsterdadKoliInsert,
  PayUsedEsterdadInsert,
  PayUsedEsterdadDelete,
  EsterdadResponErsalMali,
  getEsterdadPrintData,

  getEsterdadReportList,
  ConfirmCustomerAccountEsterdad,
  //////////
  getResponPassedAllCheck,
  responChangeState,
  ///////// تغییرات نوع تعهد
  getResponChangeUIData,
  getResponChangeList,
  getPaymentChangeModel,
  getModelCodePickList,
  responChangeModelInsert,
  getPaymentUsedChangeModel,
  responChangeModelDelete,
  getResponChangeHazineh,
  paymentUsedChangeModelInsert,
  paymentUsedChangeModelDelete,
  ResponChangeModelErsalMali,
  getVDetailRename,
  getResponChangeNameUIData,
  responMasterReNameInsert,
  getResponChangeNameHazineh,
  responMasterReNameUpdate,
  responMasterReNameDelete,
  getPaymentChangeName,
  getPaymentUsedChangeName,
  paymentUsedChangeNameInsert,
  paymentUsedChangeNameDelete,
  responChangeDetailRenameInsert,
  responChangeDetailRenameUpdate,
  responChangeDetailRenameDelete,
  responTaeenOwnerReName,
  responTaeenPartnerReName,
  responTaeenNumberingReName,
  ResponChangeNameErsalMali,
  getChangeNamePrintUIData,
  getChangeModelPrintUIData,

  ////////
  getImportResponListError,
  getDefaultResponWithCustomer,
  /////// ضمانت قرارداد
  getTazminRespon,
  getTazminResponExtraData,
  getTypeTazminList,
  GetMandePaymentZemanat,
  GetMahzarList,
  RelatTypeTazaminWithResponInsert,
  RelatTypeTazaminWithResponUpdate,
  RelatTypeTazaminWithResponDelete,
  getFactorTazamin,
  GetResponFactorList,
  FactorTazaminInsert,
  FactorTazaminUpdate,
  FactorTazaminEbtalOdat,
  getChangesResponList,

  /////// انتقال تعهد به شرکت دیگر
  getTrans2otherCompanyList,
  getMandePayUsedTrans2OtherCompany,
  getResponPickList,
  getFactorPickList,
  orderTrans2OtherCompanyInsert,
  orderTrans2OtherCompanyUpdate,
  orderTrans2OtherCompanyDelete,
  getPaymentTrans2otherCompany,
  getPaymentUsedTrans2OtherCompany,
  responPayUsedTrans2OtherCompanyInsert,
  getSoudTrans2otherCompany,
  responPayUsedTrans2OtherCompanyDelete,
  orderTrans2OtherCompanyErsalMali,
  getFactorSubHazineOtherCompanyList,
  getTrans2otherCompanyPrintUIData,

  //////// برداشت وجه از تعهد
  getResponPaymentBardashtVajhList,
  getResponBardashtVajhUIData,
  getResponSoud,
  orderResponTrans2OtherResponInsert,
  orderResponTrans2OtherResponUpdate,
  orderResponTrans2OtherResponDelete,
  orderResponTrans2OtherResponErsalMali,
  getPaymentResponBardashtVajh,
  getPaymentUsedTrans2OtherRespon,
  getSoudResponTrans2OtherRespon,
  responPayUsedTrans2OtherResponInsert,
  paymentUsedTrans2OtherResponDelete,
  getTrans2OtherResponPrintUIData,

  //////// اخطار تعهد
  getResponEkhtarList,
  getResponEkhtarUIData,
  responEkhtarInsert,
  ResponEkhtarUpdate,
  responEkhtarDelete,
  getReportResponEkhtarList,
}

async function getRespons(req) {
  let UserLogin = req.privateData.UserLogin;
  var Agencyfilter = '';

  //هر نمایندگی فقط تعدات خودش را ببیند
  if (UserLogin.toLowerCase().startsWith('ikd'))
    Agencyfilter = ` IDAgencyCommission in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`


  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VRespon', '*', req.body.firstFilter, Agencyfilter)

    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    result.recordsets[0]
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log('err :>> ', err);
    return err
  }
}

async function getResponsIsFactorForHoghughiCustomers(req) {
  let UserLogin = req.privateData.UserLogin;
  var Agencyfilter = '';

  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwGetResponsIsFactorForHoghughiCustomers', '*', req.body.firstFilter, Agencyfilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log('err :>> ', err);
    return err
  }
}
async function getRelatResponWithCustomer(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VRelatResponWithCustomer', '*', req.body.firstFilter)
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


async function getResponUIData(req) {
  try {
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('userName', sql.VarChar, UserLogin)
      .input('IdRespon', sql.VarChar, req.body.IdRespon)
      .execute('Sale.sale.uspGetResponUIData')
    // var registerInfo=result.recordsets[0][0];
    return {
      statusResult: 0,
      message: "خواندن موفق",
      agencies: result.recordsets[0],
      designRespons: result.recordsets[1],
      // saleProjectPrices: result.recordsets[2] ? result.recordsets[2][0] : '',
      // responMessage: result.recordsets[3] ? result.recordsets[3][0] : '',
      // relateCustomerAccounts: result.recordsets[4] ? result.recordsets[4] : [],
      // colorOrder: result.recordsets[5] ? result.recordsets[5] : [],
      // usageOrder: result.recordsets[6] ? result.recordsets[6] : [],
    };
  } catch (err) {
    console.log('err.err', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getResponExtraUIData(req) {
  try {
    // let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .execute('Sale.sale.uspGetResponExtraUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      pricelist: result.recordsets[0] ? result.recordsets[0] : '',
      responMessage: result.recordsets[1][0] ? result.recordsets[1][0].MatnMessage : '',
      relateCustomerAccounts: result.recordsets[2] ? result.recordsets[2] : [],
      colorOrder: result.recordsets[3] ? result.recordsets[3] : [],
      usageOrder: result.recordsets[4] ? result.recordsets[4] : [],
      // TypeClassSaleProjects: result.recordsets[5] ? result.recordsets[5][0] : [],
    };
  } catch (err) {
    console.log('err.err', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getResponRadifNo(req) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgency', sql.Int, req.body.IdAgency)
      .execute('Sale.sale.uspGetResponRadifNo')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      responRadifNo: result.recordsets[0],
    };
  } catch (err) {
    //return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')

  }
}

async function getSaleProjectsForRespon(req) {
  const { first, rows, page } = req.body
  //var data=req.body.filters

  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwSaleProjectsForRespon', '*', req.body.firstFilter)
    let pool = await pools.getPool('Sale')


    console.log("myQuery ==>" , myQuery)
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

async function getColorOrder(req) {
  try {
    // let obj = req.privateData;
    // let UserLogin=obj.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdModel', sql.Int, req.body.IdModel)
      .execute('Sale.sale.uspGetColorOrder')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      colorOrder: result.recordsets[0],
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function getUsageOrder(req) {
  try {
    // let obj = req.privateData;
    // let UserLogin=obj.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdModel', sql.Int, req.body.IdModel)
      .execute('Sale.sale.uspGetUsageOrder')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      usageOrder: result.recordsets[0],
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function responInsert(req) {
  try {
    var clientIp = req.ip;

    let UserLogin = req.privateData.UserLogin;



    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, 0)
      .output('Code', sql.Int)
      .input('IdCustomer', sql.Int, req.body.IDOwnerCustomer)
      .input('IDResponCode', sql.Int, req.body.IDResponParent)
      .input('IDDueDeliverProg', sql.Int, req.body.IdDueDeliverProg)
      .input('Quantity', sql.Int, req.body.Quantity)
      .input('IDSaleProjects', sql.Int, req.body.IDSaleProjects)
      .input('IDAgencyCode', sql.Int, req.body.IDAgencyCode)
      .input('IDAgencyCommission', sql.Int, req.body.IDAgencyCommission)
      .input('ResponRadif', sql.Int, req.body.ResponRadif)
      .input('ResponDate', sql.NVarChar(10), req.body.ResponDate)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('IdCustomerPartner', sql.Int, req.body.IDCustomerPartner)
      .input('introductionno', sql.NVarChar(20), req.body.IntroductionNo)
      .input('introductiondate', sql.NVarChar(10), req.body.IntroductionDate)
      .input('TransSanad', sql.Bit, req.body.TransSanad)
      .input('IdCoLorOrder', sql.Int, req.body.IDColorOrder)
      .input('InsuranceCalc', sql.Int, req.body.InsuranceCalc)
      .input('BakhshnameNo', sql.NVarChar(15), req.body.BakhshnameNo)
      .input('DesignRespon', sql.Int, req.body.DesignRespon)
      .input('IdUsageOrder', sql.Int, req.body.IDUsageOrder)
      .input('idRelatCustomerWithAccount', sql.Int, 0)
      .input('MatnRespon', sql.NVarChar(500), req.body.MatnRespon)
      .input('NumberingCalc', sql.TinyInt, req.body.NumberingCalc)
      .input('HaveAccounting', sql.TinyInt, req.body.HaveAccounting)
      .input('TarhinApply', sql.Int, req.body.TarhinApply)
      .input('PriceTotal', sql.Numeric(18, 0), req.body.PriceNumberingCalc)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `تعهد با کد ${result.output.Code} ذخیره گردید`,
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function responDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    // const { ID } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.ID)
      .input('userId', sql.NVarChar(10), UserLogin)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ابطال تعهد با موفقیت انجام شد",
    };
  } catch (err) {
    //return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function responUpdate(req) {
  try {
    var clientIp = req.ip;
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('ID', sql.Int, req.body.ID)
      .output('Code', sql.Int)
      .input('IdCustomer', sql.Int, req.body.IDOwnerCustomer)
      .input('IDResponCode', sql.Int, req.body.IDResponParent)
      .input('IDDueDeliverProg', sql.Int, req.body.IDDueDeliverProg)
      .input('Quantity', sql.Int, req.body.Quantity)
      .input('IDSaleProjects', sql.Int, req.body.IDSaleProjects)
      .input('IDAgencyCode', sql.Int, req.body.IDAgencyCode)
      .input('IDAgencyCommission', sql.Int, req.body.IDAgencyCommission)
      .input('ResponRadif', sql.Int, req.body.ResponRadif)
      .input('ResponDate', sql.NVarChar(10), req.body.ResponDate)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('IdCustomerPartner', sql.Int, req.body.IDCustomerPartner)
      .input('introductionno', sql.NVarChar(20), req.body.IntroductionNo)
      .input('introductiondate', sql.NVarChar(10), req.body.IntroductionDate)
      .input('TransSanad', sql.Bit, req.body.TransSanad)
      .input('IdCoLorOrder', sql.Int, req.body.IDColorOrder)
      .input('InsuranceCalc', sql.Int, req.body.InsuranceCalc)
      .input('BakhshnameNo', sql.NVarChar(15), req.body.BakhshnameNo)
      .input('DesignRespon', sql.Int, req.body.DesignRespon)
      .input('IdUsageOrder', sql.Int, req.body.IDUsageOrder)
      .input('idRelatCustomerWithAccount', sql.Int, req.body.idRelatCustomerWithAccount)
      .input('MatnRespon', sql.NVarChar(500), req.body.MatnRespon)
      .input('NumberingCalc', sql.TinyInt, req.body.NumberingCalc)
      .input('HaveAccounting', sql.TinyInt, req.body.HaveAccounting)
      .input('TarhinApply', sql.Int, req.body.TarhinApply)
      .input('PriceTotal', sql.Numeric(18, 0), req.body.PriceNumberingCalc)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `تعهد با کد ${result.output.Code} ذخیره گردید`,
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    //return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function getResponWithCustomerUIData(req) {
  try {
    // var IdCustomer=req.privateData
    // const {systemCode}=req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetResponWithCustomerUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      cities: result.recordsets[0],
    };
  } catch (err) {
    //return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}



async function responWithCustomerInsert(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IDRespon)
      .input('IdCustomer', sql.Int, req.body.IDCustomer)
      .input('Sahm', sql.Decimal(3, 2), req.body.Sahm)
      .input('IdCityAddress', sql.Int, req.body.IDCityAddress)
      .input('Address', sql.NVarChar(200), req.body.Address)
      .input('PostalCode', sql.NVarChar(10), req.body.PostalCode)
      .input('EmergencyPhoneNo', sql.NVarChar(15), req.body.EmergencyPhoneNo)
      .input('Mobil', sql.NVarChar(20), req.body.Mobil)
      .input('Fax', sql.NVarChar(15), req.body.Fax)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(1000))
      .execute('Sale.sale.uspRelatResponWithCustomerInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: 'اطلاعات شریک ثبت گردید',
    };
  } catch (err) {
    //return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function responWithCustomerUpdate(req) {
  try {


    var clientIp = req.ip;
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IDRespon)
      .input('IdCustomer', sql.Int, req.body.IDCustomer)
      .input('Sahm', sql.Decimal(3, 2), req.body.Sahm)
      .input('IdCityAddress', sql.Int, req.body.IDCityAddress)
      .input('Address', sql.NVarChar(200), req.body.Address)
      .input('PostalCode', sql.NVarChar(10), req.body.PostalCode)
      .input('EmergencyPhoneNo', sql.NVarChar(15), req.body.EmergencyPhoneNo)
      .input('Mobil', sql.NVarChar(20), req.body.Mobil)
      .input('Fax', sql.NVarChar(15), req.body.Fax)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(1000))
      .execute('sale.uspRelatResponWithCustomerUpdate')
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
    //return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function responWithCustomerDelete(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IDRespon)
      .input('IdCustomer', sql.Int, req.body.IDCustomer)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(1000))
      .execute('Sale.sale.uspRelatResponWithCustomerDelete')
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
    //  return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function setForResponOwner(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(1000))
      .execute('Sale.sale.uspSetForResponOwner')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "خواندن موفق",
    };
  } catch (err) {
    //  return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }

}
async function setForResponNumbering(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(1000))
      .execute('Sale.sale.uspSetForResponNumbering')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "خواندن موفق",
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function setForResponPartner(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(1000))
      .execute('Sale.sale.uspSetForResponPartner')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "خواندن موفق",
    };
  } catch (err) {
    //  return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }.
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function setActiveCustomer(req) {
  try {
    // let obj = req.privateData;
    // let UserLogin=obj.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .output('msgRet', sql.NVarChar(1000))
      .execute('Sale.sale.uspSetActiveCustomer')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "خواندن موفق",
    };
  } catch (err) {
    //  return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function printRespon(req, res) {
  try {

    let UserLogin = req.privateData.UserLogin;
    const filepath = "..////api//download//" + UserLogin + "_.pdf";
    axios.post(`http://localhost:1259/api/Print/ResponPrint`, axiosConfig)
      .then(pdfdata => {

        var output = fs.createWriteStream(filepath);
        output.write(pdfdata.data,)

        //    output.end()
        // res.setHeader('Content-Length', stat.size);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename=filename.pdf');

        // const file = fs.createReadStream(filepath);
        // file.pipe(res);


        //    res(output); 
      });




  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
// const printLabels = async () => {
//     try {
//         let doc = await fs.createReadStream(path.join(__dirname, 'test.pdf'));
//         doc.pipe(fs.createWriteStream("Invoice_test_Labels.pdf"));
//         return path.join(__dirname, 'Invoice_test_Labels.pdf');
//     } catch (error) {
//         throw error;
//     }
// };
async function getTarhinPrintData(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('IdFactor', sql.Int, req.body.IdFactor)
      .input('UserId', sql.VarChar, UserLogin)
      .execute('Sale.sale.uspRepRahnPrint')
    // var registerInfo=result.recordsets[0][0];

    return {
      statusResult: 0,
      message: "خواندن موفق",
      shoraka: result.recordsets[0],
      respon: result.recordsets[1],
      vojooh: result.recordsets[2] ? result.recordsets[2] : [],
      sumVojooh: result.recordsets[3] ? result.recordsets[3][0] : '',
      sanadMalekiat: result.recordsets[4] ? result.recordsets[4] : [],

    };
  } catch (err) {
    console.log('err', err)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function transferSaleData(req) {
  try {
    //let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.dbo.SPResponTransToSalePAll')
    return {
      statusResult: 0,
      message: "انتقال با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);

    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function checkAllowPrintRespon(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('UserId', sql.VarChar, UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspCheckAllowPrintRespon')
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "چاپ بلا مانع است",

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }
  } catch (err) {
    console.log('err.message :>> ', err.message);

    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
//////////////////// استرداد تعهد 

async function getEsterdadResponList(req) {

  try {

    const { idrespon } = req.body.firstParams;
    let userFilter = 'idrespon=' + idrespon

    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VBaseEsterdad', '*', userFilter)
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
async function getEsterdadExtraData(req) {

  try {
    const { IDSaleProjects, IdEsterdad } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      //   .input("Code", sql.Int, Code)
      .input("IDSaleProjects", sql.Int, IDSaleProjects)
      .input("IdEsterdad", sql.Int, IdEsterdad)
      .execute('Sale.sale.uspGetEsterdadExtraData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      // idDueDeliver: result.recordsets[0],

      VHazineh: result.recordsets[0] ? result.recordsets[0][0] : [],
      EsterdadData: result.recordsets[1][0],
      Ellat: result.recordsets[2],
      IdEsterdadInfo: result.recordsets[3] ? result.recordsets[3][0] : [],
      LetterDateAndNumberInfo: result.recordsets[4] ? result.recordsets[4][0] : [],
      PayUsedEsterdadMande: result.recordsets[5] ? result.recordsets[5][0] : []
    };
  } catch (err) {
    console.log("err.message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
async function EsterdadResponInsert(req) {
  try {
    const { ID, IDRespon, OrderDate, Quantity, HazineDefault, Hazine, IdHazineBase, idRelatCustomerWithAccount, EsterdadDelay, MojavezSoudDirKard,
      LetterNo, LetterDate, LetterNoSoud, LetterDateSoud, LetterNoSoudDirkard, LetterDateSoudDirkard, ZaribSoud, ZaribSoudDirkard, CalcDate, MaxDaySoudEsterdad
      , TypeCalcDate, EllatId } = req.body;
    let spName = "Sale.sale.uspEsterdadResponInsert";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDRespon", sql.Int, IDRespon)
      .input("OrderDate", sql.VarChar(10), OrderDate)
      .input("Quantity", sql.Int, Quantity)
      .input("HazineDefault", sql.Int, HazineDefault)
      .input("Hazine", sql.Int, Hazine)
      .input("IdHazineBase", sql.Int, IdHazineBase)
      .input("idRelatCustomerWithAccount", sql.Int, idRelatCustomerWithAccount)
      .input("EsterdadDelay", sql.Int, EsterdadDelay)
      .input("MojavezSoudDirKard", sql.TinyInt, MojavezSoudDirKard)
      .input("LetterNo", sql.NVarChar(15), LetterNo)
      .input("LetterDate", sql.VarChar(10), LetterDate)
      .input("LetterNoSoud", sql.NVarChar(15), LetterNoSoud)
      .input("LetterDateSoud", sql.VarChar(10), LetterDateSoud)
      .input("LetterNoSoudDirkard", sql.NVarChar(15), LetterNoSoudDirkard)
      .input("LetterDateSoudDirkard", sql.VarChar(10), LetterDateSoudDirkard)
      .input("ZaribSoud", sql.Float, ZaribSoud)
      .input("ZaribSoudDirkard", sql.Float, ZaribSoudDirkard)
      .input("CalcDate", sql.VarChar(10), CalcDate)
      .input("MaxDaySoudEsterdad", sql.Int, MaxDaySoudEsterdad)
      .input("TypeCalcDate", sql.TinyInt, TypeCalcDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("EllatId", sql.Int, EllatId)
      .input("ComputerName", sql.VarChar(50), clientIp)
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

async function EsterdadResponUpdate(req) {
  try {
    const { ID, IDRespon, OrderDate, Quantity, HazineDefault, Hazine, IdHazineBase, idRelatCustomerWithAccount, EsterdadDelay, MojavezSoudDirKard,
      LetterNo, LetterDate, LetterNoSoud, LetterDateSoud, LetterNoSoudDirkard, LetterDateSoudDirkard, ZaribSoud, ZaribSoudDirkard, CalcDate, MaxDaySoudEsterdad
      , TypeCalcDate, EllatId } = req.body;
    let spName = "Sale.sale.uspEsterdadResponUpdate";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDRespon", sql.Int, IDRespon)
      .input("OrderDate", sql.VarChar(10), OrderDate)
      .input("Quantity", sql.Int, Quantity)
      .input("HazineDefault", sql.Int, HazineDefault)
      .input("Hazine", sql.Int, Hazine)
      .input("IdHazineBase", sql.Int, IdHazineBase)
      .input("idRelatCustomerWithAccount", sql.Int, idRelatCustomerWithAccount)
      .input("EsterdadDelay", sql.Int, EsterdadDelay)
      .input("MojavezSoudDirKard", sql.TinyInt, MojavezSoudDirKard)
      .input("LetterNo", sql.NVarChar(15), LetterNo)
      .input("LetterDate", sql.VarChar(10), LetterDate)
      .input("LetterNoSoud", sql.NVarChar(15), LetterNoSoud)
      .input("LetterDateSoud", sql.VarChar(10), LetterDateSoud)
      .input("LetterNoSoudDirkard", sql.NVarChar(15), LetterNoSoudDirkard)
      .input("LetterDateSoudDirkard", sql.VarChar(10), LetterDateSoudDirkard)
      .input("ZaribSoud", sql.Float, ZaribSoud)
      .input("ZaribSoudDirkard", sql.Float, ZaribSoudDirkard)
      .input("CalcDate", sql.VarChar(10), CalcDate)
      .input("MaxDaySoudEsterdad", sql.Int, MaxDaySoudEsterdad)
      .input("TypeCalcDate", sql.TinyInt, TypeCalcDate)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("EllatId", sql.Int, EllatId)
      .input("ComputerName", sql.VarChar(50), clientIp)
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
async function EsterdadResponDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "Sale.sale.uspEsterdadResponDelete";
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("UserID", sql.VarChar(10), UserLogin)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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

async function getMablaghEsterdadExtra(req) {

  try {
    const { IdRespon } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      //   .input("Code", sql.Int, Code)
      .input("IdRespon", sql.Int, IdRespon)
      .execute('Sale.sale.uspGetMablaghEsterdadExtra')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      // idDueDeliver: result.recordsets[0],

      Moarefi: result.recordsets[0] ? result.recordsets[0][0] : [],
      ResponWithPayment: result.recordsets[1] ? result.recordsets[1][0] : [],

    };
  } catch (err) {
    console.log("err.message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}

async function getEsterdadMablaghList(req, res) {
  try {

    const { IDRespon } = req.body.firstParams;
    let userFilter = 'IDRespon=' + IDRespon

    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VMandeRelatResponWithPayment', '*', userFilter)
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
async function getPayUsedEsterdadList(req, res) {
  try {

    const { IDEsterdad } = req.body.firstParams;
    let userFilter = 'IDEsterdad=' + [IDEsterdad]

    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VResponPayUsedEsterdad', '*', userFilter)
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
async function PayUsedEsterdadKoliInsert(req) {
  try {
    const { ID, IDRespon, IDEsterdad, IDRelatResponWithPayment } = req.body;
    console.log("req.body ==>" , req.body)
    let spName = "Sale.sale.uspPayUsedEsterdadKoliInsert";
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      // .input("ID", sql.Int, ID)
      .input("IDRespon", sql.Int, IDRespon)
      .input("IDEsterdad", sql.Int, IDEsterdad)
      .input("IDRelatResponWithPayment", sql.Int, IDRelatResponWithPayment)
      .input("UserID", sql.VarChar(10), UserLogin)
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
async function PayUsedEsterdadInsert(req) {
  try {
    const { ID, IDRelatResponWithPayment, IDEsterdad, EffectiveDate, Amount } = req.body;
    let spName = "Sale.sale.uspPayUsedEsterdadInsert";
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDRelatResponWithPayment", sql.Int, IDRelatResponWithPayment)
      .input("IDEsterdad", sql.Int, IDEsterdad)
      .input("EffectiveDate", sql.VarChar(10), EffectiveDate)
      .input("Amount", sql.Numeric(18, 0), Amount)
      .input("UserID", sql.VarChar(10), UserLogin)
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
    console.log("err.message ==>PayUsedEsterdadInsert ", err.message)
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };

  }
}
async function PayUsedEsterdadDelete(req) {
  try {
    const { ID } = req.body;
    let spName = "Sale.sale.uspPayUsedEsterdadDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function EsterdadResponErsalMali(req) {
  try {
    const { ID } = req.body;
    let spName = "Sale.sale.uspEsterdadResponErsalMaliUpdate";

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ارسال به مالی با موفقیت انجام شد",

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
async function getEsterdadPrintData(req) {

  try {
    const { ID, CalcDate } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("IdEsterdad", sql.Int, ID)
      .execute('Sale.sale.uspGetEsterdadPrintData')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      PayUsedEsterdadMande: result.recordsets[0] ? result.recordsets[0] : [],
      ExtraEsterdadData: result.recordsets[1] ? result.recordsets[1][0] : [],

    };
  } catch (err) {
    console.log("err.message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}

async function getEsterdadReportList(req, res) {
  try {

    let userFilter = `OrderDate >= '1403/01/01'`
    //var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VEsterdad', '*', userFilter)

    let UserLogin = req.privateData.UserLogin;
    var Agencyfilter = '';
    if (UserLogin.toLowerCase().startsWith('ikd'))
      Agencyfilter = ` IDAgencyCommission in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VEsterdad', '*', userFilter, Agencyfilter)


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
////////////////////

async function getResponPassedAllCheck(req, res) {
  try {

    let userFilter = ''

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwResponPassedAllCheck', '*', userFilter)
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
async function ConfirmCustomerAccountEsterdad(req) {
  try {
    const { ID, idRelatCustomerWithAccount } = req.body;
    let spName = "Sale.sale.uspConfirmCustomerAccountEsterdad";

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("idRelatCustomerWithAccount", sql.Int, idRelatCustomerWithAccount)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


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
//////////////////// تایید و برگشت از تایید تعهد 


async function responChangeState(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { IdRespon, Flag } = req.body;


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, IdRespon)
      .input('Flag', sql.TinyInt, Flag)
      .input('UserCode', sql.VarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponChangeState')

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
//////////////////////////////////
///////////////////////////////// تغییرات نوع در تعهد
async function getResponChangeUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponChangeUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        HazineChangeModel: result.recordsets[0] ? result.recordsets[0] : [],
        responMember: result.recordsets[1] ? result.recordsets[1][0] : [],

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

async function getResponChangeList(req) {

  try {

    const { IDRespon, SelectType } = req.body.firstParams;
    let userFilter = 'IDRespon=' + IDRespon
    let viewName = ''
    if (SelectType == 1) viewName = 'dbo.VBaseChangeModel'
    else viewName = 'dbo.VBaseChange'

    var query = SqlCommandCreator(req.body.lazyParams, viewName, '*', userFilter)
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


async function getPaymentChangeModel(req) {

  try {

    const { idrespon } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VPaymentMandePartnres", "*", `idrespon =${idrespon} and MandePayment>0 and active=1`);
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
async function getPaymentUsedChangeModel(req) {

  try {

    const { IDChangeModel } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VPaymentUsedChangeModel  ", "*", `IDChangeModel =${IDChangeModel}`);
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

async function getModelCodePickList(req) {
  try {

    var myQuery = ''
    const { IdRespon } = req.body.firstParams;
    myQuery = SqlCommandCreator(req.body.lazyParams, `Sale.sale.udfgetModelCodePickList(${IdRespon})`, '*', req.body.firstFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request().query(myQuery)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {

    return err
  }
}
async function responChangeModelInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, req.body.Id)
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('ChangeType', sql.Int, req.body.ChangeType)
      .input('Code', sql.Int, 0)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('CodeNextModel', sql.VarChar(6), req.body.ModelCode)
      .input('IDNextDueDeliverProg', sql.Int, req.body.IDNextDueDeliverProg)
      .input('IDNextUsage', sql.Int, req.body.IDNextUsage)
      .input('IDNextColor', sql.Int, req.body.IDNextColor)
      .input('LetterNo', sql.VarChar(15), req.body.LetterNo)
      .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
      .input('HazineDefault', sql.Numeric(18, 0), req.body.HazineDefault)
      .input('Hazine', sql.Numeric(18, 0), req.body.Hazine)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("ComputerName", sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspChangeModelInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",

    };
  } catch (err) {
    console.log('err.message===>', err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function responChangeModelDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { ID } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspChangeModelDelete');


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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

async function getResponChangeHazineh(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('ChangeType', sql.Int, req.body.ChangeType)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponChangeHazineh')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      HazineChangeModel: result.recordsets[0] ? result.recordsets[0][0] : [],


    };
  } catch (err) {
    console.log("err.message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function getResponChangeNameUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('FormType', sql.Int, req.body.FormType)
      .input('IdMasterRename', sql.Int, req.body.IdMasterRename)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponChangeNameUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        HazineChangeModel: result.recordsets[0] ? result.recordsets[0] : [],
        masterRename: result.recordsets[1] ? result.recordsets[1][0] : [],

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

async function paymentUsedChangeModelInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, req.body.ID)
      .input('IDPayment', sql.Int, req.body.IDPayment)
      .input('IDChangeModel', sql.Int, req.body.IDChangeModel)
      .input('Amount', sql.Numeric(18, 0), req.body.Mablagh)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("ComputerName", sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspPaymentUsedChangeModelInsert')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ثبت اطلاعات با موفقیت انجام شد",

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
async function paymentUsedChangeModelDelete(req) {
  try {
    const { ID } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    let spName = "Sale.sale.uspPaymentUsedChangeModelDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("ComputerName", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function ResponChangeModelErsalMali(req) {
  try {
    const { ID } = req.body;
    let spName = "Sale.sale.uspResponChangeModelErsalMaliUpdate";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("ComputerName", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ارسال به مالی با موفقیت انجام شد",

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

async function getVDetailRename(req) {

  try {
    const { ID } = req.body.firstParams;
    let userFilter = `IDMasterReName=${ID}`
    var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VDetailRename', '*', userFilter)
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

async function responMasterReNameInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()



      .input('ID', sql.Int, 0)
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('IDRequester', sql.Int, req.body.IDRequester)
      .input('IDHazineBase', sql.Int, req.body.IDHazineBase)
      .input('Amount', sql.Numeric, req.body.Amount)
      .input('KarmozdCheq', sql.Numeric, req.body.KarmozdCheq)
      .input('HazineDefault', sql.Numeric, req.body.HazineDefault)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('Type', sql.Int, req.body.ChangeType)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('LetterNo', sql.NVarChar(15), req.body.LetterNo)
      .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
      .input('idFactor', sql.Int, req.body.idFactor)
      .input('idPayment', sql.Int, req.body.idPayment)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspMasterReNameInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function responMasterReNameUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()



      .input('ID', sql.Int, req.body.ID)
      .input('IDRespon', sql.Int, req.body.IDRespon)
      .input('IDRequester', sql.Int, req.body.IDRequester)
      .input('IDHazineBase', sql.Int, req.body.IDHazineBase)
      .input('Amount', sql.Numeric, req.body.Amount)
      .input('KarmozdCheq', sql.Numeric, req.body.KarmozdCheq)
      .input('HazineDefault', sql.Numeric, req.body.HazineDefault)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('Type', sql.Int, req.body.ChangeType)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('LetterNo', sql.NVarChar(15), req.body.LetterNo)
      .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
      .input('idFactor', sql.Int, req.body.idFactor)
      .input('idPayment', sql.Int, req.body.idPayment)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspMasterReNameUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function responMasterReNameDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { ID } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponMasterReNameDelete');


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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

async function getResponChangeNameHazineh(req) {
  try {


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('ChangeType', sql.Int, req.body.ChangeType)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponChangeNameHazineh')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      HazineChangeModel: result.recordsets[0] ? result.recordsets[0][0] : [],


    };
  } catch (err) {
    console.log("err.message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getPaymentChangeName(req) {

  try {

    const { IDCustomer } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VMandePayment", "*", `IDCustomer =${IDCustomer} and MandePayment>0 and IDTypePayment not in(9, 10, 11) and
          IDCustomer not in(select idCustomer from TLenders)`);

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
async function getPaymentUsedChangeName(req) {

  try {

    const { IDReName } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VPaymentUsedChangeRename  ", "*", `IDReName =${IDReName}`);
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

async function paymentUsedChangeNameInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, 0)
      .input('IDPayment', sql.Int, req.body.IDPayment)
      .input('IDReName', sql.Int, req.body.IDReName)
      .input('Amount', sql.Numeric(18, 0), req.body.Mablagh)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspPaymentUsedNameInsert')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ثبت اطلاعات با موفقیت انجام شد",

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
async function paymentUsedChangeNameDelete(req) {
  try {
    const { ID } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    let spName = "Sale.sale.uspPaymentUsedChangeNameDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function responChangeDetailRenameInsert(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdN', sql.Int, req.body.IdN)
      .input('IDMasterReName', sql.Int, req.body.IDMasterReName)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .input('Sahm', sql.Float, req.body.Sahm)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspDetailReNameInsert')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ثبت اطلاعات با موفقیت انجام شد",

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

async function responChangeDetailRenameUpdate(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdN', sql.Int, req.body.IdN)
      .input('IDMasterReName', sql.Int, req.body.IDMasterReName)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .input('Sahm', sql.Float, req.body.Sahm)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspDetailReNameUpdate')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

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

async function responChangeDetailRenameDelete(req) {
  try {
    const { IdN } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    let spName = "Sale.sale.uspDetailReNameDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IdN", sql.Int, IdN)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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

async function responTaeenOwnerReName(req) {
  try {


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDMasterReName', sql.Int, req.body.IDMasterReName)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponTaeenOwnerReName')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "تغییر اطلاعات با موفقیت انجام شد",

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
async function responTaeenPartnerReName(req) {
  try {


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDMasterReName', sql.Int, req.body.IDMasterReName)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponTaeenPartnerReName')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "تغییر اطلاعات با موفقیت انجام شد",

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
async function responTaeenNumberingReName(req) {
  try {


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDMasterReName', sql.Int, req.body.IDMasterReName)
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponTaeenNumberingReName')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "تغییر اطلاعات با موفقیت انجام شد",

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

async function ResponChangeNameErsalMali(req) {
  try {
    const { ID, IDRespon, ChangeType } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    let spName = "Sale.sale.uspResponChangeNameErsalMaliUpdate";

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("IDRespon", sql.Int, IDRespon)
      .input("ChangeType", sql.Int, ChangeType)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ارسال به مالی با موفقیت انجام شد",

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
async function getChangeNamePrintUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('IdMasterRename', sql.Int, req.body.IdMasterRename)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspChangeNamePrintUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        masterRename: result.recordsets[0] ? result.recordsets[0] : [],
        paymentUsedChangerename: result.recordsets[1] ? result.recordsets[1] : [],
        relatResponWithCustomer: result.recordsets[2] ? result.recordsets[2] : [],
        detailRename: result.recordsets[3] ? result.recordsets[3] : [],
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
async function getChangeModelPrintUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('IDChangeModel', sql.Int, req.body.IDChangeModel)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspChangeModelPrintUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        VBaseChangeModel: result.recordsets[0] ? result.recordsets[0] : [],
        VPaymentUsedChangeModel: result.recordsets[1] ? result.recordsets[1] : [],

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
//////////////////////////////////////////////////////////////

async function getImportResponListError(req, res) {
  try {


    const { ImportType } = req.body.firstParams;
    let userFilter = 'ImportType=' + [ImportType]

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vwImportResponListError', '*', userFilter)
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

async function getDefaultResponWithCustomer(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspGetDefaultResponWithCustomer')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      customer: result.recordsets[0] ? result.recordsets[0][0] : [],

    };
  } catch (err) {
    console.log("err.message", err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

//////////////////// ضمانت قرارداد

async function getTazminRespon(req) {

  try {

    const { idrespon } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VRelatTypeTazaminWithRespon", "*", `idrespon=${idrespon}`);
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

async function getTazminResponExtraData(req) {

  try {
    const { idrespon, formType, ClassTazmin } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("idrespon", sql.Int, idrespon)
      .input("formType", sql.Int, formType)
      .input("idClassTazamin", sql.Int, ClassTazmin)
      .execute('Sale.sale.uspGetTazminResponExtraData')
    return {
      statusResult: 0,
      message: "خواندن موفق",


      CheckStatus: result.recordsets[0] ? result.recordsets[0][0] : [],
      ClassTazamin: result.recordsets[1] ? result.recordsets[1] : [],
      TypeTazamin: result.recordsets[2] ? result.recordsets[2] : []
    };
  } catch (err) {
    console.log("err.message", err.message)

    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
async function getTypeTazminList(req) {

  try {
    var myQuery = `select idTypeTazamin as [value] , Title as [label] from VTypeTazamin where idClassTazamin=${req.body.idClassTazamin}`
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
    }
  } catch (err) {
    console.log("err:", err.message)
    return err
  }
}
async function GetMandePaymentZemanat(req) {

  try {
    const { idCustomer, TypeTazamin, ClassTazmin } = req.body.firstParams;
    let IDTypePayment = 0
    if (ClassTazmin == 2) {
      if (TypeTazamin == 5) IDTypePayment = 10
      else if (TypeTazamin == 6) IDTypePayment = 5
      else IDTypePayment = 14
    }

    let userFilter = `IDCustomer=${idCustomer} and IDTypePayment=${IDTypePayment} and  MandePayment>0`
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VMandePayment', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log('errerrerrerr', err.message)
    return err
  }
}

async function GetMahzarList(req) {

  try {
    let userFilter = ''
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VMahzar', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log('errerrerrerr', err.message)
    return err
  }
}
async function RelatTypeTazaminWithResponInsert(req) {
  try {
    const { idRelatTypeTazaminWithRespon, ClassTazamin, TypeTazamin, idRespon, idCustomer, idpayment, Amount, DocumentNo, DocumentDate, DocumentExpireDate,
      idMahzar } = req.body;

    let spName = "Sale.sale.uspRelatTypeTazaminWithResponInsert";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idRelatTypeTazaminWithRespon", sql.Int, idRelatTypeTazaminWithRespon)
      .input("idClassTazmin", sql.Int, ClassTazamin)
      .input("idTypeTazamin", sql.Int, TypeTazamin)
      .input("idRespon", sql.Int, idRespon)
      .input("idCustomer", sql.Int, idCustomer ? idCustomer : 0)
      .input("idpayment", sql.Int, idpayment ? idpayment : 0)
      .input("Amount", sql.Numeric(18, 0), Amount ? Amount : 0)
      .input("DocumentNo", sql.VarChar(20), DocumentNo ? DocumentNo : '')
      .input("DocumentDate", sql.VarChar(10), DocumentDate ? DocumentDate : '')
      .input("DocumentExpireDate", sql.VarChar(10), DocumentExpireDate ? DocumentExpireDate : '')
      .input("idMahzar", sql.VarChar(30), idMahzar ? idMahzar : 0)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
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
async function RelatTypeTazaminWithResponUpdate(req) {
  try {

    const { idRelatTypeTazaminWithRespon, ClassTazamin, TypeTazamin, idRespon, idCustomer, idpayment, Amount, DocumentNo, DocumentDate, DocumentExpireDate,
      idMahzar } = req.body;


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("idRelatTypeTazaminWithRespon", sql.Int, idRelatTypeTazaminWithRespon)
      .input("idClassTazmin", sql.Int, ClassTazamin)
      .input("idTypeTazamin", sql.Int, TypeTazamin)
      .input("idRespon", sql.Int, idRespon)
      .input("idCustomer", sql.Int, idCustomer ? idCustomer : 0)
      .input("idpayment", sql.Int, idpayment ? idpayment : 0)
      .input("Amount", sql.Numeric(18, 0), Amount ? Amount : 0)
      .input("DocumentNo", sql.VarChar(20), DocumentNo ? DocumentNo : '')
      .input("DocumentDate", sql.VarChar(10), DocumentDate ? DocumentDate : '')
      .input("DocumentExpireDate", sql.VarChar(10), DocumentExpireDate ? DocumentExpireDate : '')
      .input("idMahzar", sql.VarChar(30), idMahzar ? idMahzar : 0)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspRelatTypeTazaminWithResponUpdate')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ویرایش اطلاعات با موفقیت انجام شد",

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
async function RelatTypeTazaminWithResponDelete(req) {
  try {
    const { idRelatTypeTazaminWithRespon } = req.body;
    let spName = "Sale.sale.uspRelatTypeTazaminWithResponDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idRelatTypeTazaminWithRespon", sql.Int, idRelatTypeTazaminWithRespon)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function getFactorTazamin(req) {

  try {

    const { idRespon } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VFactorTazamin", "*", `idRespon=${idRespon}`);
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
async function GetResponFactorList(req) {

  try {
    const { idRespon } = req.body.firstParams;
    let userFilter = `idRespon=${idRespon}`
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.TFactor', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log('errerrerrerr', err.message)
    return err
  }
}


async function FactorTazaminInsert(req) {
  try {
    const { idFactorTazamin, idRespon, idFactor, FactorNo, TarhinNo, TarhinDate, Flag, Taeed } = req.body;

    let spName = "Sale.sale.uspTFactorTazaminInsert";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idFactorTazamin", sql.Int, idFactorTazamin)
      .input("idRespon", sql.Int, idRespon)
      .input("idFactor", sql.Int, idFactor)
      .input("FactorNo", sql.VarChar(10), FactorNo)
      .input("TarhinNo", sql.VarChar(15), TarhinNo)
      .input("TarhinDate", sql.VarChar(10), TarhinDate)
      .input("Flag", sql.Int, Flag)
      .input("Taeed", sql.Int, Taeed)
      .input("Userid", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
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
async function FactorTazaminUpdate(req) {
  try {
    const { idFactorTazamin, idRespon, idFactor, FactorNo, TarhinNo, TarhinDate, Flag, Taeed } = req.body;

    let spName = "Sale.sale.uspTFactorTazaminUpdate";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idFactorTazamin", sql.Int, idFactorTazamin)
      .input("idRespon", sql.Int, idRespon)
      .input("idFactor", sql.Int, idFactor)
      .input("FactorNo", sql.VarChar(10), FactorNo)
      .input("TarhinNo", sql.VarChar(15), TarhinNo)
      .input("TarhinDate", sql.VarChar(10), TarhinDate)
      .input("Flag", sql.Int, Flag)
      .input("Taeed", sql.Int, Taeed)
      .input("Userid", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
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
async function FactorTazaminEbtalOdat(req) {
  try {
    const { idFactorTazamin, action } = req.body;

    let spName = "Sale.sale.uspTFactorTazaminEbtalOdat";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idFactorTazamin", sql.Int, idFactorTazamin)
      .input("action", sql.Int, action)
      .input("Userid", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ثبت اطلاعات با موفقیت انجام شد",

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
async function getChangesResponList(req, res) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var Agencyfilter = '';
    if (UserLogin.toLowerCase().startsWith('ikd'))
      Agencyfilter = ` IDAgencyCommission in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`
    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VChangeAll', '*', req.body.firstFilter, Agencyfilter)

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
//////////////////////// انتقال تعهد به شرکت دیگر 

async function getTrans2otherCompanyList(req) {

  try {


    let userFilter = ''
    var query = SqlCommandCreator(req.body.lazyParams, 'VOrderTrans2OtherCompany', '*', req.body.firstFilter)
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
async function getFactorSubHazineOtherCompanyList(req) {

  try {
    const { idOrderTrans2OtherCompany } = req.body.firstParams;
    let userFilter = `idOrderTrans2OtherCompany=${idOrderTrans2OtherCompany}`
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VFactorSubHazineOtherCompany', '*', userFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)


    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log('errerrerrerr', err.message)
    return err
  }

}
async function getMandePayUsedTrans2OtherCompany(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idOrderTrans2OtherCompany', sql.Int, req.body.idOrderTrans2OtherCompany)
      .input('idRespon', sql.Int, req.body.idRespon)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspMandePayUsedTrans2OtherCompany')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        ShowMande: result.recordsets[0] ? result.recordsets[0][0] : [],
        SumAmount: result.recordsets[1] ? result.recordsets[1][0] : [],
        MandeRespon: result.recordsets[2] ? result.recordsets[2][0] : [],
        AmountAndSoud: result.recordsets[3] ? result.recordsets[3][0] : [],

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
async function getResponPickList(req) {

  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VRespon', '*', req.body.firstFilter)
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
async function getFactorPickList(req) {

  let userFilter = `FactorDate >= '1404/01/01' and flag in (1,2)`

  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VFactor', '*', userFilter)
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

async function orderTrans2OtherCompanyInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()


      .input('ID', sql.Int, 0)
      .input('idCompany', sql.Int, req.body.idCompany)
      .input('KindTrans', sql.Int, req.body.KindTrans)
      .input('idFactor', sql.Int, req.body.idFactor)
      .input('idRespon', sql.Int, req.body.idRespon)
      .input('ShasiNo', sql.VarChar(20), req.body.ShasiNo)
      .input('MotorNo', sql.VarChar(20), req.body.MotorNo)
      .input('BodyNo', sql.VarChar(20), req.body.BodyNo)
      .input('TahvilDate', sql.VarChar(10), req.body.TahvilDate)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('LetterNo', sql.VarChar(15), req.body.LetterNo)
      .input('BasePrice', sql.Numeric(18, 0), req.body.BasePrice)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspTOrderTrans2OtherCompanyInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function orderTrans2OtherCompanyUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('ID', sql.Int, req.body.id)
      .input('idCompany', sql.Int, req.body.idCompany)
      .input('KindTrans', sql.Int, req.body.KindTrans)
      .input('idFactor', sql.Int, req.body.idFactor)
      .input('idRespon', sql.Int, req.body.idRespon)
      .input('ShasiNo', sql.VarChar(20), req.body.ShasiNo)
      .input('MotorNo', sql.VarChar(20), req.body.MotorNo)
      .input('BodyNo', sql.VarChar(20), req.body.BodyNo)
      .input('TahvilDate', sql.VarChar(10), req.body.TahvilDate)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('LetterNo', sql.VarChar(15), req.body.LetterNo)
      .input('BasePrice', sql.Numeric(18, 0), req.body.BasePrice)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspTOrderTrans2OtherCompanyUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function orderTrans2OtherCompanyDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { ID } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspOrderTrans2OtherCompanyDelete');


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function getPaymentTrans2otherCompany(req) {

  try {

    const { IDRespon } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VMandeRelatResponWithPayment", "*", `IDRespon =${IDRespon} and MandeResponOk<>0`);
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
async function getPaymentUsedTrans2OtherCompany(req) {

  try {

    const { IDOrderTrans2OtherCompany } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VResponPayUsedTrans2OtherCompany  ", "*", `IDOrderTrans2OtherCompany =${IDOrderTrans2OtherCompany}`);
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

async function responPayUsedTrans2OtherCompanyInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idOrderTrans2OtherCompany', sql.Int, req.body.idOrderTrans2OtherCompany)
      .input('idRelatResponWithPayment', sql.Int, req.body.idRelatResponWithPayment)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('Amount', sql.Numeric(18, 0), req.body.Amount)
      .input('Soud', sql.Numeric(18, 0), req.body.Soud)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponPayUsedTrans2OtherCompanyInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getSoudTrans2otherCompany(req) {


  try {
    const { idOrderTrans2OtherCompany, idPayment, OrderDate, AmountPrice, FlagDelay } = req.body;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idOrderTrans2OtherCompany", sql.Int, idOrderTrans2OtherCompany)
      .input("idPayment", sql.Int, idPayment)
      .input("OrderDate", sql.VarChar(10), OrderDate)
      .input("AmountPrice", sql.Numeric(18, 0), AmountPrice)
      .input("FlagDelay", sql.Int, FlagDelay)
      .output("msgRet", sql.NVarChar(200))
      .execute("Sale.sale.spGetSoudTrans2otherCompany");


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        SoudAndAmount: result.recordsets[0] ? result.recordsets[0][0] : [],

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

async function responPayUsedTrans2OtherCompanyDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { idOrderTrans2OtherCompany, idResponPayUsedTrans2OtherCompany } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idOrderTrans2OtherCompany", sql.Int, idOrderTrans2OtherCompany)
      .input("idResponPayUsedTrans2OtherCompany", sql.Int, idResponPayUsedTrans2OtherCompany)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponPayUsedTrans2OtherCompanyDelete');


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function orderTrans2OtherCompanyErsalMali(req) {
  try {
    const { ID, State } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;



    let spName = "Sale.sale.uspOrderTrans2OtherCompanyErsalMali";

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("State", sql.Int, State)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ارسال به مالی با موفقیت انجام شد",

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
async function getTrans2otherCompanyPrintUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idOrderTrans2OtherCompany', sql.Int, req.body.idOrderTrans2OtherCompany)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspTrans2otherCompanyPrintUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        OrderTrans2OtherCompany: result.recordsets[0] ? result.recordsets[0] : [],
        ResponPayUsedTrans2OtherCompany: result.recordsets[1] ? result.recordsets[1] : [],

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
/////////////////////// برداشت وجه از تعهد

async function getResponPaymentBardashtVajhList(req) {

  try {

    const { State } = req.body.firstParams;
    let userFilter = ''
    if (State == 2) // برداشت وجه از تعهد
      userFilter = 'idResponReciever=0'
    else //  انتقال وجه از تعهد به تعهد  دیگر
      userFilter = 'idResponReciever<>0'

    userFilter += ' and flag<2'

    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VOrderResponTrans2OtherRespon  ", '*', userFilter)
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

async function getResponBardashtVajhUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetResponBardashtVajhUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      typeSoud: result.recordsets[0] ? result.recordsets[0] : [],
      typeUsagePayment: result.recordsets[1] ? result.recordsets[1] : [],

    };
  } catch (err) {
    console.log("err,message", err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function getResponSoud(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idRespon', sql.Int, req.body.idRespon)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspGetResponSoud')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        resultTest: result.recordsets[0] ? result.recordsets[0][0] : [],

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
async function orderResponTrans2OtherResponInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idOrder', sql.Int, 0)
      .input('TypeTrans', sql.Int, req.body.TypeTrans)
      .input('IDResponSender', sql.Int, req.body.IDResponSender)
      .input('IDResponReciever', sql.Int, req.body.IDResponReciever)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('Mablagh', sql.Numeric(18, 0), req.body.Mablagh)
      .input('TypeSoud', sql.TinyInt, req.body.TypeSoud)
      .input('CalculateDate', sql.VarChar(10), req.body.CalculateDate)
      .input('idUsagePaymentSoud', sql.Int, req.body.idUsagePaymentSoud)
      .input('MojavezSoudDirKard', sql.Int, req.body.MojavezSoudDirKard)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspOrderResponTrans2OtherResponInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function orderResponTrans2OtherResponUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idOrder', sql.Int, req.body.idOrder)
      .input('TypeTrans', sql.Int, req.body.TypeTrans)
      .input('IDResponSender', sql.Int, req.body.IDResponSender)
      .input('IDResponReciever', sql.Int, req.body.IDResponReciever)
      .input('OrderDate', sql.VarChar(10), req.body.OrderDate)
      .input('Mablagh', sql.Numeric(18, 0), req.body.Mablagh)
      .input('TypeSoud', sql.TinyInt, req.body.TypeSoud)
      .input('CalculateDate', sql.VarChar(10), req.body.CalculateDate)
      .input('idUsagePaymentSoud', sql.Int, req.body.idUsagePaymentSoud)
      .input('MojavezSoudDirKard', sql.Int, req.body.MojavezSoudDirKard)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspOrderResponTrans2OtherResponUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function orderResponTrans2OtherResponDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { IdOrderResponTrans2OtherRespon } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("IdOrderResponTrans2OtherRespon", sql.Int, IdOrderResponTrans2OtherRespon)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspOrderResponTrans2OtherResponDelete');

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function orderResponTrans2OtherResponErsalMali(req) {
  try {
    const { idOrder } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;



    let spName = "Sale.sale.uspOrderResponTrans2OtherResponErsalMali";

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idOrder", sql.Int, idOrder)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ارسال به مالی با موفقیت انجام شد",

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
async function getPaymentResponBardashtVajh(req) {

  try {

    const { IDRespon } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VMandeRelatResponWithPayment", "*", `IDRespon =${IDRespon}  and idTypePayment not in(9)
   and MandeRespon>0`);


  
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
async function getPaymentUsedTrans2OtherRespon(req) {

  try {

    const { idOrder } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VResponAmountTrans2OtherRespon  ", "*", `idOrderResponTrans2OtherRespon =${idOrder}`);
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

async function getSoudResponTrans2OtherRespon(req) {


  try {
    const { idOrder, IdRelatePayment, TypeSoud, OrderDate, Mablagh } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idOrder", sql.Int, idOrder)
      .input("IdRelatePayment", sql.Int, IdRelatePayment)
      .input("TypeSoud", sql.Int, TypeSoud)
      .input("OrderDate", sql.VarChar(10), OrderDate)
      .input("Mablagh", sql.Numeric(18, 0), Mablagh)
      .output("msgRet", sql.NVarChar(200))
      .execute("Sale.sale.uspGetSoudResponTrans2OtherRespon");


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        SoudAndSoudDirKard: result.recordsets[0] ? result.recordsets[0][0] : [],

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
async function responPayUsedTrans2OtherResponInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idOrder', sql.Int, req.body.idOrder)
      .input('IdRelatePayment', sql.Int, req.body.IdRelatePayment)
      .input('Mablagh', sql.Numeric(18, 0), req.body.Mablagh)
      .input('IDUsagePaymentAmount', sql.Int, req.body.IDUsagePaymentAmount)
      .input('Soud', sql.Numeric(18, 0), req.body.Soud)
      .input('SoudDirKard', sql.Numeric(18, 0), req.body.SoudDirKard)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponPayUsedTrans2OtherResponInsert')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function paymentUsedTrans2OtherResponDelete(req) {
  try {
    const { idOrder, IdRelate } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    let spName = "Sale.sale.uspPaymentUsedTrans2OtherResponDelete";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idOrder", sql.Int, idOrder)
      .input("IdRelate", sql.Int, IdRelate)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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
async function getTrans2OtherResponPrintUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idOrder', sql.Int, req.body.idOrder)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspTrans2OtherResponPrintUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        OrderResponTrans2OtherRespon: result.recordsets[0] ? result.recordsets[0][0] : [],
        paymentUsedTrans2OtherRespon: result.recordsets[1] ? result.recordsets[1] : [],
        
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
////////////////////// اخطار تعهد

async function getResponEkhtarList(req) {

  try {

    const { idRespon } = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VResponEkhtar", "*", `idRespon=${idRespon}`);
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

async function getResponEkhtarUIData(req) {

  try {
    
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('sale.uspGetResponEkhtarUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      ekhtarSubject: result.recordsets[0],
      typeConnection: result.recordsets[1],
    };
  } catch (err) {
    console.log("err,message", err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
async function responEkhtarInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idResponEkhtar', sql.Int, req.body.idResponEkhtar)
      .input('idRespon', sql.Int, req.body.idRespon)
      .input('idTypeConnection', sql.Int, req.body.idTypeConnection)
      .input('EkhtarDate', sql.VarChar(10), req.body.EkhtarDate)
      .input('idEkhtarSubject', sql.Int, req.body.idEkhtarSubject)
      .input('EkhtarTime', sql.VarChar(5), req.body.EkhtarTime)
      .input('PhoneNo', sql.VarChar(15), req.body.PhoneNo)
      .input('LetterNo', sql.VarChar(20), req.body.LetterNo)
      .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
      .input('SessionPlace', sql.NVarChar(40), req.body.SessionPlace)
      .input('DeadLineDate', sql.VarChar(10), req.body.DeadLineDate)
      .input('TafahomDate', sql.VarChar(10), req.body.TafahomDate)
      .input('Description', sql.NVarChar(250), req.body.Description)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponEkhtarInsert')
    if (result.output.msgRet != "") {
      return {
        
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function ResponEkhtarUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idResponEkhtar', sql.Int, req.body.idResponEkhtar)
      .input('idRespon', sql.Int, req.body.idRespon)
      .input('idTypeConnection', sql.Int, req.body.idTypeConnection)
      .input('EkhtarDate', sql.VarChar(10), req.body.EkhtarDate)
      .input('idEkhtarSubject', sql.Int, req.body.idEkhtarSubject)
      .input('EkhtarTime', sql.VarChar(5), req.body.EkhtarTime)
      .input('PhoneNo', sql.VarChar(15), req.body.PhoneNo)
      .input('LetterNo', sql.VarChar(20), req.body.LetterNo)
      .input('LetterDate', sql.VarChar(10), req.body.LetterDate)
      .input('SessionPlace', sql.NVarChar(40), req.body.SessionPlace)
      .input('DeadLineDate', sql.VarChar(10), req.body.DeadLineDate)
      .input('TafahomDate', sql.VarChar(10), req.body.TafahomDate)
      .input('Description', sql.NVarChar(250), req.body.Description)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspResponEkhtarUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ذخیره اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function responEkhtarDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { idResponEkhtar } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idResponEkhtar", sql.Int, idResponEkhtar)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspResponEkhtarDelete');

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "حذف اطلاعات با موفقیت انجام شد",

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

async function getReportResponEkhtarList(req) {

  try {

   let userFilter = `id in (select idRespon from TResponEkhtar where TafahomDate = '' and DeadLineDate < '${getPersianDate()}')`
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VRepRespon", "*", userFilter);
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
/////////////////////
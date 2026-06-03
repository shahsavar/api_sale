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
};

module.exports = {
  getPreFactor,
  getPreFactorUIData,
  prefactorInsert,
  prefactorDelete,
  prefactorUpdate,
  prefactorChangeStatus,
  BankMellatGetTransactions,
  getPreFactorDocPrint,
  preFactorDocPrintInsert,
  preFactorDocPrintUpdate,
  getPrefactorDocPrintData,
  PrefactorDocPrintDelete,
  getPreFactorNotConfirmReason,
  PreFactorNotConfirmReasonInsert,
  PreFactorExpireReasonUpdate,
  UpdateSystemDateLastSmsSend,
  preFactorResponInsert,
  getRelatePrefactorWithSaleProject,
  //getPrefactorDocPrintDataGroup,

}

async function getPreFactor(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPreFactor', '*', req.body.firstFilter)
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

async function getPreFactorDocPrint(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPreFactorDocPrint', '*', req.body.firstFilter)
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


async function getPreFactorUIData(req) {
  try {
    const pool = await pools.getPool("Sale");
    let result = await pool.request()
      .input('IdPreFactor', sql.Int, req.body.IdPreFactor)
      .execute("sale.uspGetPreFactorUIData");
    return {
      statusResult: 0,
      BaseOrderPreFactor: result.recordsets[0],
      agencies: result.recordsets[1],
      pricelist: result.recordsets[2] ? result.recordsets[2] : [],
      prefactorSaleprojectList: result.recordsets[3] ? result.recordsets[3] : [],
    };

  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function prefactorInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('IDSaleProject', sql.Int, req.body.IDSaleProject)
      .input('IDDueDeliverProg', sql.Int, req.body.IdDueDeliverProg)
      .input('IDAgency', sql.Int, req.body.IDAgency)
      .input('IDOwnerCustomer', sql.Int, req.body.IDOwnerCustomer)
      .input('Ezafi', sql.Bit, req.body.Ezafi)
      .input('OrderNo', sql.NVarChar(20), req.body.OrderNo)
      .input('OrderDate', sql.NVarChar(10), req.body.OrderDate)
      .input('IDBaseOrderPrefactor', sql.Int, req.body.IDBaseOrderPreFactor)
      .input('OrderManagementNo', sql.NVarChar(20), req.body.OrderManagementNo)
      .input('OrderManagementDate', sql.NVarChar(10), req.body.OrderManagementDate)
      .input('Quantity', sql.Int, req.body.Quantity)
      .input('Description', sql.NVarChar(300), req.body.Description)
      .input('ExpireDate', sql.NVarChar(10), req.body.ExpireDate)
      .input('Amount', sql.Numeric(18, 0), req.body.Amount)
      .input('BasePrice', sql.Numeric(18, 0), req.body.Price)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .input('PrefactorSaleprojectJson', sql.NVarChar(sql.MAX),req.body.PrefactorSaleprojectJson?JSON.stringify(req.body.PrefactorSaleprojectJson).replace(/"\s+|\s+"/g,'"'):null)
      .output('msgRet', sql.NVarChar(500))
      .output('Code', sql.Int)
      .execute('sale.uspPreFactorInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `پیش فاکتور با کد ${result.output.Code} ذخیره گردید`,
    };
  } catch (err) {
    console.log('error-prefactorInsert', err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function prefactorDelete(req) {
  try {
    var clientIp = req.ip;
    let UserLogin = req.privateData.UserLogin;
    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, req.body.ID)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPrefactorDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "حذف پیش فاکتور با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}




async function prefactorUpdate(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, req.body.ID)
      .input('Code', sql.Int, req.body.Code)
      .input('IDSaleProject', sql.Int, req.body.IDSaleProject)
      .input('IdDueDeliverProg', sql.Int, req.body.IdDueDeliverProg)
      .input('IDAgency', sql.Int, req.body.IDAgency)
      .input('Ezafi', sql.Bit, req.body.Ezafi)
      .input('OrderNo', sql.NVarChar(20), req.body.OrderNo)
      .input('OrderDate', sql.NVarChar(10), req.body.OrderDate)
      .input('IDBaseOrderPrefactor', sql.Int, req.body.IDBaseOrderPreFactor)
      .input('OrderManagementNo', sql.NVarChar(20), req.body.OrderManagementNo)
      .input('OrderManagementDate', sql.NVarChar(10), req.body.OrderManagementDate)
      .input('Quantity', sql.Int, req.body.Quantity)
      .input('Description', sql.NVarChar(300), req.body.Description)
      .input('ExpireDate', sql.NVarChar(10), req.body.ExpireDate)
      .input('Amount', sql.Numeric(18, 0), req.body.Amount)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .input('PrefactorSaleprojectJson', sql.NVarChar(sql.MAX),req.body.PrefactorSaleprojectJson?JSON.stringify(req.body.PrefactorSaleprojectJson).replace(/"\s+|\s+"/g,'"'):null)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPreFactorUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: 'ویرایش اطلاعات پیش فاکتور با موفقیت انجام شد',
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function prefactorChangeStatus(req) {
  try {
    console.log('req.biody prefactorChangeStatus:>> ', req.body);
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ShenaseBank', sql.NVarChar(20), req.body.ShenaseBank)
      .input('idCustomer', sql.Int, req.body.IDOwnerCustomer)
      .input('Status', sql.Int, req.body.Status)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPrefactorChangeStatus')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "تغییر وضعیت با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function BankMellatGetTransactions(req) {
  try {
    var v = "https://securityapp.ikd.ir/api/MohebService/GetAccountTransaction";
    let url = encodeURI(v);

    const pool = await pools.getPool('Sale')
    let result = await pool.request().execute('sale.uspGetPreFactorNotUpdateByMoheb');
    var postData = {
      secretKey: "C11658A3-837F-47B8-BC9D-FBC90DB0074C",
      dateList: result.recordset
    };

    var res1 = await axios.post(url, postData, axiosConfig);
    return {
      statusResult: res1.data.result ? 0 : 1,
      message: res1.data.message,
      count: res1.data.count,
    };


  } catch (err) {
    //console.log("err", err.message);
    return { statusResult: 2, message: err.message };
  }
}

async function preFactorDocPrintInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('PreFactorDocPrintDescr', sql.NVarChar(100), req.body.PreFactorDocPrintDescr)
      .input('IdModel', sql.Int, req.body.IdModel)
      .input('IdSaleProjects', sql.Int, req.body.idSaleProjects)
      .input('Matn', sql.NVarChar(sql.MAX), req.body.Matn)
      .input('StartDate', sql.NVarChar(10), req.body.StartDate)
      .input('EndDate', sql.NVarChar(10), req.body.EndDate)
      .input('CreateUserId', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPreFactorDocPrintInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `متن فاکتور با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function preFactorResponInsert(req) {
  try {
    console.log('req.body prefactor :>> ', req.body);
    //return
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('PreFactorId', sql.Int, req.body.PreFactorId)
      .input('IdRespon', sql.Int, req.body.ID)
      .input("PrefactorCode",  sql.Int, req.body.PrefactorCode)
      .input('LastModifyUserId', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPreFactorResponInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `متن فاکتور با موفقیت بروزآوری گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای' + err.message)
  }
}





async function preFactorDocPrintUpdate(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('PreFactorDocPrintId', sql.Int, req.body.PreFactorDocPrintId)
      .input('PreFactorDocPrintDescr', sql.NVarChar(100), req.body.PreFactorDocPrintDescr)
      .input('IdModel', sql.Int, req.body.IdModel)
      .input('IdSaleProjects', sql.Int, req.body.idSaleProjects)
      .input('Matn', sql.NVarChar(sql.MAX), req.body.Matn)
      .input('StartDate', sql.NVarChar(10), req.body.StartDate)
      .input('EndDate', sql.NVarChar(10), req.body.EndDate)
      .input('LastModifyUserId', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPreFactorDocPrintUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `متن فاکتور با موفقیت بروزآوری گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getPrefactorDocPrintData(req) {
  try {
    let userName = req.privateData.userName;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, req.body.ID)
      .execute('sale.uspGetPrefactorDocPrint');
    return {
      statusResult: 0,
      rows: result.recordsets[0],
      pricesRows: result.recordsets[1] ? result.recordsets[1] : [],
    };

  } catch (err) {

    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function PrefactorDocPrintDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('PreFactorDocPrintId', sql.Int, req.body.PreFactorDocPrintId)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspPreFactorDocPrintDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "حذف با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function PreFactorNotConfirmReasonInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idPrefactor', sql.Int, req.body.idPrefactor)
      .input('Descr', sql.NVarChar(500), req.body.Descr)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .output('msgRet', sql.NVarChar(300))
      .execute('Sale.dbo.uspPreFactorNotConfirmReasonInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `علت عدم تائید با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getPreFactorNotConfirmReason(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vwPreFactorNotConfirmReason', '*', req.body.firstFilter)
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

async function PreFactorExpireReasonUpdate(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idPrefactor', sql.Int, req.body.idPrefactor)
      .input('ExpireReasonDescr', sql.NVarChar(500), req.body.Descr)
      //.input('UserID', sql.NVarChar(10), UserLogin)
      .output('msgRet', sql.NVarChar(300))
      .execute('Sale.dbo.uspPreFactorExpireReasonUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `علت منقضی شدن پیش فاکتور با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function UpdateSystemDateLastSmsSend(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idPrefactor', sql.Int, req.body.idPrefactor)
      .output('msgRet', sql.NVarChar(300))
      .execute('Sale.dbo.uspPreFactorSystemDateLastSmsUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `  تاریخ آخرین ارسال پیامک پیش فاکتور با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    console.log('err.message :>> ', err.message);
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}






async function getRelatePrefactorWithSaleProject(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwRelatePrefactorWithSaleProject', '*', req.body.firstFilter)
    console.log('getRelatePrefactorWithSaleProject-->query', myQuery)
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


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
module.exports = {
  getAgency,
  agencyInsert,
  agencyUpdate,
  getAgencyUIData,
  getUserSystem,
  getTransferAgency,
  UserAgencySave,
  getTransferAgencyFile,
  getDataFileUserAccessAgency,
  getUserAccessAgency,
  checkBilinking,
  getAgencyPersonelWithPost,
  getAgencyHistory,
  AgencyHistoryInsert,
  getAgencyPersonel,
  AgencyPersonelInsert,
  AgencyPersonelUpdate,
  getAgencyPersonelHistory,
  AgencyPersonelHistoryInsert,
  getAgencyZemanat,

  getAgencySahebEmza,
  agencySahebEmzaInsert,

  agencySahebEmzaDelete,

  getAgencyPersonelSemat,
  getAgencyPersonelAmouzesh,
  agencyPersonelSematDelete,
  agencyPersonelSematHistoryInsert,
  agencyPersonelSematInsert,
  getAgencyPersonelSematHistory,
  AgencyZemanatSabtInsert,
  AgencyZemanatSabtUpdate,
  agencyZemanatChangeStatus,
  agencyZemanatnameDelete,
  agencyPersonelDelete,
  getPaymentZemanat,
  getMahzars,
  getAgencyPersonelUIData,
  getAgencyChartData,
  
  getAgencyMadrakAmouzesh,

}

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

async function getUserSystem(req) {
  const { first, rows, page } = req.body


  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwUsersSystem', '*')
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
async function getTransferAgency(req, res) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('UserId', sql.NVarChar(128), req.body.UserId)
      .execute('sale.sale.uspReactGetTransferAgency')
    return {
      statusResult: 0,
      rightRows: result.recordsets[0],
      leftRows: result.recordsets[1]
    };

  } catch (err) {
    //throw(err)
    return {
      statusResult: 2,
      message: 'خطا در ارتباط با پایگاه داده ای'
    };
  }
}

async function UserAgencySave(req, res, next) {

  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      //let PersonelId=obj.PersonelId;
      .input('AgencyRows', sql.NVarChar(sql.MAX), JSON.stringify(req.body.AgencyRows))
      .input('UserId', sql.NVarChar(128), req.body.UserId)
      .execute('Sale.Sale.uspUserAgencySave')
    return {
      statusResult: 0,
    };

  } catch (err) {
    //throw(err)
    return {
      statusResult: 2,
      message: 'خطا در ارتباط با پایگاه داده ای'
    };
  }
}

async function getTransferAgencyFile(req, res) {
  try {
    if (!req.body.dataFileId) {
      return {
        statusResult: 0,
        rightRows: [],
        leftRows: []
      };

    }
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('dataFileId', sql.UniqueIdentifier, req.body.dataFileId)
      .execute('Sale.sale.uspGetTransferAgencyFile')
    return {
      statusResult: 0,
      rightRows: result.recordsets[0],
      leftRows: result.recordsets[1]
    };

  } catch (err) {
    console.log('err :>> ', err);
    return {
      statusResult: 2,
      message: 'خطا در ارتباط با پایگاه داده ای'
    };
  }
}

async function getDataFileUserAccessAgency(req) {
  try {
    const { dataFileId } = req.body.firstParams;
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.VDataFileUserAccessAgency', '*', `dataFileId='${dataFileId}'`)
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

async function getUserAccessAgency(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var firstFilter = '1=0';
    //هر نمایندگی فقط نامه های خودش را ببیند
    if (UserLogin.toLowerCase().startsWith('ikd') || UserLogin.toLowerCase() == 'admin')
      firstFilter = ` IdAgency in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`
    const firstParams = req.body.firstParams
    if (firstParams && firstParams.archiveDate == 0)
      firstFilter = firstFilter + ` and isnull(archiveDate,'')='' `
    else if (firstParams && firstParams.archiveDate == 1)
      firstFilter = firstFilter + ` and isnull(archiveDate,'')!='' `

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.VDataFileUserAccessAgency', '*', '', firstFilter)
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

async function checkBilinking(req, res) {
  try {
    let userId = req.privateData.UserLogin;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("userId", sql.VarChar(50), userId)
      .execute("Sale.sale.uspCheckBilinking");
    return {
      statusResult: 0,
      rowData: result.recordset[0],
    };
  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getAgencyPersonelWithPost(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    //هر نمایندگی فقط  خودش را ببیند
    if (UserLogin.toLowerCase().startsWith('ikd'))
      firstFilter = `AgencySaleId in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`
    // else if(UserLogin.toLowerCase()=='admin' || UserLogin.toLowerCase()=='Saleadmin')
    // var firstFilter = ''; 
    else
      var firstFilter = '';
    //   var firstFilter = '1=0'; 

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonelWithPost', '*', '', firstFilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)

    return {
      statusResult: 0,
      rows: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    //console.log('err.message :>> ', err.message);
    return err
  }
}

async function getAgency(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var Agencyfilter = '';
    if (UserLogin.toLowerCase().startsWith('ikd'))
      Agencyfilter = ` ID in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VAgency', '*', req.body.firstFilter, Agencyfilter)

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

async function agencyInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('Code', sql.Int, req.body.Code)
      .input('Title', sql.NVarChar(50), req.body.Title)
      .input('TitleEng', sql.NVarChar(50), req.body.TitleEng)
      .input('IdCustomerAgency', sql.Int, req.body.IdCustomerAgency)
      .input('IdCustomerOwner', sql.Int, req.body.IdCustomerOwner)
      .input('RepairNo', sql.Int, req.body.RepairNo)
      .input('ZaribKarmozd', sql.Float, req.body.ZaribKarmozd)
      .input('IDCity', sql.Int, req.body.IDCity)
      .input('WorkCode', sql.VarChar(25), req.body.WorkCode)
      .input('InsuranceBranch', sql.NVarChar(25), req.body.InsuranceBranch)
      .input('mobilsaler', sql.VarChar(20), req.body.mobilsaler)
      .input('PhoneNoSaler', sql.VarChar(25), req.body.PhoneNoSaler)
      .input('EMailSaler', sql.VarChar(50), req.body.EMailSaler)
      .input('FaxNoSaler', sql.VarChar(15), req.body.FaxNoSaler)
      .input('AddressSaler', sql.NVarChar(200), req.body.AddressSaler)
      .input('EffectiveDateSaler', sql.VarChar(10), req.body.EffectiveDateSaler)
      .input('TypeAgencyCommission', sql.Int, req.body.TypeAgencyCommission)
      .input('TypeAgency', sql.Int, req.body.TypeAgency)

      .input('AgencyKind', sql.Int, req.body.AgencyKind)

      .input('Userid', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.sale.uspAgencyInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` اطلاعات نمایندگی با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function agencyUpdate(req) {
  try {
    //console.log('req :>> ', req.body);
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('ID', sql.Int, req.body.ID)
      .input('Code', sql.Int, req.body.Code)
      .input('Title', sql.NVarChar(50), req.body.Title)
      .input('TitleEng', sql.NVarChar(50), req.body.TitleEng)
      .input('IdCustomerOwner', sql.Int, req.body.IdCustomerOwner)
      .input('RepairNo', sql.Int, req.body.RepairNo)
      .input('ZaribKarmozd', sql.Float, req.body.ZaribKarmozd)
      .input('IDCity', sql.Int, req.body.IDCity)
      .input('WorkCode', sql.VarChar(25), req.body.WorkCode)
      .input('InsuranceBranch', sql.NVarChar(25), req.body.InsuranceBranch)
      .input('mobilsaler', sql.VarChar(20), req.body.mobilsaler)
      .input('PhoneNoSaler', sql.VarChar(25), req.body.PhoneNoSaler)
      .input('EMailSaler', sql.VarChar(50), req.body.EMailSaler)
      .input('FaxNoSaler', sql.VarChar(15), req.body.FaxNoSaler)
      .input('AddressSaler', sql.NVarChar(200), req.body.AddressSaler)
      .input('EffectiveDateSaler', sql.VarChar(10), req.body.EffectiveDateSaler)
      .input('TypeAgencyCommission', sql.Int, req.body.TypeAgencyCommission)
      .input('TypeAgency', sql.Int, req.body.TypeAgency)
      .input('AgencyKind', sql.Int, req.body.AgencyKind)
      .input('Userid', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.sale.uspAgencyUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` اطلاعات نمایندگی با موفقیت بروزآوری گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای' + err.message)
  }
}

async function getAgencyUIData(req) {
  try {
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetAgencyUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      cities: result.recordsets[0],
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function getAgencyHistory(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VAgencyHistory', '*', req.body.firstFilter)

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

async function AgencyHistoryInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('idAgency', sql.Int, req.body.IdAgency)
      .input('Flag', sql.Int, req.body.flagType)
      .input('Date', sql.NVarChar(10), req.body.Date)
      .input('Descr', sql.NVarChar(150), req.body.Descr)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyHistoryInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `تاریخچه نمایندگی با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getAgencyPersonel(req) {
  try {
    
    let UserLogin = req.privateData.UserLogin;
    var Agencyfilter = '';
    if (UserLogin.toLowerCase().startsWith('ikd'))
      Agencyfilter = ` IdAgency in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonel', '*', req.body.firstFilter, Agencyfilter)
    //var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonel', '*', req.body.firstFilter)
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

async function getAgencyPersonelUIData(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var Agencyfilter = '';
    if (UserLogin.toLowerCase().startsWith('ikd'))
      Agencyfilter = ` value in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonelUIData', '*', req.body.firstFilter, Agencyfilter)
    let pool = await pools.getPool('Sale')
    let result = await pool.request()
      .query(myQuery)
    return {
      statusResult: 0,
      agencies: result.recordsets[0],
      totalRecords: result.recordsets[1][0].totalCount,
    }
  } catch (err) {
    return err
  }
}

async function AgencyPersonelInsert(req) {
  try {
   //console.log('req.bodyAgencyPersonel :>> ', req.body);
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()
      .input('IdAgency', sql.Int, req.body.IdAgency)
      .input('IdCustomer', sql.Int, req.body.IdCustomer)
      .input('InsuranceNo', sql.VarChar(20), req.body.InsuranceNo)
      .input('WorkCode', sql.VarChar(20), req.body.WorkCode)
      .input('FromDate', sql.VarChar(10), req.body.FromDate)
      .input('LetterNo', sql.NVarChar(50), req.body.LetterNo)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyPersonelInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `پرسنل نمایندگی با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای' + err.message)
  }
}

async function AgencyPersonelUpdate(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgencyPersonel', sql.Int, req.body.IdAgencyPersonel)
      .input('InsuranceNo', sql.VarChar(20), req.body.InsuranceNo)
      .input('FromDate', sql.VarChar(10), req.body.FromDate)
      .input('WorkCode', sql.VarChar(20), req.body.WorkCode)
      .input('LetterNo', sql.NVarChar(50), req.body.LetterNo)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyPersonelUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "بروزآوری با موفقیت انجام شد",
    };
  } catch (err) {
   // throw new Error('خطا در برقراری ارتباط با پایگاه داده ای' + err.message)
   return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' + err.message}
  }
}

async function getAgencyPersonelHistory(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonelHistory', '*', req.body.firstFilter)
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

async function AgencyPersonelHistoryInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idAgencyPersonel', sql.Int, req.body.IdAgencyPersonel)
      .input('Status', sql.Int, req.body.flagType)
      .input('Date', sql.NVarChar(10), req.body.Date)
      .input('Descr', sql.NVarChar(150), req.body.Descr)
      .input('Userid', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.sale.uspAgencyPersonelHistoryInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `تاریخچه پرسنل با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getAgencyZemanat(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyZemanat', '*', req.body.firstFilter)

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

async function getAgencySahebEmza(req) {
  try {
    //console.log('req.BODY :>> ', req.body);
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencySahebEmza', '*', req.body.firstFilter)
   //console.log('myQuery :>> ', myQuery);
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


async function getPaymentZemanat(req) {
  try {
    const { IdCustomerOwner, IdCustomerAgency, Type } = req.body.firstParams;
    if (Type == 1)//حقیقی
    {
      var firstFilter = `IdCustomer=${IdCustomerAgency} and IDTypePayment=10 and Flag=2 and mandepayment>0`; //
    }
    else {
      var firstFilter = `(IdCustomer=${IdCustomerAgency} or IdCustomer=${IdCustomerOwner}) and IDTypePayment=10 and Flag=2 and mandepayment>0`;//
    }

    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VMandePayment', '*', firstFilter)

    //console.log('myQueryMandePayment :>> ', myQuery);

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

async function getMahzars(req) {
  try {
    const pool = await pools.getPool("Sale");
    let result = await pool.request()
      .execute("sale.uspGetMahzarUIData");
    return {
      statusResult: 0,
      mahzars: result.recordsets[0],
    };

  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function getM(req) {
  try {
    const pool = await pools.getPool("Sale");
    let result = await pool.request()
      .execute("sale.uspGetMahzarUIData");
    return {
      statusResult: 0,
      mahzars: result.recordsets[0],
    };

  } catch (err) {
    return {
      statusResult: 2,
      message: "خطا در برقراری ارتباط با پایگاه داده ای",
    };
  }
}

async function AgencyZemanatSabtInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()

      .input('IdPayment', sql.Int, req.body.IdPayment)
      .input('IdMahzar', sql.Int, req.body.IdMahzar)
      .input('IdAgency', sql.Int, req.body.IdAgency)
      .input('IdCustomer', sql.Int, req.body.IdCustomer)
      .input('SanadRahniNo', sql.VarChar(50), req.body.SanadRahniNo)
      .input('SanadRahniDate', sql.VarChar(10), req.body.SanadRahniDate)
      .input('TypeZemanat', sql.Int, req.body.TypeZemanat)
      .input('Amount', sql.Decimal(18, 0), req.body.Amount)
      .input('AmountSabt', sql.Decimal(18, 0), req.body.AmountSabt)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyZemanatInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` ضمانت نمایندگی با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function agencyPersonelSematInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()

      .input('IdAgencyPersonel', sql.Int, req.body.IdAgencyPersonel)
      .input('IdTypeAgencySemat', sql.Int, req.body.IdTypeAgencySemat)
      .input('FromDate', sql.VarChar(20), req.body.FromDate)
      .input('ToDate', sql.VarChar(20), req.body.ToDate)
      .input('Descr', sql.NVarChar(200), req.body.Descr)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyPersonelSematInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` سمت پرسنل نمایندگی با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function AgencyZemanatSabtUpdate(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')

    let result = await pool.request()

      .input('IdAgencyZemanat', sql.Int, req.body.IdAgencyZemanat)
      .input('IdPayment', sql.Int, req.body.IdPayment)
      .input('IdMahzar', sql.Int, req.body.IdMahzar)
      .input('IdAgency', sql.Int, req.body.IdAgency)
      .input('IdCustomer', sql.Int, req.body.IdCustomer)
      .input('SanadRahniNo', sql.VarChar(50), req.body.SanadRahniNo)
      .input('SanadRahniDate', sql.VarChar(10), req.body.SanadRahniDate)
      .input('Amount', sql.Decimal(18, 0), req.body.Amount)
      .input('AmountSabt', sql.Decimal(18, 0), req.body.AmountSabt)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyZemanatUpdate')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: ` ضمانت نمایندگی با موفقیت بروزآوری گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}


async function agencyZemanatChangeStatus(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgencyZemanat', sql.Int, req.body.IdAgencyZemanat)
      .input('StatusZemanat', sql.Int, req.body.StatusZemanat)
      .input('UserID', sql.NVarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyZemanatChangeStatus')
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
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function agencyZemanatnameDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { Id } = req.body
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgencyZemanat', sql.Int, req.body.IdAgencyZemanat)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyZemanatDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: " .حذف ضماننت با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function agencyPersonelDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgencyPersonel', sql.Int, req.body.IdAgencyPersonel)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyPersonelDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: " .حذف ضماننت با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}

async function getAgencyPersonelSemat(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonelSemat', '*', req.body.firstFilter)

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

// async function getAgencyPersonelAmouzesh(req) {
//   try {
//     var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonelAmouzesh', '*', req.body.firstFilter)

//     let pool = await pools.getPool('Sale')
//     let result = await pool.request()
//       .query(myQuery)
//     return {
//       statusResult: 0,
//       rows: result.recordsets[0],
//       totalRecords: result.recordsets[1][0].totalCount,
//     }
//   } catch (err) {
//     return err
//   }
// }


async function agencyPersonelSematDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
   
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgencyPersonelSemat', sql.Int, req.body.IdAgencyPersonelSemat)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencyPersonelSematDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: " .حذف سمت پرسنلی با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}


async function agencySahebEmzaDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
   
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IdAgencySahebEmza', sql.Int, req.body.IdAgencySahebEmza)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.uspAgencySahebEmzaDelete')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: " .حذف  صاحب امضاء با موفقیت انجام شد",
    };
  } catch (err) {
    return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
  }
}
               
async function agencySahebEmzaInsert(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idAgency', sql.Int, req.body.IdAgency)
      .input('idSemat', sql.Int, req.body.IdSemat)
      .input('IdCustomer', sql.NVarChar(150), req.body.IdCustomer)
      .input('Userid', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.sale.uspAgencySahebEmzaInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `صاحب امضاء با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای' + err.message)
  }
}


async function getAgencyPersonelSematHistory(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwAgencyPersonelSematHistory', '*', req.body.firstFilter)
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

async function agencyPersonelSematHistoryInsert(req) {
  try {
    
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('idAgencyPersonelSemat', sql.Int, req.body.IdAgencyPersonelSemat)
      .input('Status', sql.Int, req.body.flagType)
      .input('Date', sql.NVarChar(10), req.body.Date)
      .input('Descr', sql.NVarChar(150), req.body.Descr)
      .input('Userid', sql.NVarChar(10), UserLogin)
      .input('clientIp', sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('sale.sale.uspAgencyPersonelSematHistoryInsert')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: `تاریخچه پرسنل با موفقیت ذخیره گردید`,
    };
  } catch (err) {
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function getAgencyPersonelAmouzesh(req) {
  try {
    var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.Sale.vwTrainingInfo', '*', req.body.firstFilter)
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

async function getAgencyChartData(req) {
  try {
    const { IdAgency } = req.body;
    let myQuery = `SELECT * from Sale.Sale.vwAgencyChart WHERE IdAgency= ${IdAgency} Order by IdTypeAgencySemat`;

    let pool = await pools.getPool('Sale');
    let result = await pool.request().query(myQuery);

    // تبدیل BinaryData به Base64
    const rowsWithBase64 = result.recordsets[0].map((row) => {
      return {
        ...row,
        Base64Image: row.BinaryData ? row.BinaryData.toString('base64') : null,
      };
    });

    return {
      statusResult: 0,
      rows: rowsWithBase64,
    };
  } catch (err) {
    return err;
  }
}

//دانلود مدرک آموزشی پرسنل نمایندگی
async function getAgencyMadrakAmouzesh(req, res) {
  try {
    const { DataFileId } = req.body; // همون کد مدرک

    let myQuery = `SELECT * from DBImage.dbo.tbDataImage WHERE DataFileId=BA5AB39B-4529-43B0-8EC0-000C4B00F296 `;
    const pool = await pools.getPool("DBImage");
    let result = await pool.request().query(myQuery);

    if (result.recordset.length === 0) {
      return res.status(404).send("فایل یافت نشد");
    }

    const fileData = result.recordset[0].FileData;

    console.log('amfileData :>> ', fileData);
    res.setHeader("Content-Type", "application/pdf"); // یا هر MIME-Type مناسب
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="file_${DataFileId}.pdf"`
    );
    res.send(fileData);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("خطا در دریافت فایل از سرور");
  }
}

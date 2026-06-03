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

    getBargashtiRespon,
    getElatBargashtAgency,
    getBargashtiPayment,
    ersalRespon,
    getRelatResponWithCustomer,
    ersalPaymentMarkazi,
    getContronAgencyResponList,
    ellatBargashtAgencyInsert,
    ellatBargashtAgencyUpdate,
    ellatBargashtAgencyDelete,
    controlAgencyResponOk,
    controlAgencyResponNotOk,
    controlAgencyResponBack,
    getControlAgencyResponArchive,
    getContronAgencyPaymentList,
    controlAgencyPaymentOk,
    controlAgencyPayemntNotOk,
    controlAgencyPaymentBack,
    getControlAgencyPaymentArchive,
    controlAgencyPaymentUIData,
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

async function getBargashtiRespon(req) {

    let UserLogin = req.privateData.UserLogin;
    var filter = '';
    var Agencyfilter = '';


    //هر نمایندگی فقط تعدات خودش را ببیند
    if (UserLogin.toLowerCase().startsWith('ikd'))
        Agencyfilter = ` idagencyCode in (select IdAgency from sale.dbo.TuserAgency where userid='${UserLogin}')`

    if (req.body.firstFilter != undefined && req.body.firstFilter != '' && req.body.firstFilter != null && Agencyfilter != '')
        filter = `${req.body.firstFilter} And ( ${Agencyfilter}) `
    else if (req.body.firstFilter != undefined && req.body.firstFilter != '' && req.body.firstFilter != null && Agencyfilter == '')
        filter = req.body.firstFilter
    else
        filter = Agencyfilter
    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwResponBargashtiAgency', '*', filter)
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

async function getElatBargashtAgency(req) {
    const { first, rows, page } = req.body

    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VElatBargashtAgency', '*', req.body.firstFilter)


        let pool = await pools.getPool('Sale')
        let result = await pool.request().query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        console.log('errerrerr', err)
        return err
    }
}

async function getBargashtiPayment(req) {
    const { first, rows, page } = req.body
    let UserLogin = req.privateData.UserLogin;

    var filter = ""
    if (UserLogin === "admin")
        filter = ""
    else
        filter = "UserId='" + UserLogin + "'"
    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPaymentBargashtiAgency', '*', filter)
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
async function ersalRespon(req) {
    try {

        let UserLogin = req.privateData.UserLogin;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()

            .input('IdRespon', sql.Int, req.body.ID)
            .output('msgRet', sql.NVarChar(1000))
            .execute('sale.uspErsalRespon')

        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: 'قرارداد با موفقیت ارسال گردید'
            // customerCode:result.output.Code
        };
    } catch (err) {
        // console.log('errerrerrerrerrerrerr', err)
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
async function getRelatResponWithCustomer(req) {
    const { first, rows, page } = req.body
    let obj = req.privateData;

    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwRelatResponWithCustomer', '*', filter)
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
async function ersalPaymentMarkazi(req) {
    try {

        let obj = req.privateData;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()

            .input('Flag', sql.Int, req.body.Flag)
            .input('ID', sql.Int, req.body.ID)
            .input('SystemDateErsalAgecny', sql.VarChar(20), req.body.SystemDateErsalAgecny)
            .output('msgRet', sql.NVarChar(1000))
            .execute('sale.uspErsalPaymentMarkazi')

        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: 'وجه با موفقیت ارسال گردید'
            // customerCode:result.output.Code
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

//////////////////////////// کنترل اطلاعات ثبتی نمایندگی ها

async function getContronAgencyResponList(req) {

    try {

        let userFilter = `Flag=1 and ErsalDate<>'' and ((substring(UserID, 1, 3)='ikd') or (UserID='Internet'))`

        var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VRespon", "*", userFilter);
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
async function ellatBargashtAgencyInsert(req) {
    try {

    
        let UserLogin = req.privateData.UserLogin;
        var clientIp = req.ip;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()

            .input('Id', sql.Int, req.body.Id)
            .input('idRefrence', sql.Int, req.body.idRefrence)
            .input('ElatBargasht', sql.NVarChar(500), req.body.ElatBargasht)
            .input('Type', sql.TinyInt, req.body.Type)
            .input('userId', sql.VarChar(10), UserLogin)
            .input("clientIp", sql.NVarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(500))
            .execute('Sale.sale.uspTEllatBargashtAgencyInsert')
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
async function ellatBargashtAgencyUpdate(req) {
    try {
  
  
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
  
      .input('Id', sql.Int, req.body.Id)
      .input('idRefrence', sql.Int, req.body.idRefrence)
      .input('ElatBargasht', sql.NVarChar(500), req.body.ElatBargasht)
      .input('Type', sql.TinyInt, req.body.Type)
      .input('userId', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspTEllatBargashtAgencyUpdate')
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
  async function ellatBargashtAgencyDelete(req) {
    try {
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      const { Id } = req.body;
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input('Id', sql.Int, Id)
        .input('Type', sql.TinyInt, req.body.Type)
        .input('userId', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspTEllatBargashtAgencyDelete');
  
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
  async function controlAgencyResponOk(req) {
    try {
      const { idRespon,Type } = req.body;
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      let spName = "Sale.sale.uspControlAgencyResponOk";
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("idRespon", sql.Int, idRespon)
        .input("Type", sql.Int, Type)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute(spName);
  
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "  ثبت اطلاعات با موفقیت انجام شد",
  
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
  async function controlAgencyResponNotOk(req) {
    try {
      const { idRespon } = req.body;
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      let spName = "Sale.sale.uspControlAgencyResponNotOk";
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("idRespon", sql.Int, idRespon)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute(spName);
  
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "  ثبت اطلاعات با موفقیت انجام شد",
  
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
  async function controlAgencyResponBack(req) {
    try {
      const { idRespon,Type } = req.body;
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      let spName = "Sale.sale.uspControlAgencyResponBack";
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("idRespon", sql.Int, idRespon)
        .input("Type", sql.Int, Type)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute(spName);
  
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "  ثبت اطلاعات با موفقیت انجام شد",
  
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
  async function getControlAgencyResponArchive(req) {

    try {
  
      const { idRefrence, Type } = req.body.firstParams;
      let userFilter = `idRefrence=${idRefrence} and Type=${Type}`
      let viewName = ''
     
      var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VElatBargashtAgencyRespon", '*', userFilter)
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
  async function getContronAgencyPaymentList(req) {

    try {

        let userFilter = `Flag=1 and SystemDateErsalAgecny<>'' and idTypePayment not in (7, 8, 9, 11,17) and substring(userid, 1, 3)='ikd'`

        var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VPayment", "*", userFilter);
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
async function controlAgencyPaymentOk(req) {
  try {
    const { idPayment,Type } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    let spName = "Sale.sale.uspControlAgencyPaymentOk";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idPayment", sql.Int, idPayment)
      .input("Type", sql.Int, Type)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "  ثبت اطلاعات با موفقیت انجام شد",

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
async function controlAgencyPayemntNotOk(req) {
  try {
    const {idPayment } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    let spName = "Sale.sale.uspControlAgencyPayementNotOk";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idPayment", sql.Int, idPayment)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "  ثبت اطلاعات با موفقیت انجام شد",

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

async function controlAgencyPaymentBack(req) {
  try {
    const { idPayment,Type } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    let spName = "Sale.sale.uspControlAgencyPayementBack";
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("idPayment", sql.Int, idPayment)
      .input("Type", sql.Int, Type)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);


    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "  ثبت اطلاعات با موفقیت انجام شد",

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
async function getControlAgencyPaymentArchive(req) {

  try {

    const { idRefrence, Type } = req.body.firstParams;
    let userFilter = `idRefrence=${idRefrence} and Type=${Type}`
    let viewName = ''
   
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VElatBargashtAgencyPayment", '*', userFilter)
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


async function controlAgencyPaymentUIData(req) {
  try {

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('IDCustomer', sql.Int, req.body.IDCustomer)
      .input('idPayment', sql.Int, req.body.idPayment)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspControlAgencyPaymentUIData')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "خواندن موفق",
        vcustomer: result.recordsets[0] ? result.recordsets[0][0] : [],
        vpayment: result.recordsets[1] ? result.recordsets[1][0] : [],

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

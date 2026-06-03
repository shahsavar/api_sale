const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
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
    sendFactor,
    chekFactor,
    sendEbtal,
    getFactorReadyToSendDaraee,
    getFactorErrorDaraee,
    getFactorSendedDaraee,
    getFactorEbtalReadyToSendDaraee,
    getFactorDaraeeLog,
    getAgencyInfoForDaraeeUIData,
    getAgencyNationalCode,
    AgencyInfoForDaraeeInsert,
    AgencyInfoForDaraeeUpdate,
    AgencyInfoForDaraeeDelete
}

async function sendFactor(req,res,next) {
    try {
       
        const pool = await pools.getPool('Sale')
        let  result = pool.request()
            .input('factorList', sql.NVarChar(sql.MAX),JSON.stringify(req.body.selectedRows))
            // .input('userName', sql.VarChar(25), userName)
            .execute('Sale.sale.uspSendFactorForTisAgent')
            
        return {
            statusResult:0,
            count:req.body.selectedRows.length
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در ارسال فاکتور'}
    }
}
async function chekFactor(req,res,next) {
    try {
        let userName=req.privateData.UserLogin;
        var v = "https://securityapp.ikd.ir/api/Message/CheckRefrence";
        if (req.body.selectedRows.length > 0) {
          let url = encodeURI(v);
          var postData = {
            secretKey: "C11658A3-837F-47B8-BC9D-FBC90DB0074C",
            userName: userName,
            factorIdList: req.body.selectedRows,
          };
          var res1 = await axios.post(url, postData, axiosConfig);
          return {
            statusResult: res1.data.result ? 0 : 1,
            message: res1.data.message,
            count: res1.data.count,
          };
        } else {
          return {
            statusResult: 0,
            message: 'رکوردی انتخاب نشده',
            count: 0,
          };
        }
    }catch (err) {
        return {statusResult:2,message:'خطا در ارسال فاکتور'}
    }
}
async function sendEbtal(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        
        let userName=req.privateData.UserLogin;
        let count=0
        req.body.selectedRows.map((row)=>{
            let  result = pool.request()
            .input('factorId', sql.Int,row.ID)
            .input('userName', sql.VarChar(25), userName)
            .execute('PublicDb2.dbo.spSendInvoiceEbtal')

            count=count+1
            }
        )
        
        return {
            statusResult:0,
            count:count
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در ارسال فاکتور'}
    }
}

async function getFactorReadyToSendDaraee(req,res,next) {
 
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwFactorReadyToSendDaraee','*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

async function getFactorErrorDaraee(req,res,next) {
 
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwFactorErrorDaraee','*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}


async function getFactorSendedDaraee(req,res,next) {
 
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwFactorSendedDaraee','*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

async function getFactorEbtalReadyToSendDaraee(req,res,next) {
 
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwFactorEbtalReadyToSendDaraee','*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

async function getFactorDaraeeLog(req,res,next) {
 
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwFactorDaraeeLog','*',req.body.firstFilter)

        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

async function getAgencyInfoForDaraeeUIData(req) {
    try {
      const pool = await pools.getPool("Sale");
      let result = await pool.request()
        .execute("sale.uspAgencyInfoForDaraeeUIData");
      return {
        statusResult: 0,
        agencies: result.recordsets[0],
      };
  
    } catch (err) {
      return {
        statusResult: 2,
        message: "خطا در برقراری ارتباط با پایگاه داده ای",
      };
    }
  }

  async function getAgencyNationalCode(req,res,next) {
 
    try {
        console.log('getAgencyNationalCode--->reqreqreqreq', req)
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwAgencyNationalCode','*',req.body.firstFilter)

        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

async function AgencyInfoForDaraeeInsert(req) {
    try {
        const { IdCustomer, IdAgency, IdTypeCustomer, NationalCode, EconomicCode}= req.body;
      let spName = "sale.uspAgencyInfoForDaraeeInsert";
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("IdCustomer", sql.Int, IdCustomer)
        .input("IdAgency", sql.Int, IdAgency)
        .input("IdTypeCustomer", sql.Int, IdTypeCustomer)
        .input("NationalCode", sql.VarChar(11), NationalCode)
        .input("EconomicCode", sql.VarChar(15), EconomicCode)
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
  async function AgencyInfoForDaraeeUpdate(req) {
    try {
      const { IdCustomer, IdAgency, IdTypeCustomer, NationalCode, EconomicCode}= req.body;
      let spName = "sale.uspAgencyInfoForDaraeeUpdate";
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  console.log('req.body-AgencyInfoForDaraeeUpdate', req.body)
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("IdCustomer", sql.Int, IdCustomer)
        .input("IdAgency", sql.Int, IdAgency)
        .input("IdTypeCustomer", sql.Int, IdTypeCustomer)
        .input("NationalCode", sql.VarChar(11), NationalCode)
        .input("EconomicCode", sql.VarChar(15), EconomicCode)
        .input("UserID", sql.VarChar(10), UserLogin)
        .input("clientIp", sql.VarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute(spName);
  
  
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
  async function AgencyInfoForDaraeeDelete(req) {
    try {
      const { IdCustomer } = req.body;
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
      let spName = "sale.uspAgencyInfoForDaraeeDelete";
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("IdCustomer", sql.Int, IdCustomer)
        .input("UserID", sql.VarChar(10), UserLogin)
        .input("clientIp", sql.VarChar(50), clientIp)
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




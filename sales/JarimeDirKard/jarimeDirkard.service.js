const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {
    
    getJarimeDirKardList,
    getJarimeDirKardItemsList,
    JarimeDirKardManualCalc,
    ConfirmJarimeDirKard,
     EbtalJarimeDirKard,
     getJarimeResponNonAuto,
     JarimeResponNonAutoInsert,
     JarimeResponNonAutoDelete,
     getJarimeDirKardResponList,
     getJarimeDirKardResponItemsList,
     JarimeDirKardResponCalcAll,
     JarimeDirKardForResponCalc,
     getSanadReportUIData,
     readSanadReport,
}


async function getJarimeDirKardList(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwJarimeDirKard','*',req.body.firstFilter)
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

async function getJarimeDirKardItemsList(req,res,next) {
 
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwJarimeDirKardItems','*',req.body.firstFilter)
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

async function getJarimeResponNonAuto(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwJarimeResponNonAuto','*',req.body.firstFilter)
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



async function ConfirmJarimeDirKard(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        let UserLogin = req.privateData.UserLogin; 
        let  result = await pool.request()
            .input('jarimeList', sql.NVarChar(sql.MAX),JSON.stringify(req.body.selectedRows))
            .input('ActionType', sql.Int, 2)
            .input('userName', sql.VarChar(25), UserLogin)
            .execute('sale.sale.uspJarimeDirkard')
        return {
            statusResult:0,
            count:req.body.selectedRows.length
        }; 
    }catch (err) {
        console.log('err.', err.message)
        return {statusResult:2,message:err.message}
    }
}
async function EbtalJarimeDirKard(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        let UserLogin = req.privateData.UserLogin; 
        
        let  result = await pool.request()
            .input('jarimeList', sql.NVarChar(sql.MAX),JSON.stringify(req.body.selectedRows))
            .input('ActionType', sql.Int, 0)
            .input('userName', sql.VarChar(25), UserLogin)
            .execute('sale.sale.uspJarimeDirkard')
        return {
            statusResult:0,
            count:req.body.selectedRows.length
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در ارسال فاکتور'}
    }
}
async function JarimeResponNonAutoInsert(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        let UserLogin = req.privateData.UserLogin; 
        // console.log('req.body', req.body)
        let  result = await pool.request()
            .input('IdRespon', sql.Int, req.body.IdRespon)
            .input('LetterNo', sql.VarChar(25), req.body.LetterNo)
            .input('UserCode', sql.VarChar(25), UserLogin)
            .output('msgRet', sql.NVarChar(200))
            .execute('sale.sale.uspJarimeResponNonAutoInsert')

         if (result.output.msgRet != "") {
                // console.log('result.output.msgRet', result.output.msgRet)
                return {
                    statusResult: 1,
                    message: result.output.msgRet
                };
            }
            
        return {
          
            statusResult: 0,
            message: `تعهد مورد نظر ثبت شد`,
        };
    }catch (err) {
        console.log('err :>> ', err);
        return {statusResult:2,message:'خطا در ثبت تعهد' + err.message}
    }
}

async function JarimeResponNonAutoDelete(req) {
    try {

        // let obj = req.privateData;
        // let UserLogin = obj.UserLogin;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('Id', sql.Int, req.body.Id)
            .output('msgRet', sql.NVarChar(500))
            .execute('sale.uspJarimeResponNonAutoDelete')
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
async function JarimeDirKardManualCalc(req) {
    try {

        let UserLogin = req.privateData.UserLogin; 
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('idFactor', sql.Int, req.body.IdFactor)
            .input('UserId', sql.VarChar(15), UserLogin)
            .input('UserEndDate', sql.VarChar(10), req.body.UserEndDate)
            .input('UserComment', sql.NVarChar(200), req.body.UserComment)
            .input('LetterNo', sql.VarChar(20), req.body.LetterNo)
             .output('msgRet', sql.NVarChar(500))
             .execute('sale.uspJarimeDirKardCalc')
        if (result.output.msgRet != "") {
            // console.log('result', result)
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: " با موفقیت انجام شد",
        };
    } catch (err) {
        console.log('errrr', err.message)
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function getJarimeDirKardResponList(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwJarimeDirKardForRespon','*',req.body.firstFilter)
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

async function getJarimeDirKardResponItemsList(req,res,next) {
 
    try {
        // console.log('req.body', req.body)
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwJarimeDirKardForResponItems','*',req.body.firstFilter)

        // console.log('query', query)
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

async function JarimeDirKardResponCalcAll(req) {
    try {

        let UserLogin = req.privateData.UserLogin; 
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('UserEndDate', sql.VarChar(10), req.body.UserEndDate)
            .input('UserId', sql.VarChar(15), UserLogin)
             .execute('sale.uspJarimeDirKardResponCalcAll')
        // if (result.output.msgRet != "") { 
        //      console.log('result.output.msgRet', result.output.msgRet)
        //     return {
        //         statusResult: 1,
        //         message: result.output.msgRet
        //     };
        // }
        return {
            statusResult: 0,
            message: " با موفقیت انجام شد",
        };
    } catch (err) {
        // console.log('errrr', err.message)
        return { statusResult: 2, message: err.message }
    }
}

async function JarimeDirKardForResponCalc(req) {
    try {

        let UserLogin = req.privateData.UserLogin; 
        // console.log('req.body', req.body)
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('IdRespon', sql.Int, req.body.IdRespon)
            .input('UserId', sql.VarChar(15), UserLogin)
            .input('UserEndDate', sql.VarChar(10), req.body.UserEndDate)
            .input('UserComment', sql.NVarChar(200), req.body.UserComment)
            .input('LetterNo', sql.VarChar(20), req.body.LetterNo)
             .output('msgRet', sql.NVarChar(500))
             .execute('sale.uspJarimeDirKardForResponCalc')
        if (result.output.msgRet != "") {
            // console.log('result', result)
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: " با موفقیت انجام شد",
        };
    } catch (err) {
        console.log('errrr', err.message)
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

////////////////////////// گزارش سند

async function getSanadReportUIData(req) {

    try {
      
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .execute('sale.uspSanadReportUIData')
      return {
        statusResult: 0,
        message: "خواندن موفق",
        typeSanad: result.recordsets[0],
        
      };
    } catch (err) {
      console.log("err,message", err.message)
      throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
    }
  
  }
  async function readSanadReport(req, res) {
    try {
      const { fromDate, toDate , typesanad } = req.body.firstParams
  
      var query = SqlCommandCreator(req.body.lazyParams, `Sale.sale.udfGetSanadSale('${fromDate}','${toDate}',${typesanad})`, "*");
      const pool = await pools.getPool("Sale");
      let resultq = await pool.request().query(query);
      return {
        statusResult: 0,
        rows: resultq.recordsets[0],
        totalRecords: resultq.recordsets[1][0].totalCount,
      };
    } catch (err) {
      console.log('err.message :>> ', err.message);
      return {
        statusResult: 2,
        message: err.message,
      };
    }
  }


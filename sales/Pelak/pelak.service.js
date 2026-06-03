const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {
    importExcel,
    getImportPelakOk,
    getImportPelakError,
    getPelackTracking,
    getPelackTrackingHistory,
    PelakTrackingAction,
    PelakTrackingCheckOption,
    PelakTrackingCheckUpdate,
    getImportShomareGozariError,
    ErsalKoliPelakTracking,
    getPelakActionUIData,
    getPelackFakHistory

}
async function importExcel(req,res,next) {
    try {
        
        const pool = await pools.getPool('Sale')
        let obj = req.privateData;
        let userName=obj.UserLogin;
        
        let  result = pool.request()
            .input('ShasiNoList', sql.NVarChar(sql.MAX),JSON.stringify(req.body.file).replace(/"\s+|\s+"/g,'"'))
            .input('userName', sql.VarChar(25), userName)
            .execute('Sale.dbo.uspImportPelakList')
            
        return {
            statusResult:0,
            // count:req.body.selectedRows.length
        };
    }catch (err) {
        return {statusResult:2,message:'خطا در ارسال '}
    }
}

async function getImportPelakOk(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwImportPelakOk','*',req.body.firstFilter)
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

async function getImportPelakError(req,res,next) {
    try {
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwImportPelakError','*',req.body.firstFilter)
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

async function getPelackTracking(req) {

   
    try {
      var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPelackTracking', '*', req.body.firstFilter)
      let pool = await pools.getPool('Sale')
      let result = await pool.request()
        .query(myQuery)
  
      return {
        statusResult: 0,
        rows: result.recordsets[0],
        totalRecords: result.recordsets[1][0].totalCount,
      }
    } catch (err) {
      console.log('err-vwPelackTracking :>> ', err);
      return err
    }
  }
  async function getPelackTrackingHistory(req) {

    const { IdPelakTracking } = req.body.firstParams;
    let userFilter = '' 
    if(IdPelakTracking != 0)
    userFilter = 'IdPelakTracking=' + IdPelakTracking
    try {
      var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPelackTrackingHistory', '*', userFilter , req.body.firstFilter)
      // console.log("myQuery ==>" , myQuery)
      let pool = await pools.getPool('Sale')
      let result = await pool.request()
        .query(myQuery)
  
      return {
        statusResult: 0,
        rows: result.recordsets[0],
        totalRecords: result.recordsets[1][0].totalCount,
      }
    } catch (err) {
      console.log('err-vwPelackTrackingHistory :>> ', err);
      return err
    }
  }

  async function PelakTrackingAction(req) {
    try {
     
    
      let UserLogin = req.privateData.UserLogin;
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('IdPelakTracking', sql.Int, req.body.IdPelakTracking)
        .input('ActionType', sql.Int, req.body.ActionType)
        .input('ActionDate', sql.VarChar(10), req.body.ActionDate)
        .input('EllatId', sql.Int, req.body.EllatId)
        .input('Comment', sql.NVarChar(300), req.body.Comment)
        .input('UserID', sql.VarChar(10), UserLogin)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspPelakTrackingAction')

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
  
  async function PelakTrackingCheckOption(req) {
    try {
  
      const { IdPelakTracking, CheckOption , CheckValue } = req.body;
  
      
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('IdPelakTracking', sql.Int,IdPelakTracking)
        .input('CheckOption', sql.TinyInt, CheckOption)
        .input('CheckValue', sql.TinyInt, CheckValue)
        
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspPelakTrackingCheckOption')
  
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

  async function PelakTrackingCheckUpdate(req) {
    try {
  
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
      
        
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspGetBazdidOkwithFactor')
  
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
  async function getImportShomareGozariError(req, res) {
    try {
  
  
      const { ImportType } = req.body.firstParams;
      let userFilter = 'ImportType=' + [ImportType]
  
      var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.vwImportShomareGozariError', '*' ,userFilter )
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

  async function ErsalKoliPelakTracking(req) {
    try {
     
    
      let UserLogin = req.privateData.UserLogin;
      let rows = JSON.stringify(req.body.rows)
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('Rows', sql.NVarChar(sql.MAX), rows)
        .input('UserID', sql.VarChar(10), UserLogin)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspErsalKoliPelakTracking')

        if (result.output.msgRet == "" || result.output.msgRet == null)
          return {
            statusResult: 0,
            message: " ارسال به شماره گذاری با موفقیت انجام شد",
    
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
  
  async function getPelakActionUIData(req) {
    try {
  

      let userFilter = ''
  
      var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.tbPelakBarghashtEllat', 'ID  AS [value],Title  as [label]', userFilter)
      let pool = await pools.getPool('Sale')
      let result = await pool.request().query(query)
  
      console.log(query)
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
  async function getPelackFakHistory(req) {

    let userFilter = '' 
    try {
      var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPelakFak', '*', userFilter)
      let pool = await pools.getPool('Sale')
      let result = await pool.request()
        .query(myQuery)
  
      return {
        statusResult: 0,
        rows: result.recordsets[0],
        totalRecords: result.recordsets[1][0].totalCount,
      }
    } catch (err) {
      console.log('err-vwPelakFak :>> ', err);
      return err
    }
  }
const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {

    getFakRahn,
    getFakRahnPrintUIData,
    getInitialFactorUIData,

}


async function getFakRahn(req,res,next) {
    try {
        let userFilter= ''
        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwFakRahn','*', userFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        console.log("errorMessage ==>" , err.message)
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

async function getFakRahnPrintUIData(req) {
    try {
  
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .execute('Sale.sale.uspFakRahnPrintUIData')
  
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "خواندن موفق",
          parvande: result.recordsets[0] ? result.recordsets[0][0] : [],
          
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

  async function getInitialFactorUIData(req) {
    try {
  
      const pool = await pools.getPool('Sale')
      let result = await pool.request()
        .input('idQueue', sql.Int, req.body.idQueue)
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspGetInitialFactorUIData')
  
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
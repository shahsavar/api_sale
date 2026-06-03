const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
module.exports = {

  getAmarKhodro,
  getAmarKhodroUIData,


}

//////////////////// جستجوی خودرو

async function getAmarKhodro(req) {

  try {
    let userFilter = ''
    const { commerCode, factorCode, tahvilCode, mahalCode, classCode, Model ,kasriCode , DateTolid1, DateTolid2 , CommercDate1, CommercDate2, FactorDate1,
      FactorDate2, TahvilDate1, TahvilDate2, ExitDate1, ExitDate2, StartGaranti1, StartGaranti2
    } = req.body.firstParams;
    
    
    
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("commerCode", sql.Int, commerCode)
      .input("factorCode", sql.Int, factorCode)
      .input("tahvilCode", sql.Int, tahvilCode)
      .input("mahalCode", sql.Int, mahalCode)
      .input("classCode", sql.Int, classCode)
      .input("Model", sql.Int, Model)
      .input("KasriCode", sql.Int, kasriCode)
      .input("DateTolid1", sql.VarChar(10), DateTolid1)
      .input("DateTolid2", sql.VarChar(10), DateTolid2)
      .input("CommercDate1", sql.VarChar(10), CommercDate1)
      .input("CommercDate2", sql.VarChar(10), CommercDate2)
      .input("FactorDate1", sql.VarChar(10), FactorDate1)
      .input("FactorDate2", sql.VarChar(10), FactorDate2)
      .input("TahvilDate1", sql.VarChar(10), TahvilDate1)
      .input("TahvilDate2", sql.VarChar(10), TahvilDate2)
      .input("ExitDate1", sql.VarChar(10), ExitDate1)
      .input("ExitDate2", sql.VarChar(10), ExitDate2)
      .input("StartGaranti1", sql.VarChar(10), StartGaranti1)
      .input("StartGaranti2", sql.VarChar(10), StartGaranti2)
      .output("msgRet", sql.NVarChar(200))
      .execute("Sale.sale.uspAmarKhodroSearchFilter");

    
    if (result.output.msgRet == "" || result.output.msgRet == null)
       {
        // statusResult: 0,
        // message: "خواندن موفق",
        userFilter = result.recordsets[0] ? result.recordsets[0][0] : []

      }
    else return {
      statusResult: 1,
      message: result.output.msgRet,
    }

  
    
    // console.log("getAmarKhodro.req.body ==>" , req.body)
    // console.log("getAmarKhodro.userFilter ==>" , userFilter.searchFilter)
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VKhodroTolid", "*", req.body.firstFilter , userFilter.searchFilter);
    let result2 = await pool.request().query(query)

    // console.log("getAmarKhodro.query==>" , query)
    

    return {
      statusResult: 0,
      rows: result2.recordsets[0],
      totalRecords: result2.recordsets[1][0].totalCount,
    }
  } catch (err) {
    console.log("err.message", err.message)
    throw (err)
  }

}

async function getAmarKhodroUIData(req) {
  try {


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('Sale.sale.uspGetAmarKhodroUIData')

    return {
      statusResult: 0,
      message: "خواندن موفق",
      commerc: result.recordsets[0],
      factor: result.recordsets[1],
      tahvil: result.recordsets[2],
      mahal: result.recordsets[3],
      class: result.recordsets[4],
      kasri: result.recordsets[5],
    };
  } catch (err) {
    console.log('err.err', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}



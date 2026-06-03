const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {
    getDavatName,
    getDavatnameData,
    //getDavatNameWithFactor,
    getNobatBandiList,
    NobatBandiDetailDelete,
    getResponDavatNamehPickList,
    getInitialChangeDavatNameh,
    primarySubmitDavatNameh,
    getTepmNobatbandiDetailList,
    TepmNobatbandiDetailDelete,
    finalSubmitDavatNameh,
}

async function getDavatName(req,res,next) {
    try {

        let UserLogin = req.privateData.UserLogin;
        var Agencyfilter = '';
        //هر نمایندگی فقط دعوتنامه خودش را ببیند
        if (UserLogin.toLowerCase().startsWith('ikd'))
           var Agencyfilter = ` IDAgencyCommission in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwDavatName','*',req.body.firstFilter, Agencyfilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult:0,
            rows:resultq.recordsets[0],
            totalRecords:resultq.recordsets[1][0].totalCount,
        };
    }catch (err) {
        console.log('err', err)
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
}

// async function getDavatNameWithFactor(req,res,next) {
//     try {

//         let UserLogin = req.privateData.UserLogin;
//         var Agencyfilter = '';
//         if (UserLogin.toLowerCase().startsWith('ikd'))
//            var Agencyfilter = ` IDAgencyCode in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

//         const pool = await pools.getPool('Sale')
//         var query=SqlCommandCreator(req.body.lazyParams,'Sale.sale.vwDavatNameWithFactor','*',req.body.firstFilter, Agencyfilter)
//         let resultq = await pool.request().query(query);
        
//         return {
//             statusResult:0,
//             rows:resultq.recordsets[0],
//             totalRecords:resultq.recordsets[1][0].totalCount,
//         };
//     }catch (err) {
//         console.log('err', err)
//         return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
//     }
// }

async function getDavatnameData(req) {
    try {

        let UserLogin = req.privateData.UserLogin;
        const pool = await pools.getPool('MIS')
        let result = await pool.request()
           // .input('nationalCode', sql.VarChar(10), userName)
            .input('idNobat', sql.Int, req.body.IdNobat)
            .execute('MIS.dbo.uspGetDavatNameData');
            //console.log('req.body.idNobat::', req.body)
        return {
            statusResult: 0,
            rows: result.recordset
        };

    } catch (err) {

        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


//////////////// صدور دعوتنامه

async function getNobatBandiList(req) {

    try {
  
      let userFilter=''
      var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VNobatbandiHt", "*", userFilter );
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

  async function NobatBandiDetailDelete(req) {
    try {
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
  
      const { IdNobat, RadifNobatBandi } = req.body;

      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input("IdNobat", sql.Int, IdNobat)
        .input("RadifNobatBandi", sql.Int, RadifNobatBandi)
        .input('UserID', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspNobatBandiDetailDelete');
  
  
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

  async function getResponDavatNamehPickList(req) {

    let userFilter='Flag>1 and Mande<>0 and id not in (select idRespon from TNobatBandiDetail)'
    try {
      var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VRespon', '*', userFilter)
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
  async function getInitialChangeDavatNameh(req) {
   
    try {

    

      const pool = await pools.getPool('Sale')
      let result = await pool.request()
      .input('IdRespon', sql.Int, req.body.IdRespon)
      .input('TedadSelect', sql.Int, req.body.TedadSelect)
        .output("msgRet", sql.NVarChar(200))
        .execute('Sale.sale.uspInitialChangeDavatnameh')
  
       
      if (result.output.msgRet == "" || result.output.msgRet == null)
        return {
          statusResult: 0,
          message: "خواندن موفق",
          mablagh: result.recordsets[0] ? result.recordsets[0][0] : [],
          TempNobatBandiRespon: result.recordsets[1] ? result.recordsets[1] : [],
          MandeQuantity: result.recordsets[2] ? result.recordsets[2][0] : [],
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
 
  async function primarySubmitDavatNameh(req) {
    try {
     
   
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input('IdRespon', sql.Int, req.body.IDRespon)
        .input('Tedad', sql.Int , req.body.TedadKhodro)
        .input('KarMozdCheqI', sql.Numeric(18,0), 0)
        .input('RialAddI', sql.Numeric(18,0) , 0)
        .input('RialSubI', sql.Numeric(18,0), 0)
        .input('SoudTadilI', sql.Numeric(18,0) , 0)
        .input('TakhfifFactorI', sql.Numeric(18,0), 0)
        .input('NumberingI', sql.Int , req.body.Numbering)
        .input('HasInsurance', sql.Int, req.body.HasInsurance)
        .input('AvarezI', sql.Int , req.body.Avarez)
        .input('Date', sql.VarChar(10), req.body.DateNobatBandi)
        .input('EndDateSoud', sql.VarChar(10) , req.body.DateMohasebeSoud)
        .input('ExpireDate', sql.VarChar(10) , req.body.ExpireDate)
        .input('RadifNobatBandi', sql.Int, 1)
        .input('Fill', sql.Int , 1) 
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspPrimarySubmitDavatNameh')
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
  async function getTepmNobatbandiDetailList(req) {

    let userFilter=''
    try {
      var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.TTempNobatbandiDetail', '*', userFilter)
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
  async function TepmNobatbandiDetailDelete(req) {
    try {
     
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        
        .execute('Sale.sale.uspTepmNobatbandiDetailDelete')
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
  async function finalSubmitDavatNameh(req) {
    try {
      
      let UserLogin = req.privateData.UserLogin;
      var clientIp = req.ip;
      const pool = await pools.getPool('Sale');
      let result = await pool
        .request()
        .input('idModel', sql.Int, req.body.idModel)
        .input('DateNobatBandi', sql.VarChar(10), req.body.DateNobatBandi)
        .input('DateMohasebeSoud', sql.VarChar(10) , req.body.DateMohasebeSoud)
        .input('ExpireDate', sql.VarChar(10) , req.body.ExpireDate)
        .input('TakhfifFactor', sql.Numeric(18,0), req.body.TakhfifFactor)
        .input('RialEzafe', sql.Numeric(18,0) , req.body.RialEzafe)
        .input('RialKasri', sql.Numeric(18,0), req.body.RialKasri)
        .input('Avarez', sql.TinyInt , req.body.Avarez)
        .input('KarmozdCheq', sql.Numeric(18,0), req.body.KarmozdCheq)
        .input('Numbering', sql.TinyInt , req.body.Numbering)
        .input('HasInsurance', sql.TinyInt, req.body.HasInsurance) 
        .input('SoudTadil', sql.Numeric(18,0) , req.body.SoudTadil)
        .input('userId', sql.VarChar(10), UserLogin)
        .input("clientIp", sql.NVarChar(50), clientIp)
        .output('msgRet', sql.NVarChar(500))
        .execute('Sale.sale.uspFinalSubmitDavatNameh')
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

  
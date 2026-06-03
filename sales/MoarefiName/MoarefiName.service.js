const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {
    getMoarefiName,
    getMoarefiNameData,
    getMoarefiNameDetail,
}

async function getMoarefiName(req,res,next) {
    try {
        let UserLogin = req.privateData.UserLogin;
        var Agencyfilter = '';
       
        if (UserLogin.toLowerCase().startsWith('ikd'))
           var Agencyfilter = ` IDAgencyCode in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.VMoarefiName','*',req.body.firstFilter, Agencyfilter)
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

async function getMoarefiNameData(req) {
    try {

        let UserLogin = req.privateData.UserLogin;
        const pool = await pools.getPool('MIS')
        let result = await pool.request()
            .input('idNobat', sql.Int, req.body.IdNobat)
            .execute('MIS.dbo.uspGetMoarefiNameData');
            //console.log('req.body.idNobat::', req.body)
        return {
            statusResult: 0,
            rows: result.recordset
        };

    } catch (err) {

        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function getMoarefiNameDetail(req,res,next) {
 
    try {
        var userFilter = req.userFilter
        const pool = await pools.getPool("Sale");
        let result = await pool.request()
          .input('IdRespon', sql.Int, req.body.IdRespon)
          .execute("sale.dbo.uspGetMoarefiNameUIData");

        return {
          statusResult: 0,
          prices: result.recordsets[0],
          details: result.recordsets[1],
        };
    
      } catch (err) {
        return {
          statusResult: 2,
          message: "خطا در برقراری ارتباط با پایگاه داده ای",
        };
      }
    }




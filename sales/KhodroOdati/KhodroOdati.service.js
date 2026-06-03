const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {
    getKhodroOdati,
    ConfirmkhodroOdati,
    // getJarimeDirKardItemsList,
    // ConfirmJarimeDirKard,
    // ConfirmJarimeDirKard,
    // EbtalJarimeDirKard,

}

async function getKhodroOdati(req,res,next) {
    try {
        let UserLogin = req.privateData.UserLogin;
        // var Agencyfilter = '';
        //هر نمایندگی فقط دعوتنامه خودش را ببیند
        // if (UserLogin.toLowerCase().startsWith('ikd'))
        //    var Agencyfilter = ` IDAgencyCode in (select IdAgency from Sale.dbo.TuserAgency where userid='${UserLogin}')`

        const pool = await pools.getPool('Sale')
        var query=SqlCommandCreator(req.body.lazyParams,'Sale.dbo.vwKhodroOdati','*',req.body.firstFilter)

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

async function ConfirmkhodroOdati(req,res,next) {
    try {
        let UserLogin = req.privateData.UserLogin;
        const pool = await pools.getPool('Sale')
        let  result = pool.request()
            .input('factorList', sql.NVarChar(sql.MAX),JSON.stringify(req.body.selectedRows))
            .input('userName', sql.VarChar(25), UserLogin)
            .execute('Sale.sale.uspConfirmKhodroOdati')
            
        return {
            statusResult:0,
            count:req.body.selectedRows.length
        };
    }catch (err) {
        console.log('err.message--Odati', err.message)
        return {statusResult:2,message:'خطا در ارسال فاکتور'}
    }
}


 




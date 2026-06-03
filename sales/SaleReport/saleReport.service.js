const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');


module.exports = {
    getFactorTahviliAmarSalMah,
    getFactorTahviliAmarSal,
    initAmarSalMah,
    getFactorReport,
    getFactorSubHazine,

}

//----------------------
async function getFactorTahviliAmarSal(req) {

    try {
        const pool = await pools.getPool('Sale')
        var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.TFactorTahviliAmarSal', '*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult: 0,
            rows: resultq.recordsets[0],
            totalRecords: resultq.recordsets[1][0].totalCount,
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
async function getFactorTahviliAmarSalMah(req) {

    try {
        const pool = await pools.getPool('Sale')
        var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.TFactorTahviliAmarSalMah', '*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult: 0,
            rows: resultq.recordsets[0],
            totalRecords: resultq.recordsets[1][0].totalCount,
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
async function initAmarSalMah(req, res) {

    try {
        const pool = await pools.getPool('Sale')
        let  result=await pool.request()
            .execute('Sale.dbo.uspInitAmarSalMah')
            return {
                statusResult:0,
                message:"    بروز رسانی با موفقیت انجام شد",
            }    

    } catch (err) {

        console.log(err.message)
        return {
            statusResult: 2,
            message: err.message
        };
    }

}
async function getFactorReport(req, res) {
    try {
        
       
        let firstFilter=req.body.firstFilter
        let tableName='sale.sale.vwFactorReport';
        var myQuery=SqlCommandCreator(req.body.lazyParams,tableName,'*' , firstFilter);
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult:0,
            rows:result.recordsets[0],
            totalRecords:result.recordsets[1][0].totalCount,
        }  
    }catch (err) {
        console.log('err.message :>> ', err.message);
        throw(err)
    }

}
async function getFactorSubHazine(req) {

    try {
        const pool = await pools.getPool('Sale')
        var query = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwFactorSubHazine', '*',req.body.firstFilter)
        let resultq = await pool.request().query(query);
        
        return {
            statusResult: 0, 
            rows: resultq.recordsets[0],
            totalRecords: resultq.recordsets[1][0].totalCount,
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

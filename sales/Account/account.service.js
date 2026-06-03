const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const {SqlCommandCreator} = require('../../_helpers/SqlCommandCreator');
module.exports = {
    getShenasePardakht,
    getShenasePardakhtUIData,
    shenasePardakhtSave,
    getRespons,
    getCustomerList,
}

async function shenasePardakhtSave(req, res, next) {
    try {
        const pool = await pools.getPool('MIS')
        let result = pool.request()
            .input('pid', sql.Int, req.body.pid)
            .execute('Sale.dbo.uspDeleteCartableInfo')
        
        return {
            statusResult: 0,
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در  ایجاد کارتابل' }
    }
}

async function getShenasePardakht(req, res, next) {
    try {
        var query = SqlCommandCreator(req.body.lazyParams, 'sale.dbo.VShenasePardakht', '*')
        const pool = await pools.getPool('Sale')
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

async function getShenasePardakhtUIData(req) {
    try {
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .execute('sale.dbo.uspgetShenasePardakhtUIData')
        
        return {
            statusResult: 0,
            message: "خواندن موفق",
            shenaseType: result.recordsets[0],
            bankBaseInfo: result.recordsets[1]
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function shenasePardakhtSave(req) {
    try {
        let obj = req.privateData;
        let UserLogin = obj.UserLogin;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('type', sql.Int, req.body.IdType)
            .input('ShenaseExpireDate', sql.VarChar(10), req.body.ShenaseExpireDate)
            .input('Amount', sql.Numeric(18, 0), req.body.Amount)
            .input('CustomerName', sql.NVarChar(50), req.body.CustomerName)
            .input('CustomerFamily', sql.NVarChar(50), req.body.CustomerFamily)
            .input('NationalCode', sql.VarChar(11), req.body.NationalCode)
            .input('Mobile', sql.VarChar(11), req.body.Mobile)
            .input('idBankBase', sql.Int, req.body.idBankBase)
            .input('ShenaseTypeId', sql.Int, req.body.ShenaseTypeId)
            .input('idCustomer', sql.Int, req.body.idCustomer)
            .input('idRespon', sql.Int, req.body.IdRespon)
            .input('idPreFactor', sql.Int, 0)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .output('Msg', sql.NVarChar(500))
            .output('ShenaseBank', sql.VarChar(17))
            .execute('sale.dbo.SPInsTShenasePardakht')
        
        if (result.output.Msg != "") {
            return {
                statusResult: 1,
                message: result.output.Msg,
            };
        }

        
        return {
            ShenaseBank: result.output.ShenaseBank,
            statusResult: 0,
            message: "ذخیره اطلاعات با موفقیت انجام شد",
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function getRespons(req, res, next) {

    try {
        var query = SqlCommandCreator(req.body.lazyParams, 'sale.dbo.VRespon', '*')
        const pool = await pools.getPool('Sale')
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

async function getCustomerList(req, res, next) {

    try {
        var query = SqlCommandCreator(req.body.lazyParams, 'sale.dbo.vcustomer', '*')
        const pool = await pools.getPool('Sale')
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
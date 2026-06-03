const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
module.exports = {
    getCustomerInfo,
    getResponInfo,
    getAgencyInfo,
    getFactorInfo,
    getInfoAll,
    getAmarTolid,
};
async function getCustomerInfo(req, res) {
    try {
        const { userName, password, nationalCode } = req.body
        if (userName == "ikcoUser12345" && password == "Ab12345!") {
            let pool = await pools.getPool('IkcoCRM')
            let result = await pool.request()
                .input('nationalCode', sql.VarChar(15), nationalCode)
                .execute('IkcoCRM.dbo.uspIkCo_GetCustomerInfo')

            return {
                rows: result.recordset,
                message: ""
            }
        }
        else {
            return {
                rows: [],
                message: "کد کاربری و یا رمز عبور اشتباه میباشد"
            }
        }
    }
    catch (error) {
    }
}

async function getResponInfo(req, res) {
    try {
        const { userName, password, IdCustomer } = req.body
        if (userName == "ikcoUser12345" && password == "Ab12345!") {
            let pool = await pools.getPool('IkcoCRM')
            let result = await pool.request()
                .input('IdCustomer', sql.VarChar(15), IdCustomer)
                .execute('IkcoCRM.dbo.uspIkCo_GetResponInfo')
            return {
                rows: result.recordset,
                message: ""
            }
        }
        else {
            return {
                rows: [],
                message: "کد کاربری و یا رمز عبور اشتباه میباشد"
            }
        }
    }
    catch (error) {
    }
}

async function getAgencyInfo(req, res) {
    try {
        const { userName, password } = req.body
        if (userName == "ikcoUser12345" && password == "Ab12345!") {
            let pool = await pools.getPool('IkcoCRM')
            let result = await pool.request()
            var query = SqlCommandCreator(req.body.lazyParams, 'IkcoCRM.dbo.crm_VAgency', '*', req.body.firstFilter)
            let resultq = await pool.request().query(query);
            return {
                statusResult: 0,
                rows: resultq.recordsets[0],
                totalRecords: resultq.recordsets[1][0].totalCount,
            };
        }
        else {
            return {
                rows: [],
                message: "کد کاربری و یا رمز عبور اشتباه میباشد"
            }
        }
    }
    catch (error) {
    }
}

async function getFactorInfo(req, res) {
    try {
        const { userName, password, ResponCode } = req.body
        if (userName == "ikcoUser12345" && password == "Ab12345!") {
            let pool = await pools.getPool('IkcoCRM')
            let result = await pool.request()
                .input('ResponCode', sql.VarChar(15), ResponCode)
                .execute('IkcoCRM.dbo.uspIkCo_GetFactorInfo')

            return {
                rows: result.recordset,
                message: ""
            }
        }
        else {
            return {
                rows: [],
                message: "کد کاربری و یا رمز عبور اشتباه میباشد"
            }
        }
    }
    catch (error) {
    }
}

async function getInfoAll(req, res) {
    try {
        // console.log('req :>> ', req.body);
        const { userName, password, NationalCode, ResponCode, ShasiNofull } = req.body
        if (userName == "ikcoUser12345" && password == "Ab12345!") {
            let pool = await pools.getPool('IkcoCRM')
            let result = await pool.request()
                .input('NationalCode', sql.VarChar(15), NationalCode)
                .input('ResponCode', sql.VarChar(15), ResponCode)
                .input('ShasiNofull', sql.VarChar(50), ShasiNofull)
                .execute('IkcoCRM.dbo.uspIkCo_GetInfoAll')

            //console.log('result.getFactorInfo :>> ', result.recordset);
            return {
                rows: result.recordset,
                message: ""
            }
        }
        else {
            return {
                rows: [],
                message: "کد کاربری و یا رمز عبور اشتباه میباشد"
            }
        }
    }
    catch (error) {
    }
}

async function getAmarTolid(req, res) {
    try {
        const { userName, password, FromDate, ToDate } = req.body
        if (userName == "ikcoUser12345" && password == "Ab12345!") {
            let pool = await pools.getPool('IkcoCRM')
            let result = await pool.request()
                .input('FromDate', sql.Char(10), FromDate)
                .input('ToDate', sql.Char(10), ToDate)
                .execute('IkcoCRM.dbo.uspAmarTolidforIkco')
            return {
                rows: result.recordset,
                message: ""
            }
        }
        else {
            return {
                rows: [],
                message: "کد کاربری و یا رمز عبور اشتباه میباشد"
            }
        }
    }
    catch (error) {
    }
}

const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const requestIp = require('request-ip');
const os = require('node:os');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const cryptoService = require('../../public/crypto/crypto.service');
module.exports = {
    getSaleProjects,
    getSaleProjectPrices,

}

const axiosConfig = {
    "async": true,
    "crossDomain": false,
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "cache-control": "no-cache",
        'Access-Control-Allow-Origin': "*",
    },
    "processData": true,
  };

async function getSaleProjects(req) {
    try {
        var userName=''
        try{
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                        userName=''
                    }
                    const privateData=cryptoService.dataDecrypt(decoded.privateData)
                    userName=privateData;
                });
            } 
        } catch (err) {
            userName=''
        }
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('nationalCode', sql.VarChar(10), userName)
            .output('msgError', sql.NVarChar(200))
            .execute('saleInternet.dbo.spGetSaleProjectsNew')
        let resultGroup = await pool.request()
            .execute('saleInternet.dbo.spGetGroup')
        return {
            msgError:result.output.msgError,
            statusResult:0,
            saleProjects:result.recordset,
            groups:resultGroup.recordset
        }
    } catch (err) {
        return {statusResult:2,message:'خطا در برقراری ارتباط با پایگاه داده ای'}
    }
    
}

async function getSaleProjectPrices(req) {
    const {first,rows,page}=req.body
     //var data=req.body.filters

    try {
        var myQuery= `SELECT * FROM Sale.sale.udfCalcSaleProjectsPrices(${req.body.IdSaleProjects},'',${req.body.NumberingCalc},${req.body.InsuranceCalc},0)`
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult:0,
            rows:result.recordsets[0],
        } 
    } catch (err) {
        return err
    }
} 


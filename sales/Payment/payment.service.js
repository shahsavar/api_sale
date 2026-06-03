const config = require('../../config.json');
const sql = require('mssql');
const pools = require('../../_helpers/pool-manegment');
const requestIp = require('request-ip');
const os = require('node:os');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const cryptoService = require('../../public/crypto/crypto.service');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
const { errorMonitor } = require('node:events');
module.exports = {

    GetMandePayment,
    GetCustomerPaymentUIData,
    getBanks,
    getBranchs,
    getPaymentSahebCheck,
    PaymentSaleInsert,
    PaymentSaleUpdate,
    PaymentSaleDelete,

    GetPaymentAll,


    ////////////////////////////////

    GetMandeRelatResponWithPayment,
    RelatResponWithPaymentInsert,
    RelatResponWithPaymentUpdate,
    RelatResponWithPaymentDelete,

    getPaymentModatDarTree,
    getPaymentModatDarDetail,
    getPaymentModatDar,
    getPaymentModatDarRespon,

    getSplitedQrCodeData,
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


async function GetMandePayment(req) {

    try {


        let firstFilter = ""
        if (req.body.firstFilter?.includes("IDCustomer ")) {
            firstFilter = req.body.firstFilter
        }
        else
            firstFilter = `idcustomer in (select idcustomer from TrelatResponWithCustomer where  idrespon = ${req.body.firstFilter}) and MandePayment>0 and IDTypePayment not in(9,10,14,15)`


        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VMandePayment', '*', firstFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        console.log('errerrerrerr', err.message)
        return err
    }
}
async function GetPaymentAll(req) {
    try {


        let firstFilter = ""
        // if(req.body.firstFilter?.includes("IDCustomer ")){
        //     firstFilter=req.body.firstFilter
        // }
        // else 
        //     firstFilter=`idcustomer in (select idcustomer from TrelatResponWithCustomer where  idrespon = ${req.body.firstFilter}) and MandePayment>0`



        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwPaymentAll', '*', firstFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {
        console.log('errerrerrerr', err.message)
        return err
    }
}

async function getPaymentSahebCheck(req) {
    const { first, rows, page } = req.body

    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VPaymentSahebCheck', '*', req.body.firstFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request()
            .query(myQuery)
        return {
            statusResult: 0,
            PaymentSahebCheck: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
        }
    } catch (err) {

        return err
    }
}



async function GetCustomerPaymentUIData(req) {
    try {
        const pool = await pools.getPool('Sale')
        let result = await pool.request()

            .input('idpayment', sql.Int, req.body.idpayment)
            .input('formType', sql.Int, req.body.formType)
            .execute('Sale.sale.uspGetCustomerPaymentUIData')

        return {
            statusResult: 0,
            message: "خواندن موفق",
            typePayments: result.recordsets[0],
            banks: result.recordsets[1],
            hessabNo: result.recordsets[2],
            customerSahebCheck: result.recordsets[3] ? result.recordsets[3][0] : '',
            Branchs: result.recordsets[4] ? result.recordsets[4][0] : '',

        };
    } catch (err) {
        throw new Error(err)
        //  return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function getBanks(req) {
    const { first, rows, page } = req.body
    //var data=req.body.filters 

    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VBank', '*', req.body.firstFilter)
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

async function getBranchs(req) {
    const { first, rows, page } = req.body

    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.sale.vwBranchOfBank', '*', req.body.firstFilter)
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

async function PaymentSaleInsert(req) {

    try {
        let UserLogin = req.privateData.UserLogin;
        var clientIp = req.ip;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('IDPayment', sql.Int, req.body.IdPayment)
            .input('IdCustomer', sql.Int, req.body.IdCustomer)
            .input('IdRespon', sql.Int, req.body.IdRespon)
            .input('Amount', sql.Numeric(19, 0), req.body.Amount)
            .input('IDTypePayment', sql.Int, req.body.IdTypePayment)
            .input('IdBank', sql.Int, req.body.IdBank.value)
            .input('Branch', sql.NVarChar(10), req.body.Branch)
            .input('RadifBank', sql.Int, req.body.RadifBank)
            .input('PreffixSerialNo', sql.NVarChar(15), req.body.PreffixSerialNo)
            .input('DocumentNo', sql.NVarChar(10), req.body.DocumentNo)
            .input('PostfixSerialNo', sql.NVarChar(10), req.body.PostfixSerialNo)
            .input('DocumentDate', sql.NVarChar(10), req.body.DocumentDate)
            .input('CalculateDate', sql.NVarChar(10), req.body.CalculateDate)
            .input('ReceiveDate', sql.NVarChar(10), req.body.ReceiveDate)
            .input('DeleteDate', sql.NVarChar(10), req.body.DeleteDate)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .input('IDUsagePayment', sql.Int, req.body.IdUsagePayment)
            .input('IDTypeVosolCheq', sql.Int, req.body.IdTypeVosolCheq)
            .input('HesabNo', sql.NVarChar(15), req.body.HesabNo)
            .input('HesabNoText', sql.NVarChar(15), req.body.HesabNoText)
            .input('EnterInPut', sql.NVarChar(1), req.body.EnterInPut)
            .input('SarResidDate', sql.NVarChar(10), req.body.SarResidDate)
            .input('IdCustomerSahebCheck', sql.Int, req.body.IdCustomerSahebCheck)
            .input('TedadCheck', sql.Int, req.body.TedadChq)
            .input('chkPreFixSerialNo', sql.Int, req.body.chkPreFixSerialNo)
            .input('chkPostFixSerialNo', sql.Int, req.body.chkPostFixSerialNo)
            .input('Mount', sql.Int, req.body.Mount)
            .input('Day', sql.Int, req.body.Day)
            .input('Comment', sql.NVarChar(500), req.body.Comment)
            .input('ShenaseSayadi4', sql.NVarChar(4), req.body.ShenaseSayadi4)
            .input('ShenaseSayadi12', sql.NVarChar(12), req.body.ShenaseSayadi12)
            .input('clientIp', sql.VarChar(50), clientIp)

            .output('Msg', sql.NVarChar(1000))
            .execute('sale.uspPaymentSaleInsert')
        if (result.output.Msg != "") {
            return {
                statusResult: 1,

                message: result.output.Msg
            };
        }
        return {
            statusResult: 0,
            message: `وجه برای مشتری ذخیره گردید`,
        };
    } catch (err) {
        console.log('err', err.message)
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

async function PaymentSaleUpdate(req) {

    try {

        let UserLogin = req.privateData.UserLogin;
        var clientIp = req.ip;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('IDPayment', sql.Int, req.body.IdPayment)
            .input('IdCustomer', sql.Int, req.body.IdCustomer)
            .input('IdRespon', sql.Int, req.body.IdRespon)
            .input('Amount', sql.Numeric(19, 0), req.body.Amount)
            .input('IDTypePayment', sql.Int, req.body.IdTypePayment)
            .input('IdBank', sql.Int, req.body.IdBank.value)
            .input('Branch', sql.NVarChar(10), req.body.Branch)
            .input('RadifBank', sql.Int, req.body.RadifBank)
            .input('PreffixSerialNo', sql.NVarChar(15), req.body.PreffixSerialNo)
            .input('DocumentNo', sql.NVarChar(25), req.body.DocumentNo)
            .input('PostfixSerialNo', sql.NVarChar(10), req.body.PostfixSerialNo)
            .input('DocumentDate', sql.NVarChar(10), req.body.DocumentDate)
            .input('CalculateDate', sql.NVarChar(10), req.body.CalculateDate)
            .input('ReceiveDate', sql.NVarChar(10), req.body.ReceiveDate)
            .input('DeleteDate', sql.NVarChar(10), req.body.DeleteDate)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .input('IDUsagePayment', sql.Int, req.body.IDUsagePayment)
            .input('IDTypeVosolCheq', sql.Int, req.body.IdTypeVosolCheq)
            .input('HesabNo', sql.NVarChar(15), req.body.HesabNo)
            .input('HesabNoText', sql.NVarChar(15), req.body.HesabNoText)
            .input('EnterInPut', sql.NVarChar(1), req.body.EnterInPut)
            .input('SarResidDate', sql.NVarChar(10), req.body.SarResidDate)
            .input('IdCustomerSahebCheck', sql.Int, req.body.IdCustomerSahebCheck)
            .input('Comment', sql.NVarChar(500), req.body.Comment)
            .input('ShenaseSayadi4', sql.NVarChar(4), req.body.ShenaseSayadi4)
            .input('ShenaseSayadi12', sql.NVarChar(12), req.body.ShenaseSayadi12)
            .input('clientIp', sql.VarChar(50), clientIp)
            .output('Msg', sql.NVarChar(1000))
            .execute('Sale.sale.uspPaymentSaleUpdate')
        if (result.output.Msg != "") {
            return {
                statusResult: 1,
                message: result.output.Msg
            };
        }
        return {
            statusResult: 0,
            message: `وجه انتخابی مشتری بروزآوری گردید`,
        };
    } catch (err) {

        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
async function PaymentSaleDelete(req) {
    try {

        let UserLogin = req.privateData.UserLogin;
        var clientIp = req.ip;
        // const { Id } = req.body
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('idPayment', sql.Int, req.body.ID)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .input('clientIp', sql.VarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(500))
            .execute('Sale.sale.uspPaymentSaleDelete')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "حذف با موفقیت انجام شد",
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
///////////////////////////////////////////////////////////////////////////////////////

async function GetMandeRelatResponWithPayment(req) {
    const { first, rows, page } = req.body
    var data = req.body.filters


    try {
        var myQuery = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VMandeRelatResponWithPayment', '*', req.body.firstFilter)
        let pool = await pools.getPool('Sale')
        let result = await pool.request().query(myQuery)
        let result2;


        if (req.body.firstFilter != undefined && req.body.firstFilter != '' && req.body.firstFilter != null) {
            var query2 = `  SELECT IDRespon,sum(Amount) AS SumAmount,SUM(AmountPayUsedFactor) AS SumAmountPayUsedFactor,SUM(AmountPayUsedEsterdad) AS SumAmountPayUsedEsterdad
                           ,SUM(AmountPayUsedTrans2OtherRespon) AS SumAmountPayUsedTrans2OtherRespon ,SUM(AmountPayUsedBardashtFromRespon) AS SumAmountPayUsedBardashtFromRespon 
                           ,SUM(AmountPayUsedTrans2OtherCompany) AS  SumAmountPayUsedTrans2OtherCompany,SUM(MandeRespon) AS SumMandeRespon
                            FROM Sale.dbo.VMandeRelatResponWithPayment WHERE ${req.body.firstFilter} GROUP BY IDRespon`


            result2 = await pool.request().query(query2)
        }

        return {
            statusResult: 0,
            rows: result.recordsets[0],
            totalRecords: result.recordsets[1][0].totalCount,
            sumRows: result2.recordsets[0][0],
        }
    } catch (err) {

        return err
    }
}


async function RelatResponWithPaymentInsert(req) {
    try {


        var clientIp = req.ip;
        let UserLogin = req.privateData.UserLogin;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('IdRespon', sql.Int, req.body.IdRespon)
            .input('IdPayment', sql.Int, req.body.IdPayment)
            .input('IdUsagePayment', sql.Int, req.body.IdUsagePayment)
            .input('Amount', sql.Numeric(18, 0), req.body.Amount)
            .input('CalculateDate', sql.NVarChar(10), req.body.CalculateDate)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .input('clientIp', sql.VarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(1000))
            .execute('sale.uspRelatResponWithPaymentInsert')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "ذخیره اطلاعات با موفقیت انجام شد",
        };
    } catch (err) {

        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
async function RelatResponWithPaymentUpdate(req) {
    try {

        var clientIp = req.ip;
        let UserLogin = req.privateData.UserLogin;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('ID', sql.Int, req.body.ID)
            .input('IdRespon', sql.Int, req.body.IdRespon)
            .input('IdPayment', sql.Int, req.body.IdPayment)
            .input('IdUsagePayment', sql.Int, req.body.IdUsagePayment)
            .input('Amount', sql.Numeric(18, 0), req.body.Amount)
            .input('CalculateDate', sql.NVarChar(10), req.body.CalculateDate)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .input('clientIp', sql.VarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(1000))
            .execute('sale.uspRelatResponWithPaymentUpdate')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "ذخیره اطلاعات با موفقیت انجام شد",
        };
    } catch (err) {
        console.log('errerrerr', err.message)
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}


async function RelatResponWithPaymentDelete(req) {
    try {

        let UserLogin = req.privateData.UserLogin;
        var clientIp = req.ip;
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('IdRelatResponWithPayment', sql.Int, req.body.ID)
            .input('UserID', sql.NVarChar(10), UserLogin)
            .input('clientIp', sql.VarChar(50), clientIp)
            .output('msgRet', sql.NVarChar(500))
            .execute('sale.uspRelatResponWithPaymentDelete')
        if (result.output.msgRet != "") {
            return {
                statusResult: 1,
                message: result.output.msgRet
            };
        }
        return {
            statusResult: 0,
            message: "حذف با موفقیت انجام شد",
        };
    } catch (err) {
        return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}
////////////////////////// وجوه جایگزین

async function getPaymentModatDarTree(req) {

    try {

        const pool = await pools.getPool('Sale');
        let result = await pool
            .request()
            .input('idPayment', sql.Int, req.body.idPayment)
            .output('msgRet', sql.NVarChar(500))
            .execute('Sale.sale.uspTreePaymentModatdar')

        if (result.output.msgRet == "" || result.output.msgRet == null)
            return {
                statusResult: 0,
                message: "خواندن موفق",
                rows: result.recordset,

            }
        else return {
            statusResult: 1,
            message: result.output.msgRet,
        }

    } catch (err) {
        console.log('err.message :>> ', err.message);
        return {
            statusResult: 2,
            message: err.message,
        };
    }

}
async function getPaymentModatDarDetail(req, res) {
    try {

        const { id } = req.body.firstParams;
        let userFilter = 'id=' + [id]
        var query = SqlCommandCreator(req.body.lazyParams, 'dbo.VPaymentTree', '*', userFilter)
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
async function getPaymentModatDar(req) {



    try {
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('idPayment', sql.Int, req.body.idPayment)
            .output("msgRet", sql.NVarChar(200))
            .execute('Sale.sale.uspTreePaymentModatdar')

        if (result.output.msgRet == "" || result.output.msgRet == null)
            return {
                statusResult: 0,
                message: "خواندن موفق",
                statusResult: 0,
                rows: result.recordsets[0],
                // totalRecords: result.recordsets[1][0].totalCount,
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
async function getPaymentModatDarRespon(req) {


    try {

     
        const pool = await pools.getPool('Sale')
        let result = await pool.request()
            .input('idRespon', sql.Int, req.body.idRespon)
            .output("msgRet", sql.NVarChar(200))
            .execute('Sale.sale.uspTreePaymentModatdarRespon')

        if (result.output.msgRet == "" || result.output.msgRet == null)
            return {
                statusResult: 0,
                message: "خواندن موفق",
                statusResult: 0,
                rows: result.recordsets[0],
                // totalRecords: result.recordsets[1][0].totalCount,
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

async function getSplitedQrCodeData(req) {
    try {
        // console.log('req.body.QrCodeData', req.body.QrCodeData)
        const pool = await pools.getPool('Sale')
        let result = await pool.request()

            .input('QrCodeData', sql.NVarChar(150), req.body.QrCodeData)
            .execute('Sale.sale.UspSplitedQrCodeData')


            // console.log('result.recordsets[0]-getSplitedQrCodeData', result.recordsets[0])
        return {
            statusResult: 0,
            message: "خواندن موفق",
            rows: result.recordsets[0],

        };
    } catch (err) {
        throw new Error(err)
        //  return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    }
}

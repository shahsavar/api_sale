const pools = require('../../_helpers/pool-manegment');
const sql = require('mssql');
const { SqlCommandCreator } = require('../../_helpers/SqlCommandCreator');
module.exports = {

  getDueDeliver,
  dueDeliverInsert,
  dueDeliverUpdate,
  dueDeliverDelete,
  changeMojavezModel,
  getModelPropertiesUIData,
  modelUpdate,
  getFactorHazinehList,
  getFactorHazinehUIData,
  getMoinPickList,
  getTafsiliPickList,
  factorHazineInsert,
  factorHazineUpdate,
  factorHazineDelete,
  getMarketList,
  marketInsert,
  marketUpdate,
  marketDelete,
  getHazinehCostList,
  hazinehCostInsert,
  hazinehCostUpdate,
  hazinehCostDelete,
  getRelatBaseUsageWithModelList,



}

////////////////////  عناوین دوره تحویل

async function getDueDeliver(req) {

  try {
    let userFilter = ''


    const pool = await pools.getPool('Sale');
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VDueDeliver", "*", userFilter);
    let result = await pool.request().query(query)

    // console.log("getAmarKhodro.query==>" , query)

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

async function dueDeliverInsert(req) {
  try {


    const { ID, Title, HeadMonth, HeadDay, TailMonth, TailDay, GroupDueDeliver } = req.body;
    let spName = "sale.uspDueDeliverInsert";
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input("ID", sql.Int, ID)
      .input("Title", sql.NVarChar(45), Title)
      .input("HeadMonth", sql.VarChar(2), HeadMonth)
      .input("HeadDay", sql.VarChar(2), HeadDay)
      .input("TailMonth", sql.VarChar(2), TailMonth)
      .input("TailDay", sql.VarChar(2), TailDay)
      .input("GroupDueDeliver", sql.Int, GroupDueDeliver)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute(spName);

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

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

async function dueDeliverUpdate(req) {
  try {

    const { ID, Title, HeadMonth, HeadDay, TailMonth, TailDay, GroupDueDeliver } = req.body;
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale');

    let result = await pool.request()
      .input("ID", sql.Int, ID)
      .input("Title", sql.NVarChar(45), Title)
      .input("HeadMonth", sql.VarChar(2), HeadMonth)
      .input("HeadDay", sql.VarChar(2), HeadDay)
      .input("TailMonth", sql.VarChar(2), TailMonth)
      .input("TailDay", sql.VarChar(2), TailDay)
      .input("GroupDueDeliver", sql.Int, GroupDueDeliver)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspDueDeliverUpdate')
    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات با موفقیت انجام شد",

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
async function dueDeliverDelete(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("ID", sql.Int, req.body.ID)
      .input("UserID", sql.VarChar(10), UserLogin)
      .input("clientIp", sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspDueDeliverDelete')

    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: 'اطلاعات شریک اصلاح گردید',
    };
  } catch (err) {

    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

////////////////////////// انواع مدل ها

async function changeMojavezModel(req) {
  try {

    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const { ID } = req.body;


    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input('ID', sql.Int, ID)
      .input('UserCode', sql.VarChar(10), UserLogin)
      .input('clientIp', sql.VarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspChangeMojavezModel')

    if (result.output.msgRet == "" || result.output.msgRet == null)
      return {
        statusResult: 0,
        message: "ذخیره اطلاعات  با موفقیت انجام شد",

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
async function getModelPropertiesUIData(req) {

  try {
    const { IDDueDeliverProg } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .execute('sale.uspGetModelPropertiesUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      codeCountry: result.recordsets[0] ? result.recordsets[0] : [],

    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
async function modelUpdate(req) {
  try {



    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('ID', sql.Int, req.body.ID)
      .input('NumberingCode', sql.VarChar(25), req.body.NumberingCode)
      .input('CylandrNo', sql.Int, req.body.CylandrNo)
      .input('MehvarNo', sql.Int, req.body.MehvarNo)
      .input('CarSystem', sql.VarChar(20), req.body.CarSystem)
      .input('Capacity', sql.VarChar(30), req.body.Capacity)
      .input('WheelNo', sql.Int, req.body.WheelNo)
      .input('CountryCode', sql.Int, req.body.CountryCode)
      .input('CarNameSanad', sql.VarChar(50), req.body.CarNameSanad)
      .input('PreNameUsage', sql.VarChar(30), req.body.PreNameUsage)
      .input('fuel', sql.VarChar(20), req.body.fuel)
      .input('CylandrVolume', sql.Int, req.body.CylandrVolume)
      .input('Years', sql.VarChar(4), req.body.Years)
      .input('Euro', sql.Char(1), req.body.Euro)
      .input("ARBAK", sql.TinyInt, req.body.ARBAK)
      .input('DPF', sql.VarChar(30), req.body.DPF)
      .input('BokhariDarja', sql.TinyInt, req.body.BokhariDarja)
      .input('Sepahtan', sql.TinyInt, req.body.Sepahtan)
      .input('Description', sql.NVarChar(500), req.body.Description)
      .input('TypeModelInOut', sql.Int, req.body.TypeModelInOut)
      .input("TaxNo", sql.VarChar(15), req.body.TaxNo)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspTModelUpdate')
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

////////////////// هزینه های مبنا فاکتور - هزینه شماره گذاری - هزینه بیمه خودرو

async function getFactorHazinehList(req) {

  try {

    const { IDModel  , IDTypeHazine} = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VFactorHazineName", "*", `IDTypeHazine=${IDTypeHazine} and IDModel=${IDModel}`);
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

async function getFactorHazinehUIData(req) {

  try {
   
    const { IDTypeHazine , IDModel } = req.body;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()
      .input("IDTypeHazine", sql.Int, IDTypeHazine)
      .input("IDModel", sql.Int, IDModel)
      .execute('sale.uspGetFactorHazinehUIData')
    return {
      statusResult: 0,
      message: "خواندن موفق",
      hazineName: result.recordsets[0] ? result.recordsets[0] : [],
      usage: result.recordsets[1] ? result.recordsets[1] : [],

    };
  } catch (err) {
    console.log("err,message", err.message)
    // return { statusResult: 2, message: 'خطا در برقراری ارتباط با پایگاه داده ای' }
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }


}
async function getMoinPickList(req, res) {
  try {

    let userFilter = ''

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.Vmoin', '*', userFilter)
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
async function getTafsiliPickList(req, res) {
  try {

    let userFilter = ''

    var query = SqlCommandCreator(req.body.lazyParams, 'Sale.dbo.VTafsili', '*', userFilter)
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

async function factorHazineInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('ID', sql.Int, 0)
      .input('Flag', sql.Int, req.body.Flag)
      .input('IDModel', sql.Int, req.body.IDModel)
      .input('IDHazinename', sql.Int, req.body.IDHazinename)
      .input('CoefficientNet', sql.Float, req.body.CoefficientNet)
      .input('ValueAmount', sql.Float, req.body.ValueAmount)
      .input('EffectiveDate', sql.VarChar(10), req.body.EffectiveDate)
      .input('ExpireDate', sql.VarChar(10), req.body.ExpireDate)
      .input('Moin', sql.Char(4), req.body.Moin)
      .input('Tafsili', sql.VarChar(26), req.body.Tafsili)
      .input('MoinOut', sql.Char(4), req.body.MoinOut)
      .input('TafsiliOut', sql.VarChar(26), req.body.TafsiliOut)
      .input('TypeModelInOut', sql.Int, req.body.TypeModelInOut)
      .input('Typepelak', sql.Int, req.body.Typepelak)
      .input('IDUsage', sql.Int, req.body.IDUsage)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspTFactorHazineInsert')
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
async function factorHazineUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;
    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('ID', sql.Int, req.body.ID)
      .input('IDModel', sql.Int, req.body.IDModel)
      .input('IDHazinename', sql.Int, req.body.IDHazinename)
      .input('CoefficientNet', sql.Float, req.body.CoefficientNet)
      .input('ValueAmount', sql.Float, req.body.ValueAmount)
      .input('EffectiveDate', sql.VarChar(10), req.body.EffectiveDate)
      .input('ExpireDate', sql.VarChar(10), req.body.ExpireDate)
      .input('Moin', sql.Char(4), req.body.Moin)
      .input('Tafsili', sql.VarChar(26), req.body.Tafsili)
      .input('MoinOut', sql.Char(4), req.body.MoinOut)
      .input('TafsiliOut', sql.VarChar(26), req.body.TafsiliOut)
      .input('TypeModelInOut', sql.Int, req.body.TypeModelInOut)
      .input('Typepelak', sql.Int, req.body.Typepelak)
      .input('IDUsage', sql.Int, req.body.IDUsage)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspTFactorHazineUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ویرایش اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function factorHazineDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { ID , Flag } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input('ID', sql.Int, ID)
      .input('Flag', sql.Int, Flag)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspTFactorHazineDelete');

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

///////////////// قیمت پیش فروش

async function getMarketList(req) {

  try {

    const { IDModel} = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VMarket", "*", `idModel=${IDModel}`);
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


async function marketInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idMarket', sql.Int, 0)
      .input('idModel', sql.Int, req.body.idModel)
      .input('idModelSub', sql.Int, req.body.idModelSub)
      .input('EffectiveDate', sql.VarChar(10), req.body.EffectiveDate)
      .input('Amount', sql.Numeric(18,0), req.body.Amount)
      .input('AmountLeasing', sql.Numeric(18,0), req.body.AmountLeasing)
      .input('KarmozdCheq', sql.Numeric(18,0), req.body.KarmozdCheq)
      .input('Priority', sql.Int, req.body.Priority)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspMarketInsert')
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
async function marketUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('idMarket', sql.Int, req.body.idMarket)
      .input('idModel', sql.Int, req.body.idModel)
      .input('idModelSub', sql.Int, req.body.idModelSub)
      .input('EffectiveDate', sql.VarChar(10), req.body.EffectiveDate)
      .input('Amount', sql.Numeric(18,0), req.body.Amount)
      .input('AmountLeasing', sql.Numeric(18,0), req.body.AmountLeasing)
      .input('KarmozdCheq', sql.Numeric(18,0), req.body.KarmozdCheq)
      .input('Priority', sql.Int, req.body.Priority)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspMarketUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ویرایش اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}

async function marketDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { idMarket } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input('idMarket', sql.Int, idMarket)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspMarketDelete');

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

/////////////// تغییرات معتبر

async function getHazinehCostList(req) {

  try {

    const { IDModel} = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VHazineCost", "*", `IdModel=${IDModel}`);
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

async function hazinehCostInsert(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('ID', sql.Int, 0)
      .input('IDModel', sql.Int, req.body.IDModel)
      .input('IDHazineName', sql.Int, req.body.IDHazineName)
      .input('Amount', sql.Float, req.body.Amount)
      .input('AccountNo', sql.VarChar(15), req.body.AccountNo)
      .input('EffectiveDate', sql.VarChar(10), req.body.EffectiveDate)
      .input('ExpireDate', sql.VarChar(10), req.body.ExpireDate)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspHazineCostInsert')
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
async function hazinehCostUpdate(req) {
  try {


    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const pool = await pools.getPool('Sale')
    let result = await pool.request()

      .input('ID', sql.Int, req.body.ID)
      .input('IDModel', sql.Int, req.body.IDModel)
      .input('IDHazineName', sql.Int, req.body.IDHazineName)
      .input('Amount', sql.Float, req.body.Amount)
      .input('AccountNo', sql.VarChar(15), req.body.AccountNo)
      .input('EffectiveDate', sql.VarChar(10), req.body.EffectiveDate)
      .input('ExpireDate', sql.VarChar(10), req.body.ExpireDate)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output('msgRet', sql.NVarChar(500))
      .execute('Sale.sale.uspHazineCostUpdate')
    if (result.output.msgRet != "") {
      return {
        statusResult: 1,
        message: result.output.msgRet
      };
    }
    return {
      statusResult: 0,
      message: "ویرایش اطلاعات  با موفقیت انجام شد",
    };
  } catch (err) {
    console.log('err.message===>', err.message)
    throw new Error('خطا در برقراری ارتباط با پایگاه داده ای')
  }
}
async function hazinehCostDelete(req) {
  try {
    let UserLogin = req.privateData.UserLogin;
    var clientIp = req.ip;

    const { ID } = req.body;
    const pool = await pools.getPool('Sale');
    let result = await pool
      .request()
      .input('ID', sql.Int, ID)
      .input('UserID', sql.VarChar(10), UserLogin)
      .input("clientIp", sql.NVarChar(50), clientIp)
      .output("msgRet", sql.NVarChar(200))
      .execute('Sale.sale.uspHazineCostDelete');

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

////////////// کاربری های مرتبط

async function getRelatBaseUsageWithModelList(req) {

  try {

    const { IDModel} = req.body.firstParams;
    var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VRelatBaseUsageWithModel", "*", `IDModel =${IDModel} AND Flag = 1`);
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

// async function getRelatBaseUsageWithModelPickList(req) {

//   try {

//     const { IDModel} = req.body.firstParams;
//     var query = SqlCommandCreator(req.body.lazyParams, "Sale.dbo.VBaseUsage", "*", `ID NOT IN ( SELECT IDBaseUsage FROM VRelatBaseUsageWithModel WHERE IDModel =${IDModel} AND Flag = 1`);
//     let pool = await pools.getPool('Sale')
//     let result = await pool.request().query(query)

//     return {
//       statusResult: 0,
//       rows: result.recordsets[0],
//       totalRecords: result.recordsets[1][0].totalCount,
//     }
//   } catch (err) {
//     console.log("err.message", err.message)
//     throw (err)
//   }

// }
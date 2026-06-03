const router = require('express').Router();

router.use('', require('./saleProjects/saleProjects.controller'));
router.use('', require('./saleProject/saleProject.controller'));
router.use('', require('./Customers/customers.controller'));
router.use('', require('./Respons/respons.controller'));
router.use('', require('./Payment/payment.controller'));
router.use('', require('./Bargashti/bargashti.controller'));
router.use('', require('./Agency/agency.controller'));
router.use('', require('./JarimeDirKard/jarimeDirkard.controller'));
router.use('', require('./SaleReport/saleReport.controller'));
router.use('', require('./DavatName/DavatName.controller'));
router.use('', require('./Pelak/Pelak.controller'));
router.use('', require('./PreFactor/prefactor.controller'));
router.use('', require('./SaleReport/saleReport.controller'));
router.use('', require('./LinkPardakht/linkpardakht.controller'));
router.use('', require('./MoarefiName/MoarefiName.controller'));
router.use('/account', require('./Account/account.controller'));
router.use('/daraee', require('./daraee/daraee.controller'));
router.use('/KhodroOdati', require('./KhodroOdati/KhodroOdati.controller'));
router.use('', require('./Factor/Factor.controller'));
router.use('', require('./Khodro/khodro.controller'));
router.use('', require('./BaseInfo/baseInfo.controller'));
router.use('', require('./Queue/queue.controller'));
module.exports= router;



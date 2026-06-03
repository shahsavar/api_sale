const express = require('express');
const router = express.Router();
const myService = require('./respons.service');
const auth = require('../../_helpers/auth')
const captcha = require('../../_helpers/captcha')
// routes
router.post('/getRespons', auth ,getRespons);   
router.post('/getResponUIData', auth ,getResponUIData); 
router.post('/getResponExtraUIData', auth ,getResponExtraUIData); 

router.post('/getSaleProjectsForRespon', auth ,getSaleProjectsForRespon); 
router.post('/getResponRadifNo', auth ,getResponRadifNo);
router.post('/getColorOrder', auth ,getColorOrder);  
router.post('/getUsageOrder', auth ,getUsageOrder);  
router.post('/ResponInsert', auth ,responInsert);  
router.post('/ResponDelete', auth, responDelete); 
router.post('/ResponUpdate', auth, responUpdate); 


router.post('/getRelatResponWithCustomer', auth, getRelatResponWithCustomer); 
router.post('/getResponWithCustomerUIData', auth, getResponWithCustomerUIData); 
router.post('/ResponWithCustomerInsert', auth, responWithCustomerInsert); 
router.post('/ResponWithCustomerUpdate', auth, responWithCustomerUpdate); 
router.post('/ResponWithCustomerDelete', auth, responWithCustomerDelete); 

router.post('/SetForResponOwner', auth, setForResponOwner); 
router.post('/SetForResponNumbering', auth, setForResponNumbering); 
router.post('/SetForResponPartner', auth, setForResponPartner); 
router.post('/setActiveCustomer', auth, setActiveCustomer); 

router.post('/PrintRespon', auth, PrintRespon);
router.post('/checkAllowPrintRespon', auth, checkAllowPrintRespon);

router.post('/getTarhinPrintData', auth ,getTarhinPrintData);
router.post('/getResponsIsFactorForHoghughiCustomers', auth ,getResponsIsFactorForHoghughiCustomers); 
router.post('/transferSaleData', auth, transferSaleData);

router.post('/getEsterdadResponList', auth, getEsterdadResponList);
router.post('/getEsterdadExtraData', auth, getEsterdadExtraData);
router.post('/EsterdadResponInsert', auth, EsterdadResponInsert);
router.post('/EsterdadResponUpdate', auth, EsterdadResponUpdate);
router.post('/EsterdadResponDelete', auth, EsterdadResponDelete);
router.post('/getMablaghEsterdadExtra', auth, getMablaghEsterdadExtra);
router.post('/getEsterdadMablaghList', auth, getEsterdadMablaghList);
router.post('/getPayUsedEsterdadList', auth, getPayUsedEsterdadList);
router.post('/PayUsedEsterdadKoliInsert', auth, PayUsedEsterdadKoliInsert);
router.post('/PayUsedEsterdadInsert', auth, PayUsedEsterdadInsert);
router.post('/PayUsedEsterdadDelete', auth, PayUsedEsterdadDelete);
router.post('/EsterdadResponErsalMali', auth, EsterdadResponErsalMali);
router.post('/getEsterdadPrintData', auth, getEsterdadPrintData);
router.post('/getEsterdadReportList', auth, getEsterdadReportList);
router.post('/getResponPassedAllCheck', auth, getResponPassedAllCheck);
router.post('/ConfirmCustomerAccountEsterdad', auth, ConfirmCustomerAccountEsterdad);
router.post('/responChangeState', auth, responChangeState);
router.post('/getResponChangeUIData', auth, getResponChangeUIData);
router.post('/getResponChangeList', auth, getResponChangeList);
router.post('/getPaymentChangeModel', auth, getPaymentChangeModel);
router.post('/getExtraChangeModelFormData', auth, getExtraChangeModelFormData);
router.post('/getImportResponListError', auth, getImportResponListError);
router.post('/getModelCodePickList', auth, getModelCodePickList);
router.post('/responChangeModelInsert', auth, responChangeModelInsert);
router.post('/getPaymentUsedChangeModel', auth, getPaymentUsedChangeModel);
router.post('/responChangeModelDelete', auth, responChangeModelDelete);
router.post('/getResponChangeHazineh', auth, getResponChangeHazineh);
router.post('/paymentUsedChangeModelInsert', auth, paymentUsedChangeModelInsert);
router.post('/getDefaultResponWithCustomer', auth, getDefaultResponWithCustomer);
router.post('/paymentUsedChangeModelDelete', auth, paymentUsedChangeModelDelete);
router.post('/ResponChangeModelErsalMali', auth, ResponChangeModelErsalMali);
router.post('/getVDetailRename', auth, getVDetailRename);
router.post('/responMasterReNameInsert', auth, responMasterReNameInsert);
router.post('/getResponChangeNameUIData', auth, getResponChangeNameUIData);
router.post('/getResponChangeNameHazineh', auth, getResponChangeNameHazineh);
router.post('/responMasterReNameUpdate', auth, responMasterReNameUpdate);
router.post('/responMasterReNameDelete', auth, responMasterReNameDelete);
router.post('/getPaymentChangeName', auth, getPaymentChangeName);
router.post('/getPaymentUsedChangeName', auth, getPaymentUsedChangeName);
router.post('/paymentUsedChangeNameInsert', auth, paymentUsedChangeNameInsert);
router.post('/paymentUsedChangeNameDelete', auth, paymentUsedChangeNameDelete);
router.post('/responChangeDetailRenameInsert', auth, responChangeDetailRenameInsert);
router.post('/responChangeDetailRenameUpdate', auth, responChangeDetailRenameUpdate);
router.post('/responChangeDetailRenameDelete', auth, responChangeDetailRenameDelete);
router.post('/responTaeenOwnerReName', auth, responTaeenOwnerReName);
router.post('/responTaeenPartnerReName', auth, responTaeenPartnerReName);
router.post('/responTaeenNumberingReName', auth, responTaeenNumberingReName);
router.post('/ResponChangeNameErsalMali', auth, ResponChangeNameErsalMali);
router.post('/getTazminRespon', auth, getTazminRespon);
router.post('/getTazminResponExtraData', auth, getTazminResponExtraData);
router.post('/getChangeNamePrintUIData', auth, getChangeNamePrintUIData);
router.post('/getChangeModelPrintUIData', auth, getChangeModelPrintUIData);
router.post('/getTypeTazminList', auth, getTypeTazminList);
router.post('/GetMandePaymentZemanat', auth, GetMandePaymentZemanat);
router.post('/GetMahzarList', auth, GetMahzarList);
router.post('/RelatTypeTazaminWithResponInsert', auth, RelatTypeTazaminWithResponInsert);
router.post('/RelatTypeTazaminWithResponUpdate', auth, RelatTypeTazaminWithResponUpdate);
router.post('/RelatTypeTazaminWithResponDelete', auth, RelatTypeTazaminWithResponDelete);
router.post('/getFactorTazamin', auth, getFactorTazamin);
router.post('/GetResponFactorList', auth, GetResponFactorList);
router.post('/FactorTazaminInsert', auth, FactorTazaminInsert);
router.post('/FactorTazaminUpdate', auth, FactorTazaminUpdate);
router.post('/FactorTazaminEbtalOdat', auth, FactorTazaminEbtalOdat);
router.post('/getChangesResponList', auth, getChangesResponList);
router.post('/getTrans2otherCompanyList', auth, getTrans2otherCompanyList);
router.post('/getResponPickList', auth, getResponPickList);
router.post('/getFactorPickList', auth, getFactorPickList);
router.post('/orderTrans2OtherCompanyInsert', auth, orderTrans2OtherCompanyInsert);
router.post('/getMandePayUsedTrans2OtherCompany', auth, getMandePayUsedTrans2OtherCompany);
router.post('/orderTrans2OtherCompanyUpdate', auth, orderTrans2OtherCompanyUpdate);
router.post('/orderTrans2OtherCompanyDelete', auth, orderTrans2OtherCompanyDelete);
router.post('/getPaymentTrans2otherCompany', auth, getPaymentTrans2otherCompany);
router.post('/getPaymentUsedTrans2OtherCompany', auth, getPaymentUsedTrans2OtherCompany);
router.post('/responPayUsedTrans2OtherCompanyInsert', auth, responPayUsedTrans2OtherCompanyInsert);
router.post('/getSoudTrans2otherCompany', auth, getSoudTrans2otherCompany);
router.post('/responPayUsedTrans2OtherCompanyDelete', auth, responPayUsedTrans2OtherCompanyDelete);
router.post('/orderTrans2OtherCompanyErsalMali', auth, orderTrans2OtherCompanyErsalMali);
router.post('/getFactorSubHazineOtherCompanyList', auth, getFactorSubHazineOtherCompanyList);
router.post('/getTrans2otherCompanyPrintUIData', auth, getTrans2otherCompanyPrintUIData);
router.post('/getResponPaymentBardashtVajhList', auth, getResponPaymentBardashtVajhList);
router.post('/getResponBardashtVajhUIData', auth, getResponBardashtVajhUIData);
router.post('/getResponSoud', auth, getResponSoud);
router.post('/orderResponTrans2OtherResponInsert', auth, orderResponTrans2OtherResponInsert);
router.post('/orderResponTrans2OtherResponUpdate', auth, orderResponTrans2OtherResponUpdate);
router.post('/orderResponTrans2OtherResponDelete', auth, orderResponTrans2OtherResponDelete);
router.post('/orderResponTrans2OtherResponErsalMali', auth, orderResponTrans2OtherResponErsalMali);
router.post('/getPaymentResponBardashtVajh', auth, getPaymentResponBardashtVajh);
router.post('/getSoudResponTrans2OtherRespon', auth, getSoudResponTrans2OtherRespon);
router.post('/responPayUsedTrans2OtherResponInsert', auth, responPayUsedTrans2OtherResponInsert);
router.post('/getPaymentUsedTrans2OtherRespon', auth, getPaymentUsedTrans2OtherRespon);
router.post('/paymentUsedTrans2OtherResponDelete', auth, paymentUsedTrans2OtherResponDelete);
router.post('/getTrans2OtherResponPrintUIData', auth, getTrans2OtherResponPrintUIData);
router.post('/getResponEkhtarList', auth, getResponEkhtarList);
router.post('/getResponEkhtarUIData', auth, getResponEkhtarUIData);
router.post('/responEkhtarInsert', auth, responEkhtarInsert);
router.post('/ResponEkhtarUpdate', auth, ResponEkhtarUpdate);
router.post('/responEkhtarDelete', auth, responEkhtarDelete);
router.post('/getReportResponEkhtarList', auth, getReportResponEkhtarList);


module.exports = router;

    function getRespons(req, res, next) {

        myService.getRespons(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getResponUIData(req, res, next) {
        myService.getResponUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getResponExtraUIData(req, res, next) {
        myService.getResponExtraUIData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
    function getSaleProjectsForRespon(req, res, next) {
        myService.getSaleProjectsForRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getResponRadifNo(req, res, next) {
        myService.getResponRadifNo(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getColorOrder(req, res, next) {
        myService.getColorOrder(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getUsageOrder(req, res, next) {
        myService.getUsageOrder(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responInsert(req, res, next) {
        myService.responInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responDelete(req, res, next) {
        myService.responDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responUpdate(req, res, next) {
        myService.responUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getRelatResponWithCustomer(req, res, next) {
        myService.getRelatResponWithCustomer(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getResponWithCustomerUIData(req, res, next) {
        myService.getResponWithCustomerUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responWithCustomerInsert(req, res, next) {
        myService.responWithCustomerInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responWithCustomerUpdate(req, res, next) {
        myService.responWithCustomerUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function responWithCustomerDelete(req, res, next) {
        myService.responWithCustomerDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function setForResponOwner(req, res, next) {
        myService.setForResponOwner(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function setForResponNumbering(req, res, next) {
        myService.setForResponNumbering(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function setForResponPartner(req, res, next) {
        myService.setForResponPartner(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function setActiveCustomer(req, res, next) {
        myService.setActiveCustomer(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function PrintRespon(req, res, next) {
        myService.printRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getTarhinPrintData(req, res, next) {
        myService.getTarhinPrintData(req)
        .then(user => res.json(user))
        .catch(err => next(err));
    }
 
    function getResponsIsFactorForHoghughiCustomers(req, res, next) {

        myService.getResponsIsFactorForHoghughiCustomers(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    
    function transferSaleData(req, res, next) {
        myService.transferSaleData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function checkAllowPrintRespon(req, res, next) {
        myService.checkAllowPrintRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    

    function getEsterdadResponList(req, res, next) {
        myService.getEsterdadResponList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getEsterdadExtraData(req, res, next) {
        myService.getEsterdadExtraData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function EsterdadResponInsert(req, res, next) {
        myService.EsterdadResponInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function EsterdadResponUpdate(req, res, next) {
        myService.EsterdadResponUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function EsterdadResponDelete(req, res, next) {
        myService.EsterdadResponDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getMablaghEsterdadExtra(req, res, next) {
        myService.getMablaghEsterdadExtra(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getEsterdadMablaghList(req, res, next) {
        myService.getEsterdadMablaghList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getPayUsedEsterdadList(req, res, next) {
        myService.getPayUsedEsterdadList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function PayUsedEsterdadKoliInsert(req, res, next) {
        myService.PayUsedEsterdadKoliInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function PayUsedEsterdadInsert(req, res, next) {
        myService.PayUsedEsterdadInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function PayUsedEsterdadDelete(req, res, next) {
        myService.PayUsedEsterdadDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function EsterdadResponErsalMali(req, res, next) {
        myService.EsterdadResponErsalMali(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getEsterdadPrintData(req, res, next) {
        myService.getEsterdadPrintData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getEsterdadReportList(req, res, next) {
        myService.getEsterdadReportList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponPassedAllCheck(req, res, next) {
        myService.getResponPassedAllCheck(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function ConfirmCustomerAccountEsterdad(req, res, next) {
        myService.ConfirmCustomerAccountEsterdad(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
   
    function responChangeState(req, res, next) {
        myService.responChangeState(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponChangeUIData(req, res, next) {
        myService.getResponChangeUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponChangeList(req, res, next) {
        myService.getResponChangeList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getPaymentChangeModel(req, res, next) {
        myService.getPaymentChangeModel(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getExtraChangeModelFormData(req, res, next) {
        myService.getExtraChangeModelFormData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getImportResponListError(req, res, next) {
        myService.getImportResponListError(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
   
    function getModelCodePickList(req, res, next) {
        myService.getModelCodePickList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responChangeModelInsert(req, res, next) {
        myService.responChangeModelInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getPaymentUsedChangeModel(req, res, next) {
        myService.getPaymentUsedChangeModel(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
   

    function responChangeModelDelete(req, res, next) {
        myService.responChangeModelDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getResponChangeHazineh(req, res, next) {
        myService.getResponChangeHazineh(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function paymentUsedChangeModelInsert(req, res, next) {
        myService.paymentUsedChangeModelInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getDefaultResponWithCustomer(req, res, next) {
        myService.getDefaultResponWithCustomer(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function paymentUsedChangeModelDelete(req, res, next) {
        myService.paymentUsedChangeModelDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function ResponChangeModelErsalMali(req, res, next) {
        myService.ResponChangeModelErsalMali(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
  

    function getVDetailRename(req, res, next) {
        myService.getVDetailRename(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
      
    function responMasterReNameInsert(req, res, next) {
        myService.responMasterReNameInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponChangeNameUIData(req, res, next) {
        myService.getResponChangeNameUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getResponChangeNameHazineh(req, res, next) {
        myService.getResponChangeNameHazineh(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responMasterReNameUpdate(req, res, next) {
        myService.responMasterReNameUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responMasterReNameDelete(req, res, next) {
        myService.responMasterReNameDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
     
    function getPaymentChangeName(req, res, next) {
        myService.getPaymentChangeName(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
     
    function getPaymentUsedChangeName(req, res, next) {
        myService.getPaymentUsedChangeName(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function paymentUsedChangeNameInsert(req, res, next) {
        myService.paymentUsedChangeNameInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function paymentUsedChangeNameDelete(req, res, next) {
        myService.paymentUsedChangeNameDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function responChangeDetailRenameInsert(req, res, next) {
        myService.responChangeDetailRenameInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function responChangeDetailRenameUpdate(req, res, next) {
        myService.responChangeDetailRenameUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function responChangeDetailRenameDelete(req, res, next) {
        myService.responChangeDetailRenameDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responTaeenOwnerReName(req, res, next) {
        myService.responTaeenOwnerReName(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responTaeenPartnerReName(req, res, next) {
        myService.responTaeenPartnerReName(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function responTaeenNumberingReName(req, res, next) {
        myService.responTaeenNumberingReName(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function ResponChangeNameErsalMali(req, res, next) {
        myService.ResponChangeNameErsalMali(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getTazminRespon(req, res, next) {
        myService.getTazminRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getTazminResponExtraData(req, res, next) {
        myService.getTazminResponExtraData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getChangeNamePrintUIData(req, res, next) {
        myService.getChangeNamePrintUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getChangeModelPrintUIData(req, res, next) {
        myService.getChangeModelPrintUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getTypeTazminList(req, res, next) {
        myService.getTypeTazminList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function GetMandePaymentZemanat(req, res, next) {
        myService.GetMandePaymentZemanat(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function GetMahzarList(req, res, next) {
        myService.GetMahzarList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function RelatTypeTazaminWithResponInsert(req, res, next) {
        myService.RelatTypeTazaminWithResponInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function RelatTypeTazaminWithResponUpdate(req, res, next) {
        myService.RelatTypeTazaminWithResponUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function RelatTypeTazaminWithResponDelete(req, res, next) {
        myService.RelatTypeTazaminWithResponDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getFactorTazamin(req, res, next) {
        myService.getFactorTazamin(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function GetResponFactorList(req, res, next) {
        myService.GetResponFactorList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function FactorTazaminInsert(req, res, next) {
        myService.FactorTazaminInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function FactorTazaminUpdate(req, res, next) {
        myService.FactorTazaminUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function FactorTazaminEbtalOdat(req, res, next) {
        myService.FactorTazaminEbtalOdat(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getChangesResponList(req, res, next) {
        myService.getChangesResponList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getTrans2otherCompanyList(req, res, next) {
        myService.getTrans2otherCompanyList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponPickList(req, res, next) {
        myService.getResponPickList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    } 
    function getFactorPickList(req, res, next) {
        myService.getFactorPickList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    } 
    function orderTrans2OtherCompanyInsert(req, res, next) {
        myService.orderTrans2OtherCompanyInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    } 
    function getMandePayUsedTrans2OtherCompany(req, res, next) {
        myService.getMandePayUsedTrans2OtherCompany(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    } 
    function orderTrans2OtherCompanyUpdate(req, res, next) {
        myService.orderTrans2OtherCompanyUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    } 
    function orderTrans2OtherCompanyDelete(req, res, next) {
        myService.orderTrans2OtherCompanyDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    } 
    function getPaymentTrans2otherCompany(req, res, next) {
        myService.getPaymentTrans2otherCompany(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getPaymentUsedTrans2OtherCompany(req, res, next) {
        myService.getPaymentUsedTrans2OtherCompany(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responPayUsedTrans2OtherCompanyInsert(req, res, next) {
        myService.responPayUsedTrans2OtherCompanyInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getSoudTrans2otherCompany(req, res, next) {
        myService.getSoudTrans2otherCompany(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responPayUsedTrans2OtherCompanyDelete(req, res, next) {
        myService.responPayUsedTrans2OtherCompanyDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function orderTrans2OtherCompanyErsalMali(req, res, next) {
        myService.orderTrans2OtherCompanyErsalMali(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getFactorSubHazineOtherCompanyList(req, res, next) {
        myService.getFactorSubHazineOtherCompanyList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getTrans2otherCompanyPrintUIData(req, res, next) {
        myService.getTrans2otherCompanyPrintUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getResponPaymentBardashtVajhList(req, res, next) {
        myService.getResponPaymentBardashtVajhList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponBardashtVajhUIData(req, res, next) {
        myService.getResponBardashtVajhUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponSoud(req, res, next) {
        myService.getResponSoud(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
  
    function orderResponTrans2OtherResponInsert(req, res, next) {
        myService.orderResponTrans2OtherResponInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function orderResponTrans2OtherResponUpdate(req, res, next) {
        myService.orderResponTrans2OtherResponUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function orderResponTrans2OtherResponDelete(req, res, next) {
        myService.orderResponTrans2OtherResponDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function orderResponTrans2OtherResponErsalMali(req, res, next) {
        myService.orderResponTrans2OtherResponErsalMali(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getPaymentResponBardashtVajh(req, res, next) {
        myService.getPaymentResponBardashtVajh(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function getSoudResponTrans2OtherRespon(req, res, next) {
        myService.getSoudResponTrans2OtherRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responPayUsedTrans2OtherResponInsert(req, res, next) {
        myService.responPayUsedTrans2OtherResponInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }

    function getPaymentUsedTrans2OtherRespon(req, res, next) {
        myService.getPaymentUsedTrans2OtherRespon(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function paymentUsedTrans2OtherResponDelete(req, res, next) {
        myService.paymentUsedTrans2OtherResponDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getTrans2OtherResponPrintUIData(req, res, next) {
        myService.getTrans2OtherResponPrintUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponEkhtarList(req, res, next) {
        myService.getResponEkhtarList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getResponEkhtarUIData(req, res, next) {
        myService.getResponEkhtarUIData(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function responEkhtarInsert(req, res, next) {
        myService.responEkhtarInsert(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function ResponEkhtarUpdate(req, res, next) {
        myService.ResponEkhtarUpdate(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    function responEkhtarDelete(req, res, next) {
        myService.responEkhtarDelete(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    function getReportResponEkhtarList(req, res, next) {
        myService.getReportResponEkhtarList(req)
        .then(data => res.json(data))
        .catch(err => next(err));
    }
     
    
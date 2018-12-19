import * as _ from 'lodash';

const ROUTEMAIN = {
    'HEL-DUPBR': {
        'main': 'duplicateBirthReg',
        'type': 'duplicateBirthReg'
    },
    'HEL-DUPDR': {
        'main': 'duplicateDeathReg',
        'type': 'duplicateDeathReg'
    },
    'HEL-NRCBR': {
        'main': 'NRCBirth',
        'type': 'NRCBirth'
    },
    'HEL-NRCDR': {
        'main': 'NRCDeath',
        'type': 'NRCDeath'
    },
    'HEL-CR': {
        'main': 'cremationReg',
        'type': 'cremationReg'
    },
    'HEL-BCR': {
        'main': 'birthCorrectionReg',
        'type': 'birthCorrectionReg'
    },
    'HEL-DCR': {
        'main': 'deathCorrectionReg',
        'type': 'deathCorrectionReg'
    },
    'HEL-MR': {
        'main': 'marriageReg',
        'type': 'marriageReg',
    },
    'HEL-DUPMR': {
        'main': 'duplicateMarriageReg',
        'type': 'duplicateMarriageReg',
    },
    'FS-AARO': {
        'main': 'FSAarogyaParvanoNoc',
        'type': 'FSAarogyaParvanoNoc'
    },
    'FS-PROVI': {
        'main': 'provisionalFireNoc',
        'type': 'provisionalFireNoc'
    },
    'FS-FINAL': {
        'main': 'finalFireNoc',
        'type': 'finalFireNoc'
    },
    'FS-REN': {
        'main': 'renewalFireNoc',
        'type': 'renewalFireNoc'
    },
    'FS-WATER': {
        'main': 'FSWaterTanker',
        'type': 'FSWaterTanker'
    },
    'FS-AMBU': {
        'main': 'FSAmbulance',
        'type': 'FSAmbulance'
    },
    'FS-BODY': {
        'main': 'deadBodyWan',
        'type': 'deadBodyWan'
    },
    'FS-TEMPSTRUCT': {
        'main': 'temporaryStructureNoc',
        'type': 'temporaryStructureNoc'
    },
    'FS-FIREWORKSHOP': {
        'main': 'temporaryFireworkShopNoc',
        'type': 'temporaryFireworkShopNoc'
    },
    'FS-GAS': {
        'main': 'gasConnectionNoc',
        'type': 'gasConnectionNoc'
    },
    'FS-ELE': {
        'main': 'electricConnectionNoc',
        'type': 'electricConnectionNoc'
    },
    'FS-NAV': {
        'main': 'navratriNoc',
        'type': 'navratriNoc'
    },
    'FS-REVISED': {
        'main': 'revisedFireNoc',
        'type': 'revisedFireNoc'
    },
    'SHOP-LIC': {
        'main': 'shopLicense',
        'type': 'shopLicense'
    },
    'SHOP-CAN': {
        'main': 'shopLicenseCancellation',
        'type': 'shopLicenseCancellation'
    },
    'SHOP-DUP': {
        'main': 'duplicateShopLicense',
        'type': 'duplicateShopLicense'
    },
    'SHOP-REN': {
        'main': 'shopRenwalLic',
        'type': 'shopRenwalLic'
    },
    'SHOP-TRAF': {
        'main': 'shopTransferLicense',
        'type': 'shopTransferLicense'
    },
    'MF-LIC': {
        'main': 'MFLicense',
        'type': 'MFLicense'
    },
    'MF-REN': {
        'main': 'MFRenewal',
        'type': 'MFRenewal'
    },
    'MF-CAN': {
        'main': 'MFCancellation',
        'type': 'MFCancellation'
    },
    'MF-TRA': {
        'main': 'MFTransfer',
        'type': 'MFTransfer'
    },
    'MF-DUP': {
        'main': 'MFDuplicate',
        'type': 'MFDuplicate'
    },
    'APL-LIC': {
        'main': 'APLicense',
        'type': 'APLicense'
    },
    'APL-REN': {
        'main': 'APLRenewal',
        'type': 'APLRenewal'
    },
    'APL-CAN': {
        'main': 'APLCancellation',
        'type': 'APLCancellation'
    },
    'APL-TRA': {
        'main': 'APLTransfer',
        'type': 'APLTransfer'
    },
    'APL-DUP': {
        'main': 'APLDuplication',
        'type': 'APLDuplication'
    },
    'PRO-ASS': {
        'main': 'propertyAssessment',
        'type': 'propertyAssessment'
    },
    'PRO-EXT': {
        'main': 'extractOfProperty',
        'type': 'extractOfProperty'
    },
    'PRO-TRAN': {
        'main': 'transferOfProperty',
        'type': 'transferOfProperty'
    },
    'PRO-DUP': {
        'main': 'duplicateBill',
        'type': 'duplicateBill'
    },
    'PRO-NDU': {
        'main': 'noDueCertificate',
        'type': 'noDueCertificate'
    },
    'PRO-REASS': {
        'main': 'propertyReassessment',
        'type': 'propertyReassessment'
    },
    'PRO-SPLI': {
        'main': 'splittingOfProperty',
        'type': 'splittingOfProperty'
    },
    'PRO-VAC': {
        'main': 'vacantPremisesCertificate',
        'type': 'vacantPremisesCertificate'
    },
    'PRO-ASSCER': {
        'main': 'assessmentCertificate',
        'type': 'assessmentCertificate'
    },
    'FL': {
        'main': 'foodlicence',
        'type': 'foodLicence'
    },
    'FL-REN': {
        'main': 'foodLicenceRenewal',
        'type': 'foodLicenceRenewal'
    },
    'FL-MODIFY': {
        'main': 'foodLicenceModify',
        'type': 'foodLicenceModify'
    },
    'FL-DUP': {
        'main': 'foodLicenceDuplicate',
        'type': 'foodLicenceDuplicate'
    },
    'CITIZENAUTHLOGIN': {
        'main': 'login',
        'type': 'authorize'
    },
    'CITIZENAUTHSIGNUP': {
        'main': 'signup',
        'type': 'register'
    },
    'CITIZENAUTHVERIFY': {
        'main': 'user-verify',
        'type': 'verifyAccount'
    },
    'CITIZENAUTHFORGOTPASS': {
        'main': 'forgot-password',
        'type': 'forgetPassword'
    },
    'CITIZENAUTHRESETPASS': {
        'main': 'reset-password',
        'type': 'resetPassword'
    },
    'CITIZENDASHBOARD': {
        'main': 'dashboard',
        'type': 'dashboard'
    },
    'CITIZENMYAPPS': {
        'main': 'my-applications',
        'type': 'myApps'
    },
    'CITIZENMYTRANSACTIONS': {
        'main': 'my-transactions',
        'type': 'myPayments'
    },
    'CITIZENMYPROFILE': {
        'main': 'my-profile',
        'type': 'profile'
    },
    'CITIZENMYRESOURCE': {
        'main': 'my-resource',
        'type': 'myResources'
    },
    'CITIZENAUTHLOGINTHROUGHADMIN': {
        'main': 'login-through-admin',
        'type': 'login-through-admin'
    },
    'CITIZENPAYABLESERVICES': {
        'main': 'payable-services',
        'type': ''
    },
    'TOWNHALL': {
        'main': 'town-hall',
        'type': 'townhall'
    },
    'BAND': {
        'main': 'band',
        'type': 'band'
    },
    'BANDBOOKINGLIST': {
        'main': 'list',
        'type': ''
    },
    'TOWNHALLLIST': {
        'main': 'list',
        'type': ''
    },
    'TOWNHALLBOOK': {
        'main': 'book',
        'type': ''
    },
    'STADIUM': {
        'main': 'stadium',
        'type': 'stadium'
    },
    'STADIUMLIST': {
        'main': 'stadium-list',
        'type': ''
    },
    'STADIUMBOOK': {
        'main': 'book-stadium',
        'type': ''
    },
    'THEATER': {
        'main': 'theater',
        'type': 'amphiTheater'
    },
    'THEATERLIST': {
        'main': 'theater-list',
        'type': ''
    },
    'THEATERBOOK': {
        'main': 'book',
        'type': ''
    },
    'THEATERBOOKINGSTATUS': {
        'main': 'booking-status',
        'type': ''
    },
    'GUESTHOUSE': {
        'main': 'guest-house',
        'type': 'guesthouse'
    },
    'GUESTHOUSELIST': {
        'main': 'guest-house-list',
        'type': ''
    },
    'CANCELBOOKING': {
        'main': 'cancel-booking',
        'type': ''
    },
    'SLOTBOOKING': {
        'main': 'slot-booking',
        'type': ''
    },
    'PEC_REG': {
        'main': 'pec-registration',
        'type': 'pecForm'
    },
    'PRC_REG': {
        'main': 'prc-registration',
        'type': 'prcForm'
    },

    /* hospital routing configuration start*/
    'HOSPITALDASHBOARD': {
        'main': 'dashboard',
        'type': 'dashboard'
    },
    'HEL-BR': {
        'main': 'birthReg',
        'type': 'birthReg'
    },
    'HEL-DR': {
        'main': 'deathReg',
        'type': 'deathReg'
    },
    'HEL-SB': {
        'main': 'stillBirthReg',
        'type': 'stillBirthReg'
    },
    'HOSPITALMYAPPS': {
        'main': 'my-applications',
        'type': 'myApps'
    },

    'PAYMENTGATEWAYRESPONSE': {
        'main': 'payment-gateway-response',
        'type': ''
    },

}

const ROUTEPREFIX = {

    /** citizen module routes configuretion - start */

    'CITIZENMODULE': 'citizen',

    /** start - citizen auth module routes configuretion */
    'CITIZENAUTHMODULE': 'auth',
    /** end - citizen auth module routes configuretion */

    /** start - citizen booking module routes configuretion */
    'BOOKINGMODULE': 'booking',

    /** start - citizen inner-booking modules routes configuretion */
    'BANDMODULE': 'band',
    'GARDENMODULE': 'garden',
    'GUESTHOUSEMODULE': 'guest-house',
    'PLANETAREAMODULE': 'planet-area',
    'STADIUMMODULE': 'stadium',
    'SWIMMINGMODULE': 'swimming',
    'THEATERMODULE': 'theater',
    'TOWNHALLMODULE': 'town-hall',
    'ZOOMODULE': 'zoo',
    /** end - citizen innner-booking modules routes configuretion */

    /** end - citizen booking module routes configuretion */

    'CERTIFICATESMODULE': 'certificates',

    /** start - citizen innner-booking modules routes configuretion */
    'BIRTHANDDEATHMODULE': 'birth-death',
    'MARRIAGEMODULE': 'marriage',
    /** end - citizen innner-booking modules routes configuretion */

    'FIREFACILITIESMODULE': 'fire-facilities',
    'GRIEVANCEMODULE': 'grievance',
    'LICENCEMODULE': 'licence',

    /** start - citizen innner-licences modules routes configuretion */
    'ANIMALPONDMODULE': 'animal-pond',
    'MUTTONFISHMODULE': 'mutton-fish',
    'SHOPANDESTAMODULE': 'shop-esta',
    'FOODMODULE': 'food',
    /** end - citizen innner-licences modules routes configuretion */

    /** start - citizen tax module */
    'TAXMODULE': 'tax',

    /** start - citizen inner-tax module */
    'PROPERTYMODULE': 'property',
    /** end - citizen inner-tax module */

    'PROFESSIONALMODULE': 'professional',

    'APPOINTMENT': 'appointmant',
    'SCHEDULEAPPOINTMENT': 'schedule-appointment',

    /** end - citizen tax module */

    /** end - citizen module routes configuretion */
    'HOSPITALMODULE': 'hospital'
}

const ROUTESLIST = {
    'HEL-DUPBR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-DUPBR"].main
    },
    'HEL-DUPDR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-DUPDR"].main
    },
    'HEL-NRCBR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-NRCBR"].main
    },
    'HEL-NRCDR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-NRCDR"].main
    },
    'HEL-CR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-CR"].main
    },
    'HEL-BCR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-BCR"].main
    },
    'HEL-DCR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["HEL-DCR"].main
    },
    'HEL-MR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.MARRIAGEMODULE + '/' + ROUTEMAIN["HEL-MR"].main
    },
    'HEL-DUPMR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.MARRIAGEMODULE + '/' + ROUTEMAIN["HEL-DUPMR"].main
    },
    'FS-AARO': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-AARO"].main
    },
    'FS-PROVI': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-PROVI"].main
    },
    'FS-FINAL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-FINAL"].main
    },
    'FS-REN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-REN"].main
    },
    'FS-WATER': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-WATER"].main
    },
    'FS-AMBU': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-AMBU"].main
    },
    'FS-BODY': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-BODY"].main
    },
    'FS-TEMPSTRUCT': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-TEMPSTRUCT"].main
    },
    'FS-FIREWORKSHOP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-FIREWORKSHOP"].main
    },
    'FS-GAS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-GAS"].main
    },
    'FS-ELE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-ELE"].main
    },
    'FS-NAV': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-NAV"].main
    },
    'FS-REVISED': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-REVISED"].main
    },
    'SHOP-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-LIC"].main
    },
    'SHOP-CAN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-CAN"].main
    },
    'SHOP-DUP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-DUP"].main
    },
    'SHOP-REN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-REN"].main
    },
    'SHOP-TRAF': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-TRAF"].main
    },
    'MF-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MF-LIC"].main
    },
    'MF-REN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MF-REN"].main
    },
    'MF-CAN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MF-CAN"].main
    },
    'MF-TRA': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MF-TRA"].main
    },
    'MF-DUP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MF-DUP"].main
    },
    'APL-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["APL-LIC"].main
    },
    'APL-REN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["APL-REN"].main
    },
    'APL-CAN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["APL-CAN"].main
    },
    'APL-TRA': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["APL-TRA"].main
    },
    'APL-DUP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["APL-DUP"].main
    },
    'FL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.FOODMODULE + '/' + ROUTEMAIN["FL"].main
    },
    'FL-REN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.FOODMODULE + '/' + ROUTEMAIN["FL-REN"].main
    },
    'FL-MODIFY': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.FOODMODULE + '/' + ROUTEMAIN["FL-MODIFY"].main
    },
    'FL-DUP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.FOODMODULE + '/' + ROUTEMAIN["FL-DUP"].main
    },
    'PRO-ASS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-ASS"].main
    },
    'PRO-EXT': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-EXT"].main
    },
    'PRO-TRAN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-TRAN"].main
    },
    'PRO-DUP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-DUP"].main
    },
    'PRO-NDU': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-NDU"].main
    },
    'PRO-REASS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-REASS"].main
    },
    'PRO-SPLI': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-SPLI"].main
    },
    'PRO-VAC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-VAC"].main
    },
    'PRO-ASSCER': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-ASSCER"].main
    },
    'CITIZENAUTHLOGIN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHLOGIN.main
    },
    'CITIZENAUTHSIGNUP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHSIGNUP.main
    },
    'CITIZENAUTHVERIFY': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHVERIFY.main
    },
    'CITIZENAUTHFORGOTPASS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHFORGOTPASS.main
    },
    'CITIZENAUTHRESETPASS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHRESETPASS.main
    },
    'CITIZENAUTHLOGINTHROUGHADMIN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHLOGINTHROUGHADMIN.main
    },
    'CITIZENDASHBOARD': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENDASHBOARD.main
    },
    'CITIZENMYAPPS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENMYAPPS.main
    },
    'CITIZENMYTRANSACTIONS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENMYTRANSACTIONS.main
    },
    'CITIZENMYPROFILE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENMYPROFILE.main
    },
    'CITIZENMYRESOURCE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENMYRESOURCE.main
    },
    'CITIZENPAYABLESERVICES': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENPAYABLESERVICES.main
    },
    'TOWNHALLLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE + '/' + ROUTEMAIN.TOWNHALLLIST.main
    },
    'BANDBOOKINGLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.BANDMODULE + '/' + ROUTEMAIN.BANDBOOKINGLIST.main
    },
    'TOWNHALLBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE + '/' + ROUTEMAIN.TOWNHALLBOOK.main
    },
    'STADIUMLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.STADIUMMODULE + '/' + ROUTEMAIN.STADIUMLIST.main
    },
    'STADIUMBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.STADIUMMODULE + '/' + ROUTEMAIN.STADIUMBOOK.main
    },
    'THEATERLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERLIST.main
    },
    'THEATERBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERBOOK.main
    },
    'THEATERBOOKINGSTATUS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERBOOKINGSTATUS.main
    },
    'GUESTHOUSELIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.GUESTHOUSEMODULE + '/' + ROUTEMAIN.GUESTHOUSELIST.main
    },

    'CANCELBOOKING': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEMAIN.CANCELBOOKING.main
    },
    'SLOTBOOKING': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.APPOINTMENT + '/' + ROUTEPREFIX.SCHEDULEAPPOINTMENT + '/' + ROUTEMAIN["SLOTBOOKING"].main
    },
    'PEC_REG': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.PROFESSIONALMODULE + '/' + ROUTEMAIN["PEC_REG"].main
    },
    'PRC_REG': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.PROFESSIONALMODULE + '/' + ROUTEMAIN["PRC_REG"].main
    },

    /* hospital full routing configuration start*/
    'HOSPITALDASHBOARD': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN.HOSPITALDASHBOARD.main
    },
    'HEL-BR': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN["HEL-BR"].main
    },
    'HEL-DR': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN["HEL-DR"].main
    },
    'HEL-SB': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN["HEL-SB"].main
    },
    'HOSPITALMYAPPS': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN.HOSPITALMYAPPS.main
    },
}


export class ManageRoutes {

    static getFullRoute(routeType: string) {
        return _.get(ROUTESLIST, `${routeType}.full`);
    }

    static getMainRoute(routeType: string) {
        return _.get(ROUTEMAIN, `${routeType}.main`);
    }

    static getPrefixRoute(routeType: string) {
        return _.get(ROUTEPREFIX, `${routeType}`);
    }

    static getApiTypeFromApiCode(apiCode: string) {
        return _.get(ROUTEMAIN, `${apiCode}.type`);
    }
}

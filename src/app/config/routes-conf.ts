
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
        'main': 'waterTankerSupply',
        'type': 'waterTankerSupply'
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
    'FS-PROVI-HOSPITAL': {
        'main': 'provisionalHospitalNoc',
        'type': 'provisionalHospitalNoc'
    },
    'FS-FINAL-HOSPITAL': {
        'main': 'finalHospitalNoc',
        'type': 'finalHospitalNoc'
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
    'FS_FIRE_CERTIFICATE': {
        'main': 'fireCertificate',
        'type': 'fireCertificate'
    },
    'FS-REVISED': {
        'main': 'revisedFireNoc',
        'type': 'revisedFireNoc'
    },
    'SHOP-LIC': {
        'main': 'shopLicense',
        'type': 'shopLicense'
    },
    'SHOP-ESTAB-LIC-NEW': {
        'main': 'shop',
        'type': 'shop'
    },
    'SHOP-ESTAB-TRANSFER': {
        'main': 'shop-transfer',
        'type': 'shop-transfer'
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
    /*Property routes starts */
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
    'PRO-ASSCER': {
        'main': 'assessmentCertificate',
        'type': 'assessmentCertificate'
    },
    'PRO-REFUND': {
        'main': 'refundAgainstVacancy',
        'type': 'refundAgainstVacancy'
    },
    'PRO-TAX-REBATE': {
        'main': 'propertyTaxRebate',
        'type': 'propertyTaxRebate'
    },
    'PRO-REVALUATION': {
        'main': 'revaluation',
        'type': 'revaluation'
    },
    'PRO-VAC': {
        'main': 'vacantPremisesCertificate',
        'type': 'vacantPremisesCertificate'
    },
    'PRO-BILL-PRINTING': {
        'main': 'bill-printing',
        'type': 'bill-printing'
    },
    /*Property routes end */

    /*Affordable Housing end */

    'AFFORD-HOUSE': {
        'main': 'afhForm',
        'type': 'afhForm'
    },
    'AFFORD_HOUSE_FEES': {
        'main': 'afhForm',
        'type': 'afhForm'
    },

    'AFFORD-HOUSE-STATUS' : {
        'main': 'myafhStatus',
        'type':'myafhStatus'
    },

    /*Affordable Housing routes end */

    /*Water routes starts */
    'WTR-NEW': {
        'main': 'newWaterConnectionEntry',
        'type': 'newWaterConnectionEntry'
    },
    'HEL_WTR_PIPELINE': {
        'main': 'waterPipeLineConnection',
        'type': 'waterPipeLineConnection'
    },
    'HEL_DRNG_PIPELINE': {
        'main': 'drainagePipeLineConnection',
        'type': 'drainagePipeLineConnection'
    },
    'HEL-WTRPIP-WRK-COMPL': {
        'main': 'wtrPipeConnWorkCompletion',
        'type': 'wtrPipeConnWorkCompletion'
    },
    'HEL-DRNGPIP-WRK-COMPL': {
        'main': 'drngPipeConnWorkCompletion',
        'type': 'drngPipeConnWorkCompletion'
    },
    'HEL-WTR-DRAINAGE-CONNECTION': {
        'main': 'newDrainageConnection',
        'type': 'newDrainageConnection'
    },


    'HEL-WTR-DRAINAGE-DISCONNECTION': {
        'main': 'drainageDisconnection',
        'type': 'drainageDisconnection'
    },
    'HEL-WTR-DRAINAGE-RECONNECTION': {
        'main': 'drainageReconnection',
        'type': 'drainageReconnection'
    },
    'HEL-WTR-DRAINAGE-TRANS-CONNECTION': {
        'main': 'drainageTransferConnection',
        'type': 'drainageTransferConnection'
    },


    'WTR-DISCON': {
        'main': 'disconnection',
        'type': 'disconnection'
    },
    'WTR-TRXF-OWN': {
        'main': 'transferOfOwnership',
        'type': 'transferOfOwnership'
    },
    'WTR-CHNG-USG': {
        'main': 'changeOfUsage',
        'type': 'changeOfUsage'
    },
    'WTR-RECON': {
        'main': 'reconnection',
        'type': 'reconnection'
    },
    'WTR-PLUMB-LIC': {
        'main': 'newPlumberLiecence',
        'type': 'newPlumberLiecence'
    },
    'WTR-RNW-PLUMB-LIC': {
        'main': 'renewalPlumberLiecence',
        'type': 'renewalPlumberLiecence'
    },
    /*Water routes end */

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
    'CITIZENAUTHLOGINRESENDOTP': {
      'main': 'login-resend-otp',
      'type': 'resendOTP'
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
        'main': 'book',
        'type': ''
    },
    'ATITHIGRUHBOOK': {
        'main': 'book',
        'type': ''
    },
    'SHOOTINGPERMISSION': {
        'main': 'shootingPermission',
        'type': 'shootingPermission'
    },
    'BOOKPERMISSION': {
        'main': 'bookPermission',
        'type': ''
    },

    'SWIMMINGPOOL': {
        'main': 'swimmingPool',
        'type': ''
    },
    // 'SWIMMINGPOOLRENEWAL': {
    //     'main': 'swimmingPoolRenewal',
    //     'type': 'swimmingPoolRenewal'
    // },
    'SWIMMINGPOOLRENEWAL': {
        'main': 'swimmingPoolRenewal',
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
    'CHILDRENTHEATERBOOK': {
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
    'MYBOOKING': {
        'main': 'my-bookings',
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
    'PFT_REG_CER':{
        'main': 'certificate-registration',
        'type': 'dupCertificateForm'  
    },

    /**
     * Ticketing Facility Routes
     */

    'MYTICKETINGS': {
        'main': 'my-ticketings',
        'type': ''
    },

    'ZOOTICKETING': {
        'main': 'zoo-ticketing',
        'type': ''
    },
    'ANIMAL-ADOPTION': {
        'main': 'animal-adoption',
        'type': ''
    },
    'PLANETARIUM': {
        'main': 'planetarium',
        'type': ''
    },
    'ZOOBOOK': {
        'main': 'book',
        'type': ''
    },
    'PLANETARIUMBOOK': {
        'main': 'book',
        'type': ''
    },
    'SARDAR_PATEL_PLANETARIUM': {
        'main': 'book',
        'type': 'planetrium'
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
    'HEL-BCR-HOSPITAL': {
        'main': 'birthCorrectionReg',
        'type': 'birthCorrectionReg'
    },
    'HOSPITALMYAPPS': {
        'main': 'my-applications',
        'type': 'myApps'
    },

    'PAYMENTGATEWAYRESPONSE': {
        'main': 'payment-gateway-response',
        'type': ''
    },
    'VEHICLE': {
        'main': 'new-registration',
        'type': 'vehicle'
    },
    'PRO-TAX-TRAS-HISTORY': {
        'main': 'tax-transaction',
        'type': 'tax-transaction'
    },
    'PROPERTY_UPDATE_EMAIL_AND_MOBILE': {
        'main': 'update-email-mobile',
        'type': 'update-email-mobile'
    },
    'HEL-WTR-DRA-CON': {
        'main': 'newDrainageConnection',
        'type': 'newDrainageConnection'
    },

    'VENDOR_REG': {
        'main': 'vendor',
        'type': 'vendor'
    },

    'CONTRACTOR_REGISTRATION': {
        'main': 'contractor',
        'type': 'contractor'
    },
    'SHOP-ESTAB-CLOSING': {
        'main': 'shop-close',
        'type': 'shop-close'
    },

}

const ROUTEPREFIX = {

    /** citizen module routes configuretion - start */

    'CITIZENMODULE': 'citizen',

    /** start - citizen auth module routes configuretion */
    'CITIZENAUTHMODULE': 'auth',
    /** end - citizen auth module routes configuretion */

    /** start - citizen booking module routes configuretion */
    'BOOKINGMODULE': 'bookings',

    /**
     * start - citizen ticketings module routes configuretion
     */

    'TICKETINGSMODULES': 'ticketings',

    /** start - citizen inner-booking modules routes configuretion */
    'BANDMODULE': 'band',
    'GARDENMODULE': 'garden',
    'GUESTHOUSEMODULE': 'guest-house',
    'PLANETAREAMODULE': 'planet-area',
    'ATITHIGRUHMODULE': 'atithigruh',
    'STADIUMMODULE': 'stadium',
    'CHILDRENTHEATERMODULE': 'children-theater',
    'SHOOTINGPERMISSIONMODULE': 'shooting-permission',
    'SWIMMINGMODULE': 'swimming-pool',
    'THEATERMODULE': 'theater',
    'TOWNHALLMODULE': 'town-hall',
    'ZOOMODULE': 'zoo',
    'ZOODASHBOARD': 'zoo-dashboard',
    'ANIMALADOPTIONMODULE': 'adoption',
    'PLANETARIUMMODULE': 'planetarium',
    'SWIMMINGPOOLDASHBOARD': 'swimming-pool-dashboard',
    'SWIMMINGPOOLMODULE': 'swimming-pool',
    'SWIMMINGPOOLRENEWALMODULE': 'swimmingPoolRenewal',
    /** end - citizen innner-booking modules routes configuretion */

    /** end - citizen booking module routes configuretion */

    'CERTIFICATESMODULE': 'certificates',

    'AFFORDABLEMODULE': 'affordable-housing',



    /** start - citizen innner-booking modules routes configuretion */
    'BIRTHANDDEATHMODULE': 'birth-death',
    'MARRIAGEMODULE': 'marriage',
    /** end - citizen innner-booking modules routes configuretion */

    'FIREFACILITIESMODULE': 'fire-facilities',
    'GRIEVANCEMODULE': 'grievance',
    'LICENCEMODULE': 'license',

    /** start - citizen innner-licences modules routes configuretion */
    'ANIMALPONDMODULE': 'animal-pond',
    'MUTTONFISHMODULE': 'mutton-fish',
    'SHOPANDESTAMODULE': 'shop-esta-act',
    'FOODMODULE': 'food',
    /** end - citizen innner-licences modules routes configuretion */

    /** start - citizen tax module */
    'TAXMODULE': 'tax',

    /** start - citizen inner-tax module */
    'PROPERTYMODULE': 'property',
    'WATERMODULE': 'water-supply',
    'WATERDRINAGE': 'water-drinage',
    /** end - citizen inner-tax module */

    'PROFESSIONALMODULE': 'professional',
    'VEHICLEMODULE': 'vehicle',

    'APPOINTMENT': 'appointmant',
    'SCHEDULEAPPOINTMENT': 'schedule-appointment',

    /** end - citizen tax module */

    /** end - citizen module routes configuretion */
    'HOSPITALMODULE': 'hospital',

    'PROPERTY': 'property',

    'VENDORMODULE': 'vendor-registration',

    'ENGINEERINGMODULE': 'engineering',

    'CONTRACTORMODULE': 'contractor-regsitration'

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
    'FS-BODY': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-BODY"].main
    },
    'FS-TEMPSTRUCT': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-TEMPSTRUCT"].main
    },
    'FS-FIREWORKSHOP': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-FIREWORKSHOP"].main
    },
    'FS-PROVI-HOSPITAL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-PROVI-HOSPITAL"].main
    },
    'FS-FINAL-HOSPITAL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-FINAL-HOSPITAL"].main
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
    'FS_FIRE_CERTIFICATE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS_FIRE_CERTIFICATE"].main
    },
    'FS-REVISED': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-REVISED"].main
    },
    'SHOP-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-LIC"].main
    },
    'SHOP-ESTAB-LIC-NEW': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-ESTAB-LIC-NEW"].main
    },
    'SHOP-ESTAB-TRANSFER': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-ESTAB-TRANSFER"].main
    },
    'SHOP-ESTAB-CLOSING': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-ESTAB-CLOSING"].main
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
    /*Property routes starts */
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
    'PRO-VAC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-VAC"].main
    },
    'PRO-ASSCER': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-ASSCER"].main
    },
    'PRO-REFUND': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-REFUND"].main
    },
    'PRO-TAX-REBATE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-TAX-REBATE"].main
    },
    'PRO-REVALUATION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-REVALUATION"].main
    },
    'PAY-PRO-TAX': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENPAYABLESERVICES.main
    },
    'PRO-BILL-PRINTING': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTYMODULE + '/' + ROUTEMAIN["PRO-BILL-PRINTING"].main
    },
    /*Property routes end */

    /*Affordable Housing routes Start */

    'AFFORD-HOUSE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.AFFORDABLEMODULE + '/' + ROUTEMAIN["AFFORD-HOUSE"].main
    },
    'AFFORD-HOUSE-STATUS' : {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.AFFORDABLEMODULE + '/' + ROUTEMAIN["AFFORD-HOUSE-STATUS"].main
    },
    /*Affordable Housing routes end */



    /*Water routes starts */
    'WTR-NEW': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-NEW"].main
    },
    'HEL_WTR_PIPELINE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL_WTR_PIPELINE"].main
    },
    'HEL_DRNG_PIPELINE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL_DRNG_PIPELINE"].main
    },
    'HEL-WTRPIP-WRK-COMPL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-WTRPIP-WRK-COMPL"].main
    },
    'HEL-DRNGPIP-WRK-COMPL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-DRNGPIP-WRK-COMPL"].main
    },
    'HEL-WTR-DRAINAGE-DISCONNECTION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-WTR-DRAINAGE-DISCONNECTION"].main
    },
    'HEL-WTR-DRAINAGE-RECONNECTION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-WTR-DRAINAGE-RECONNECTION"].main
    },
    'HEL-WTR-DRAINAGE-TRANS-CONNECTION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-WTR-DRAINAGE-TRANS-CONNECTION"].main
    },
    'HEL-WTR-DRAINAGE-CONNECTION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-WTR-DRAINAGE-CONNECTION"].main
    },
    'WTR-DISCON': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-DISCON"].main
    },
    'WTR-TRXF-OWN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-TRXF-OWN"].main
    },
    'WTR-CHNG-USG': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-CHNG-USG"].main
    },
    'WTR-RECON': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-RECON"].main
    },
    'WTR-PLUMB-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-PLUMB-LIC"].main
    },
    'WTR-RNW-PLUMB-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERMODULE + '/' + ROUTEMAIN["WTR-RNW-PLUMB-LIC"].main
    },
    'PAY-WTR-TAX': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENPAYABLESERVICES.main
    },
    /*Water routes end */
    'CITIZENAUTHLOGIN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHLOGIN.main
    },
    'CITIZENAUTHLOGINRESENDOTP': {
      'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CITIZENAUTHMODULE + '/' + ROUTEMAIN.CITIZENAUTHLOGINRESENDOTP.main
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



    /* BOOKING ROUTES STARTING */

    //TOWNHALL
    'TOWNHALLLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE + '/' + ROUTEMAIN.TOWNHALLLIST.main
    },
    'TOWNHALLBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE + '/' + ROUTEMAIN.TOWNHALLBOOK.main
    },

    //BAND
    'BANDBOOKINGLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.BANDMODULE + '/' + ROUTEMAIN.BANDBOOKINGLIST.main
    },
    'BAND': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.BANDMODULE + '/' + ROUTEMAIN.BANDBOOKINGLIST.main
    },

    //STADIUM
    'STADIUMLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.STADIUMMODULE + '/' + ROUTEMAIN.STADIUMLIST.main
    },
    'STADIUMBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.STADIUMMODULE + '/' + ROUTEMAIN.STADIUMBOOK.main
    },
    //children theater
    'CHILDRENTHEATERBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.CHILDRENTHEATERMODULE + '/' + ROUTEMAIN.CHILDRENTHEATERBOOK.main
    },

    //ATITHIGRUH
    'ATITHIGRUHBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.ATITHIGRUHMODULE + '/' + ROUTEMAIN.ATITHIGRUHBOOK.main
    },

    //SHOOTING-PERMISSION
    'BOOKPERMISSION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.SHOOTINGPERMISSIONMODULE + '/' + ROUTEMAIN.BOOKPERMISSION.main
    },
    //SWIMMING POOL
    'SWIMMINGPOOL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.SWIMMINGPOOLMODULE + '/' + ROUTEMAIN['SWIMMINGPOOL'].main
    },
    'SWIMMINGPOOLRENEWAL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.SWIMMINGPOOLMODULE + '/' + ROUTEMAIN.SWIMMINGPOOLRENEWAL.main
    },
    //AMPHI-THEATER
    'THEATERLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERLIST.main
    },
    'THEATERBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERBOOK.main
    },
    'THEATERBOOKINGSTATUS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERBOOKINGSTATUS.main
    },

    //GUEST-HOUSE
    'GUESTHOUSELIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.GUESTHOUSEMODULE + '/' + ROUTEMAIN.GUESTHOUSELIST.main
    },

    //COMMON CANCEL BOOKING
    'MYBOOKING': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEMAIN.MYBOOKING.main
    },

    //APPOINTMENT SLOT BOOKING
    'SLOTBOOKING': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.APPOINTMENT + '/' + ROUTEPREFIX.SCHEDULEAPPOINTMENT + '/' + ROUTEMAIN["SLOTBOOKING"].main
    },
    //SWIMMING POOL
    'SWIMMINGPOOLDASHBOARD': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.SWIMMINGPOOLDASHBOARD
    },

    /**
     * Ticketing Routing Start
     */

    'ZOO-DASHBOARD': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TICKETINGSMODULES + '/' + ROUTEPREFIX.ZOODASHBOARD
    },

    'ZOOBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TICKETINGSMODULES + '/' + ROUTEPREFIX.ZOODASHBOARD + '/' + ROUTEPREFIX.ZOOMODULE + '/' + ROUTEMAIN['ZOOTICKETING'].main
    },

    'ANIMAL-ADOPTION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TICKETINGSMODULES + '/' + ROUTEPREFIX.ZOODASHBOARD + '/' + ROUTEPREFIX.ANIMALADOPTIONMODULE + '/' + ROUTEMAIN["ANIMAL-ADOPTION"].main
    },

    'PLANETARIUMBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TICKETINGSMODULES + '/' + ROUTEPREFIX.PLANETARIUMMODULE + '/' + ROUTEMAIN.PLANETARIUMBOOK.main
    },

    'MYTICKETINGS': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TICKETINGSMODULES + '/' + ROUTEMAIN.MYTICKETINGS.main
    },

    /* BOOKING ROUTES ENDING */
    // 'TOWNHALLLIST': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE + '/' + ROUTEMAIN.TOWNHALLLIST.main
    // },
    // 'BANDBOOKINGLIST': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.BANDMODULE + '/' + ROUTEMAIN.BANDBOOKINGLIST.main
    // },
    // 'TOWNHALLBOOK': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE + '/' + ROUTEMAIN.TOWNHALLBOOK.main
    // },
    // 'STADIUMLIST': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.STADIUMMODULE + '/' + ROUTEMAIN.STADIUMLIST.main
    // },
    // 'STADIUMBOOK': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.STADIUMMODULE + '/' + ROUTEMAIN.STADIUMBOOK.main
    // },
    // 'BOOKPERMISSION': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.SHOOTINGPERMISSIONMODULE + '/' + ROUTEMAIN.BOOKPERMISSION.main
    // },
    // 'THEATERLIST': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERLIST.main
    // },
    // 'THEATERBOOK': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERBOOK.main
    // },
    // 'THEATERBOOKINGSTATUS': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.THEATERMODULE + '/' + ROUTEMAIN.THEATERBOOKINGSTATUS.main
    // },
    // 'GUESTHOUSELIST': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.GUESTHOUSEMODULE + '/' + ROUTEMAIN.GUESTHOUSELIST.main
    // },
    // 'CANCELBOOKING': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEMAIN.CANCELBOOKING.main
    // },
    // 'SLOTBOOKING': {
    //     'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.APPOINTMENT + '/' + ROUTEPREFIX.SCHEDULEAPPOINTMENT + '/' + ROUTEMAIN["SLOTBOOKING"].main
    // },
    'PEC_REG': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROFESSIONALMODULE + '/' + ROUTEMAIN["PEC_REG"].main
    },
    'PRC_REG': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROFESSIONALMODULE + '/' + ROUTEMAIN["PRC_REG"].main
    },
    'PFT_REG_CER':{
        'full':ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROFESSIONALMODULE + '/' + ROUTEMAIN["PFT_REG_CER"].main
    },
    'PAY_PROF_TAX': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENPAYABLESERVICES.main
    },
    'VEHICLE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.VEHICLEMODULE + '/' + ROUTEMAIN["VEHICLE"].main
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
    'HEL-BCR-HOSPITAL': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN["HEL-BCR-HOSPITAL"].main
    },
    'HOSPITALMYAPPS': {
        'full': ROUTEPREFIX.HOSPITALMODULE + '/' + ROUTEMAIN.HOSPITALMYAPPS.main
    },
    'PRO-TAX-TRAS-HISTORY': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEMAIN["PRO-TAX-TRAS-HISTORY"].main
    },
    'PROPERTY_UPDATE_EMAIL_AND_MOBILE': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.PROPERTY + '/' + ROUTEMAIN["PROPERTY_UPDATE_EMAIL_AND_MOBILE"].main
    },
    'HEL-WTR-DRA-CON': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.TAXMODULE + '/' + ROUTEPREFIX.WATERDRINAGE + '/' + ROUTEMAIN["HEL-WTR-DRAINAGE-CONNECTION"].main
    },

    /*Engineering routes Start */

    'VENDOR_REG': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.ENGINEERINGMODULE + '/' + ROUTEPREFIX.VENDORMODULE
    },

    'CONTRACTOR_REGISTRATION': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.ENGINEERINGMODULE + '/' + ROUTEPREFIX.CONTRACTORMODULE
    },
    /*Engineering routes end */

}


export const ManageRoutes = {

    getFullRoute(routeType: string) {
        if (routeType)
            return ROUTESLIST[routeType]['full'];
    },

    getMainRoute(routeType: string) {
        if (routeType)
            return ROUTEMAIN[routeType]['main'];
    },

    getPrefixRoute(routeType: string) {
        if (routeType)
            return ROUTEPREFIX[routeType];
    },

    getApiTypeFromApiCode(apiCode: string) {
        if (apiCode)
            return ROUTEMAIN[apiCode]['type'];
    }
}

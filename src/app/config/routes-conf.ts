import * as _ from 'lodash';

const ROUTEMAIN = {
    'MR': {
        'main': 'marriageReg',
        'type': 'marriageReg',
    },
    'BR': {
        'main': 'birthReg',
        'type': 'birthReg'
    },
    'DUP-BR': {
        'main': 'duplicateBirthReg',
        'type': 'duplicateBirthReg'
    },
    'DUP-DR': {
        'main': 'duplicateDeathReg',
        'type': 'duplicateDeathReg'
    },
    'DR': {
        'main': 'deathReg',
        'type': 'deathReg'
    },
    'NRC-BIRTH': {
        'main': 'NRCBirth',
        'type': 'NRCBirth'
    },
    'NRC-DEATH': {
        'main': 'NRCDeath',
        'type': 'NRCDeath'
    },
    'CR': {
        'main': 'cremationReg',
        'type': 'cremationReg'
    },
    'SB': {
        'main': 'stillBirthReg',
        'type': 'stillBirthReg'
    },
    'FS-AARO': {
        'main': 'FSAarogyaParvanoNoc',
        'type': 'FSAarogyaParvanoNoc'
    },
    'FS-PROVI': {
        'main': 'FSProvisionalNoc',
        'type': 'FSProvisionalNoc'
    },
    'FS-FINAL': {
        'main': 'FSFinalFireNoc',
        'type': 'FSFinalFireNoc'
    },
    'FS-REN': {
        'main': 'FSRenewalNoc',
        'type': 'FSRenewalNoc'
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
        'main': 'FSBodywan',
        'type': 'FSBodywan'
    },
    'FS-STRUCT': {
        'main': 'FSTempStructNoc',
        'type': 'FSTempStructNoc'
    },
    'FS-FIREWORK': {
        'main': 'FSTempFireworkShopNoc',
        'type': 'FSTempFireworkShopNoc'
    },
    'FS-GAS': {
        'main': 'FSGasConnectionNoc',
        'type': 'FSGasConnectionNoc'
    },
    'FS-ELE': {
        'main': 'FSElectricConnectionNoc',
        'type': 'FSElectricConnectionNoc'
    },
    'FS-NAV': {
        'main': 'FSNavaratriNoc',
        'type': 'FSNavaratriNoc'
    },
    'SHOP-LIC': {
        'main': 'shopLicense',
        'type': 'shopLicense'
    },
    'MFL': {
        'main': 'MFLicense',
        'type': 'MFLicense'
    },
    'MFR': {
        'main': 'MFRenewal',
        'type': 'MFRenewal'
    },
    'MFC': {
        'main': 'MFCancellation',
        'type': 'MFCancellation'
    },
    'MFT': {
        'main': 'MFTransfer',
        'type': 'MFTransfer'
    },
    'MFD': {
        'main': 'MFDuplicate',
        'type': 'MFDuplicate'
    },
    'POND-LIC': {
        'main': 'pondLicense',
        'type': 'pondLicense'
    },
    'POND-REN': {
        'main': 'pondRenewal',
        'type': 'pondRenewal'
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
    'CITIZENPAYMENTGATEWAY': {
        'main': 'payment-gateway',
        'type': ''
    },
    'TOWNHALLLIST': {
        'main': 'list',
        'type': ''
    },
    'TOWNHALLBOOK': {
        'main': 'book',
        'type': ''
    }
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
    'SHOPANDESTAMODULE': 'mutton-fish',
    /** end - citizen innner-licences modules routes configuretion */

    /** end - citizen module routes configuretion */
    'HOSPITALMODULE': 'hospital'
}

const ROUTESLIST = {
    'MR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.MARRIAGEMODULE + '/' + ROUTEMAIN.MR.main
    },
    'BR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN.BR.main
    },
    'DUP-BR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["DUP-BR"].main
    },
    'DUP-DR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN["DUP-DR"].main
    },
    'DR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN.DR.main
    },
    'NRC-BIRTH': {
        'full': ROUTEPREFIX.CITIZENMODULE+ '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE  + '/' + ROUTEMAIN["NRC-BIRTH"].main
    },
    'NRC-DEATH': {
        'full': ROUTEPREFIX.CITIZENMODULE+ '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE  + '/' + ROUTEMAIN["NRC-DEATH"].main
    },
    'CR': {
        'full': ROUTEPREFIX.CITIZENMODULE+ '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE  + '/' + ROUTEMAIN.CR.main
    },
    'SB': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.CERTIFICATESMODULE + '/' + ROUTEPREFIX.BIRTHANDDEATHMODULE + '/' + ROUTEMAIN.SB.main
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
    'FS-STRUCT': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-STRUCT"].main
    },
    'FS-FIREWORK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.FIREFACILITIESMODULE + '/' + ROUTEMAIN["FS-FIREWORK"].main
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
    'SHOP-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEPREFIX.SHOPANDESTAMODULE + '/' + ROUTEMAIN["SHOP-LIC"].main
    },
    'MFL': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MFL"].main
    },
    'MFR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MFR"].main
    },
    'MFC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MFC"].main
    },
    'MFT': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MFT"].main
    },
    'MFD': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.MUTTONFISHMODULE + '/' + ROUTEMAIN["MFD"].main
    },
    'POND-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["POND-LIC"].main
    },
    'POND-REN': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/'+ ROUTEPREFIX.ANIMALPONDMODULE + '/' + ROUTEMAIN["POND-REN"].main
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
    'CITIZENPAYMENTGATEWAY': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CITIZENPAYMENTGATEWAY.main
    },
    'TOWNHALLLIST': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE +  '/' + ROUTEMAIN.TOWNHALLLIST.main
    },
    'TOWNHALLBOOK': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.BOOKINGMODULE + '/' + ROUTEPREFIX.TOWNHALLMODULE +  '/' + ROUTEMAIN.TOWNHALLBOOK.main
    }
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

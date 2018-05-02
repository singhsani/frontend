import * as _ from 'lodash';

const ROUTEMAIN = {
    'MR': {
        'main': 'marriageReg'
    },
    'BR': {
        'main': 'birthReg'
    },
    'DR': {
        'main': 'deathReg'
    },
    'NRC-BIRTH': {
        'main': 'NRCBirth'
    },
    'NRC-DEATH': {
        'main': 'NRCDeath'
    },
    'CR': {
        'main': 'cremationReg'
    },
    'SHOP-LIC': {
        'main': 'shopLicense'
    },
    'CITIZENAUTHLOGIN': {
        'main': 'login'
    },
    'CITIZENAUTHSIGNUP': {
        'main': 'signup'
    },
    'CITIZENAUTHVERIFY': {
        'main': 'user-verify'
    },
    'CITIZENAUTHFORGOTPASS': {
        'main': 'forgot-password'
    },
    'CITIZENAUTHRESETPASS': {
        'main': 'reset-password'
    },
    'CITIZENDASHBOARD': {
        'main': 'dashboard'
    },
    'CITIZENMYAPPS': {
        'main': 'my-applications'
    },
    'CITIZENMYTRANSACTIONS': {
        'main': 'my-transactions'
    },
    'CITIZENMYPROFILE': {
        'main': 'my-profile'
    },
    'CITIZENMYRESOURCE': {
        'main': 'my-resource'
    }
}

const ROUTEPREFIX = {
    'CITIZENMODULE': 'citizen',
    'LICENCEMODULE': 'licence',
    'TAXMODULE': 'tax',
    'BOOKINGMODULE': 'booking',
    'HOSPITALMODULE': 'hospital',
    'CITIZENAUTHMODULE': 'auth'
}

const ROUTESLIST = {
    'MR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.MR.main
    },
    'BR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.BR.main
    },
    'DR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.DR.main
    },
    'NRC-BIRTH': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN["NRC-BIRTH"].main
    },
    'NRC-DEATH': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN["NRC-BIRTH"].main
    },
    'CR': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEMAIN.CR.main
    },
    'SHOP-LIC': {
        'full': ROUTEPREFIX.CITIZENMODULE + '/' + ROUTEPREFIX.LICENCEMODULE + '/' + ROUTEMAIN["SHOP-LIC"].main
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
    }
}


export class ManageRoutes {

    static getFullRoute(routeType:string){
        return _.get(ROUTESLIST, `${routeType}.full`);
    }

    static getMainRoute(routeType:string){
        return _.get(ROUTEMAIN, `${routeType}.main`);
    }

    static getPrefixRoute(routeType:string){
        return _.get(ROUTEPREFIX, `${routeType}`);
    }
}

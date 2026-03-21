export class VMCConfiguation {

    // Base URL for API
    static searchBaseUrl = '/VMC'
   // static serverApiIp = '/VMC';

    // Local test Base URL for API
    // static searchBaseUrl = 'http://10.0.0.25:4200'
    // static serverApiIp = 'http://192.168.30.52:8080';
     static serverApiIp = window.location.protocol + "//" + window.location.hostname + ":8082";
    //static serverApiIp = 'http://192.168.30.52:8080/'

    // VM Test Base URL for API
    // static searchBaseUrl = 'http://183.87.214.71:4200'
    // static serverApiIp = 'http://183.87.214.71:8090';

    // VM MigrationBase URL for API
    // static searchBaseUrl = 'http://116.206.155.213:4200'
    // static serverApiIp = 'http://116.206.155.213:8080';
}

export const environment = {
	production: false,
	envName: 'test',
	// envAPIServer: 'http://192.168.30.67:8080/',
	envAPIServer: '/VMC/',

	//Usefull url and api url's.
	adminUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/vmcadminportal/',
	citizenUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/vmcportal/',
	returnUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/citizen/payment-response',
	// returnUrl: 'http://' + '192.168.30.78' + ':' + window.location.port + '/citizen/payment-response',
};

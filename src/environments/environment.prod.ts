export const environment = {
	production: true,
	envName: 'production',
	envAPIServer: 'http://192.168.30.67:8080/',
	// envAPIServer: '/VMC/',
	//Usefull url and api url's.
	adminUrl: 'http://' + window.location.hostname + ':' + window.location.port + '/vmcadminportal/',
	citizenUrl: 'http://' + window.location.hostname + ':' + window.location.port + '/vmcportal/',
	returnUrl: 'http://' + window.location.hostname + ':' + window.location.port + '/vmcportal/citizen/payment-response',
	returnhosUrl: 'http://' + window.location.hostname + ':' + window.location.port + '/vmcportal/hospital/hos-payment-gateway-response'
	// returnUrl: 'http://' + '192.168.30.78' + ':' + window.location.port + '/citizen/payment-response',
};

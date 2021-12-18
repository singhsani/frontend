export const environment = {
	production: true,
	envName: 'dev',
	envAPIServer: '/VMC/',
 	// envAPIServer: 'http://192.168.10.107:8080/VMC/',
	// envAPIServer: 'http://192.168.10.202:8080/VMC/',
	// envAPIServer: '/VMC/',
	// envAPIServer: window.location.protocol + "//" + window.location.hostname + ":8080/",

	//Usefull url and api url's.
	adminUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/vmcadminportal/',
	citizenUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/vmcportal/',
	returnUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/vmcportal/citizen/payment-response',
	returnhosUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/vmcportal/hospital/hos-payment-gateway-response'
};

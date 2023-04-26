/**
 * The file contents for the current environment will overwrite these during build.
 * The build system defaults to the dev environment which uses `environment.ts`, but if you do `ng build --env=prod` then `environment.prod.ts` will be used instead.
 * The list of which env maps to which file can be found in `.angular-cli.json`.
 */
export const environment = {
	production: false,
	envName: 'dev',
	//envAPIServer: '/VMC/',
 	// envAPIServer: 'http://192.168.10.107:8080/VMC/',
	// envAPIServer: 'http://192.168.10.202:8080/VMC/',
	// envAPIServer: '/VMC/',
	envAPIServer: window.location.protocol + "//" + window.location.hostname + ":8080/",

	//Usefull url and api url's.
	adminUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/',
	citizenUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/',
	returnUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/citizen/payment-response',
	returnhosUrl: window.location.protocol + "//" + window.location.hostname + ':' + window.location.port + '/hospital/hos-payment-gateway-response'
};

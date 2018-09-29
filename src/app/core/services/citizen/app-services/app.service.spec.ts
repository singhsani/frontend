import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service';
import { HttpService } from '../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';

describe('AppService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AppService, HttpService, SessionStorageService]
		});
	});

	it('should be created', inject([AppService, HttpService], (service: AppService) => {
		expect(service).toBeTruthy();
	}));
});

import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service';
import { HttpService } from '../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

 describe('Service : AppService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule],
			providers: [AppService, HttpService, SessionStorageService]
		});
	});

	it('should be created', inject([AppService, HttpService], (service: AppService) => {
		expect(service).toBeTruthy();
	}));
});

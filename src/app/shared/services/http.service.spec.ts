import { TestBed, inject } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Shared Services : HttpService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [HttpService, SessionStorageService]
		});
	});

	it('should be created', inject([HttpService], (service: HttpService) => {
		expect(service).toBeTruthy();
	}));
});

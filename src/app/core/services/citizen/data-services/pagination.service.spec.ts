import { TestBed, inject } from '@angular/core/testing';

import { PaginationService } from './pagination.service';
import { HttpService } from '../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Service : PaginationService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [PaginationService, HttpService, SessionStorageService]
		});
	});

	it('should be created', inject([PaginationService], (service: PaginationService) => {
		expect(service).toBeTruthy();
	}));
});

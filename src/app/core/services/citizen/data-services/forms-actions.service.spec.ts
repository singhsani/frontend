import { TestBed, inject } from '@angular/core/testing';

import { FormsActionsService } from './forms-actions.service';
import { HttpService } from '../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';

 describe('Service : FormsActionsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [FormsActionsService, SessionStorageService, HttpService]
		});
	});

	it('should be created', inject([FormsActionsService], (service: FormsActionsService) => {
		expect(service).toBeTruthy();
	}));
});

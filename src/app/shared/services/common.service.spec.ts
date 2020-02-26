import { TestBed, inject } from '@angular/core/testing';

import { CommonService } from './common.service';
import { SessionStorageService } from 'angular-web-storage';

 describe('Shared Services : CommonService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CommonService, SessionStorageService]
		});
	});

	it('should be created', inject([CommonService], (service: CommonService) => {
		expect(service).toBeTruthy();
	}));
});

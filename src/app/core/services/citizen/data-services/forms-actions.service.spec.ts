import { TestBed, inject } from '@angular/core/testing';

import { FormsActionsService } from './forms-actions.service';

describe('FormsActionsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FormsActionsService]
		});
	});

	it('should be created', inject([FormsActionsService], (service: FormsActionsService) => {
		expect(service).toBeTruthy();
	}));
});

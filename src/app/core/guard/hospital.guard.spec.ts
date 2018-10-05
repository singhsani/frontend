import { TestBed, async, inject } from '@angular/core/testing';

import { HospitalGuard } from './hospital.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';
import { HosAppService } from '../services/hospital/app-services/hos-app.service';

 describe('Core Guard : HospitalGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule,
				ToastrModule.forRoot(),
				HttpClientTestingModule],
			providers: [HospitalGuard,
				ToastrService,
				HosAppService,
				SessionStorageService]
		});
	});

	it('should ...', inject([HospitalGuard], (guard: HospitalGuard) => {
		expect(guard).toBeTruthy();
	}));
});

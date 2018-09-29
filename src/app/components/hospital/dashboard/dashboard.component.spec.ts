import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { HospitalDashboardComponent } from './dashboard.component';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('Hospital Module : HospitalDashboardComponent', () => {
	let component: HospitalDashboardComponent;
	let fixture: ComponentFixture<HospitalDashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SharedModule, RouterTestingModule, ToastrModule.forRoot(),  BrowserAnimationsModule],
			declarations: [HospitalDashboardComponent],
			providers: [HosFormActionsService, SessionStorageService, ToastrService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HospitalDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

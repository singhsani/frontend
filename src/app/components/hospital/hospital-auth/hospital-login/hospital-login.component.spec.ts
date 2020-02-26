import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalLoginComponent } from './hospital-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HosAppService } from '../../../../core/services/hospital/app-services/hos-app.service';
import { SessionStorageService } from 'angular-web-storage';

describe('Hospital Module : HospitalLoginComponent', () => {
	let component: HospitalLoginComponent;
	let fixture: ComponentFixture<HospitalLoginComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				MaterialModule,
				NgSelectModule,
				RouterTestingModule,
				BrowserAnimationsModule,
				ToastrModule.forRoot(),
				HttpClientTestingModule
			],
			providers: [HosAppService,
				SessionStorageService,
				ToastrService],
			declarations: [HospitalLoginComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HospitalLoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

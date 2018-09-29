import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVerificationComponent } from './user-verification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { HttpService } from '../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';

describe('UserverificationComponent', () => {
	let component: UserVerificationComponent;
	let fixture: ComponentFixture<UserVerificationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, ToastrModule.forRoot({
				timeOut: 5000,
				positionClass: 'toast-top-right',
				preventDuplicates: true,
				progressBar: true,
				closeButton: true
			}), HttpClientTestingModule, RouterTestingModule, MaterialModule, BrowserAnimationsModule],
			declarations: [UserVerificationComponent],
			providers: [AppService, HttpService, SessionStorageService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserVerificationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

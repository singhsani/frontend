import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { ControlMessagesComponent } from '../../../../shared/components/control-messages/control-messages.component';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('SignUpComponent', () => {
	let component: SignUpComponent;
	let fixture: ComponentFixture<SignUpComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, ToastrModule.forRoot({
				timeOut: 5000,
				positionClass: 'toast-top-right',
				preventDuplicates: true,
				progressBar: true,
				closeButton: true
			}), HttpClientTestingModule, RouterTestingModule,MaterialModule, BrowserAnimationsModule],
			declarations: [SignUpComponent, ControlMessagesComponent],
			providers: [AppService, HttpService, SessionStorageService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SignUpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

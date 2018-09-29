import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'


import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { SessionStorageService } from 'angular-web-storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ResetPasswordComponent', () => {
	let component: ResetPasswordComponent;
	let fixture: ComponentFixture<ResetPasswordComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, BrowserAnimationsModule],
			declarations: [ResetPasswordComponent],
			providers: [AppService, SessionStorageService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ResetPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

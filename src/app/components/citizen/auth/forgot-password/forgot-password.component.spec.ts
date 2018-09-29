import { async, ComponentFixture, TestBed } from '@angular/core/testing';

//Reuired Testing Modules, service and components.
import { RouterTestingModule } from "@angular/router/testing";
import { SessionStorageService } from 'angular-web-storage';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotPasswordComponent', () => {
	let component: ForgotPasswordComponent;
	let fixture: ComponentFixture<ForgotPasswordComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports:[
				FormsModule, ReactiveFormsModule, SharedModule, RouterTestingModule, BrowserAnimationsModule
			],
			declarations: [ForgotPasswordComponent],

			providers: [AppService, SessionStorageService]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ForgotPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

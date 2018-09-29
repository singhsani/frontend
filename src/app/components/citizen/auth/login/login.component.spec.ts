import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing'

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let service : AppService;
	let fixture: ComponentFixture<LoginComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, SharedModule, RouterTestingModule, ToastrModule.forRoot({
				timeOut: 5000,
				positionClass: 'toast-top-right',
				preventDuplicates: true,
				progressBar: true,
				closeButton: true
			}), BrowserAnimationsModule],
			declarations: [LoginComponent],
			providers: [AppService, SessionStorageService, ToastrService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		service = TestBed.get(AppService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

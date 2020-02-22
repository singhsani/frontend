import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { HttpService } from '../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '../../../shared/modules/translate/translate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../shared/components/control-messages/control-messages.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ValidationService } from '../../../shared/services/validation.service';
import { ValidationFieldsDirective } from '../../../shared/directives/validation-fields.directive';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

 describe('Component : UserProfileComponent', () => {
	let component: UserProfileComponent;
	let fixture: ComponentFixture<UserProfileComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				UserProfileComponent,
				TitleBarComponent,
				ControlMessagesComponent,
				ValidationFieldsDirective
			],
			imports: [
				MaterialModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
				TranslateModule,
				ReactiveFormsModule,
				NgSelectModule,
				RouterTestingModule,
				ToastrModule.forRoot({
					timeOut: 5000,
					positionClass: 'toast-top-right',
					preventDuplicates: true,
					progressBar: true,
					closeButton: true
				})
			],
			providers: [
				FormsActionsService,
				CommonService,
				HttpService,
				SessionStorageService,
				ValidationService,
				ToastrService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

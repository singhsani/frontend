import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BirthRegistrationComponent } from './birth-registration.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../../../shared/modules/translate/translate.module';
import { HosTitleBarComponent } from '../../../shared/components/hos-title-bar/hos-title-bar.component';
import { ValidationFieldsDirective } from '../../../shared/directives/validation-fields.directive';
import { GujInputSourceDirective } from '../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../shared/directives/guj-input-target.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlMessagesComponent } from '../../../shared/components/control-messages/control-messages.component';
import { HosActionBarComponent } from '../../../shared/components/hos-action-bar/hos-action-bar.component';
import { AddressComponent } from '../../../shared/components/address/address.component';
import { HosFileUploadComponent } from '../../../shared/components/hos-file-upload/hos-file-upload.component';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../shared/services/common.service';
import { AmazingTimePickerService, AmazingTimePickerModule } from 'amazing-time-picker';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpService } from '../../../shared/services/http.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { BehaviorSubject } from 'rxjs';
import { ParamMap, convertToParamMap, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Hospital Module : BirthRegistrationComponent', () => {

	let component: BirthRegistrationComponent;
	let fixture: ComponentFixture<BirthRegistrationComponent>;
	let activeRoute: MockActivatedRoute;

	beforeEach(()=> {
		activeRoute = new MockActivatedRoute();		
	})

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				NgSelectModule,
				ReactiveFormsModule,
				RouterTestingModule,
				HttpClientTestingModule,
				AmazingTimePickerModule,
				BrowserAnimationsModule,
				ToastrModule.forRoot(),
				TranslateModule],
			declarations: [BirthRegistrationComponent,
				HosActionBarComponent,
				HosFileUploadComponent,
				AddressComponent,
				ControlMessagesComponent,
				HosTitleBarComponent,
				GujInputSourceDirective,
				GujInputTargetDirective,
				ValidationFieldsDirective],
			providers: [
				{ provide: ActivatedRoute, useValue: activeRoute },
				HosFormActionsService,
				AmazingTimePickerService,
				CommonService,
				ToastrService,
				HttpService,
				FormsActionsService,
				SessionStorageService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BirthRegistrationComponent);
		component = fixture.componentInstance;
		activeRoute.testParams = convertToParamMap({ id: 10, apiCode: 'HEL-BRC' });
		fixture.detectChanges();
	});

	afterEach(() => {
		activeRoute.testParams = convertToParamMap({ id: null, apiCode: null});
	})

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

/**
 * 
 * Mocking Activated Route with MockActivatedRoute Class do we can get route params.
 */

export class MockActivatedRoute {
	private paramsSubject = new BehaviorSubject(this.testParams);
	private _testParams: {};
	paramMap = this.paramsSubject.asObservable();
	get testParams() {

		return this._testParams;
	}

	set testParams(newParams: any) {
		this._testParams = newParams;
		this.paramsSubject.next(newParams);
	}
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

/**
 * Required Component, Services and Modules.
 */
import { DeathRegistrationComponent } from './death-registration.component';
import { TranslateModule } from '../../../shared/modules/translate/translate.module';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HosTitleBarComponent } from '../../../shared/components/hos-title-bar/hos-title-bar.component';
import { ControlMessagesComponent } from '../../../shared/components/control-messages/control-messages.component';
import { ValidationFieldsDirective } from '../../../shared/directives/validation-fields.directive';
import { GujInputSourceDirective } from '../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../shared/directives/guj-input-target.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { HosActionBarComponent } from '../../../shared/components/hos-action-bar/hos-action-bar.component';
import { AddressComponent } from '../../../shared/components/address/address.component';
import { BasicDetailsComponent } from '../../../shared/components/basic-details/basic-details.component';
import { HosFileUploadComponent } from '../../../shared/components/hos-file-upload/hos-file-upload.component';
import { CommonService } from '../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { HttpService } from '../../../shared/services/http.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

/**
 * Test Suite For Health Module : Death Certificate Component.
 */
describe('Hospital Module : DeathRegistrationComponent', () => {
	let component: DeathRegistrationComponent;
	let fixture: ComponentFixture<DeathRegistrationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule, 
				MaterialModule,
				NgSelectModule,
				ReactiveFormsModule,
				RouterTestingModule,
				HttpClientTestingModule,
				ToastrModule.forRoot(), 
				BrowserAnimationsModule],
			declarations: [DeathRegistrationComponent, 
				HosTitleBarComponent,
				ControlMessagesComponent,
				ValidationFieldsDirective,
				GujInputSourceDirective,
				GujInputTargetDirective,
				HosActionBarComponent,
				AddressComponent,
				HosFileUploadComponent,
				BasicDetailsComponent
			],
			providers: [CommonService,
				HttpService,
				ToastrService,
				FormsActionsService,
				HosFormActionsService,
				SessionStorageService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeathRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

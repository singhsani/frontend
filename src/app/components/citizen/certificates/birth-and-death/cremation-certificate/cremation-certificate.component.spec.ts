import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";


import { CremationCertificateComponent } from './cremation-certificate.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { BasicDetailsComponent } from '../../../../../shared/components/basic-details/basic-details.component';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonService } from '../../../../../shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Component : CremationCertificateComponent', () => {
	let component: CremationCertificateComponent;
	let fixture: ComponentFixture<CremationCertificateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				BrowserAnimationsModule,
				TranslateModule,
				NgSelectModule,
				ReactiveFormsModule,
				RouterTestingModule,
				HttpClientTestingModule,
				ToastrModule.forRoot()
			],
			declarations: [CremationCertificateComponent,
				BasicDetailsComponent,
				AddressComponent,
				ValidationFieldsDirective,
				GujInputSourceDirective,
				GujInputTargetDirective,
				TitleBarComponent,
				ActionBarComponent,
				FileUploadComponent,
				ControlMessagesComponent],
			providers: [FormsActionsService,
				CommonService,
				ToastrService,
				SessionStorageService,
				HttpService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CremationCertificateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDeathRecordComponent } from './no-death-record.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { RecordSearchComponent } from '../record-search/record-search.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { BasicDetailsComponent } from '../../../../../shared/components/basic-details/basic-details.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { CommonService } from '../../../../../shared/services/common.service';

describe('Component : NoDeathRecordComponent', () => {
	let component: NoDeathRecordComponent;
	let fixture: ComponentFixture<NoDeathRecordComponent>;

	const createComponent = () => {
		fixture = TestBed.createComponent(NoDeathRecordComponent);
		component = fixture.componentInstance;
		//fixture.detectChanges();
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				TranslateModule,
				NgSelectModule,
				HttpClientTestingModule,
				RouterTestingModule,
				ToastrModule.forRoot(),
				ReactiveFormsModule],
			declarations: [NoDeathRecordComponent,
				TitleBarComponent,
				ControlMessagesComponent,
				FileUploadComponent,
				ActionBarComponent,
				AddressComponent,
				GujInputSourceDirective,
				GujInputTargetDirective,
				ValidationFieldsDirective,
				RecordSearchComponent,
				BasicDetailsComponent],
			providers: [
				Location,
				{ provide: LocationStrategy, useClass: HashLocationStrategy },
				SessionStorageService,
				HttpService,
				FormsActionsService,
				CommonService,
				ToastrService
			]
		}).compileComponents().then(() => {
			createComponent();
		});
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterTankerAppComponent } from './water-tanker-app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { BasicDetailsComponent } from '../../../../shared/components/basic-details/basic-details.component';
import { ActionBarComponent } from '../../../../shared/components/action-bar/action-bar.component';
import { TranslateModule } from '../../../../shared/modules/translate/translate.module';
import { ValidationFieldsDirective } from '../../../../shared/directives/validation-fields.directive';
import { ControlMessagesComponent } from '../../../../shared/components/control-messages/control-messages.component';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from '../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonService } from '../../../../shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleBarComponent } from '../../../../shared/components/title-bar/title-bar.component';

import { GujInputSourceDirective } from '../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../shared/directives/guj-input-target.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddressComponent } from '../../../../shared/components/address/address.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

 describe('Fire Facilities : WaterTankerAppComponent', () => {
	let component: WaterTankerAppComponent;
	let fixture: ComponentFixture<WaterTankerAppComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule,
				BrowserAnimationsModule,
				RouterTestingModule,
				ToastrModule.forRoot(),
				HttpClientTestingModule,
				TranslateModule,
				MaterialModule,
				NgSelectModule,
				ActivatedRoute],
			declarations: [WaterTankerAppComponent,
				TitleBarComponent,
				ActionBarComponent,
				AddressComponent,
				FileUploadComponent,
				ControlMessagesComponent,
				ValidationFieldsDirective,
				GujInputSourceDirective,
				GujInputTargetDirective,
				BasicDetailsComponent],
			providers: [FormsActionsService,
				ToastrService,
				CommonService,
				SessionStorageService,
				ValidationService,
				HttpService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WaterTankerAppComponent);
		component = fixture.componentInstance;
		//fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

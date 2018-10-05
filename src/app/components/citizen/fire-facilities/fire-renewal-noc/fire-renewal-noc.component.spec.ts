import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireRenewalNocComponent } from './fire-renewal-noc.component';
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

 describe('Fire Facilities : FireRenewalNocComponent', () => {
	let component: FireRenewalNocComponent;
	let fixture: ComponentFixture<FireRenewalNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule,
				BrowserAnimationsModule,
				RouterTestingModule,
				ToastrModule.forRoot(),
				HttpClientTestingModule,
				TranslateModule,
				MaterialModule],
			declarations: [FireRenewalNocComponent,
				TitleBarComponent,
				ActionBarComponent,
				ControlMessagesComponent,
				ValidationFieldsDirective,
				BasicDetailsComponent],
			providers: [FormsActionsService,
				ToastrService,
				CommonService,
				SessionStorageService,
				HttpService]
		}).compileComponents();
	}));
	beforeEach(() => {
		fixture = TestBed.createComponent(FireRenewalNocComponent);
		component = fixture.componentInstance;
		//fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

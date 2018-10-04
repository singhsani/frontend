import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { DeathCorrectionComponent } from './death-correction.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { CommonService } from '../../../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('Component : DeathCorrectionComponent', () => {
	let component: DeathCorrectionComponent;
	let fixture: ComponentFixture<DeathCorrectionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule,
				MaterialModule,
				ReactiveFormsModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
				RouterTestingModule,
				NgSelectModule],
			declarations: [DeathCorrectionComponent,
				TitleBarComponent,
				ValidationFieldsDirective,
				GujInputSourceDirective,
				GujInputTargetDirective,
				ControlMessagesComponent,
				ActionBarComponent,
				FileUploadComponent],
			providers: [CommonService,
				SessionStorageService,
				FormsActionsService,
				HttpService,
				Location,
				{ provide: LocationStrategy, useClass: HashLocationStrategy },
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeathCorrectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

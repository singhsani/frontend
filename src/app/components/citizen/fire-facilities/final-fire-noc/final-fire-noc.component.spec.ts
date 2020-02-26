import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalFireNocComponent } from './final-fire-noc.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
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
import { NgSelectModule } from '@ng-select/ng-select';

 describe('Fire Facilities : FinalFireNocComponent', () => {
	let component: FinalFireNocComponent;
	let fixture: ComponentFixture<FinalFireNocComponent>;
	let service: FormsActionsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule,
				FormsModule,
				BrowserAnimationsModule,
				RouterTestingModule,
				ToastrModule.forRoot(),
				HttpClientTestingModule,
				NgSelectModule,
				TranslateModule,
				MaterialModule],
			declarations: [FinalFireNocComponent,
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
		fixture = TestBed.createComponent(FinalFireNocComponent);
		component = fixture.componentInstance;
		//fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

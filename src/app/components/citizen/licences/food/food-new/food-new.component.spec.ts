import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodNewComponent } from './food-new.component';

import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { BehaviorSubject } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { BasicDetailsComponent } from '../../../../../shared/components/basic-details/basic-details.component';

describe('FoodNewComponent', () => {
  let component: FoodNewComponent;
  let fixture: ComponentFixture<FoodNewComponent>;
  let activatedRoute: MockActivatedRoute;

	beforeEach(() => {
		activatedRoute = new MockActivatedRoute();
	})
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
				FoodNewComponent,
        TitleBarComponent,
        BasicDetailsComponent,
				ControlMessagesComponent,
				AddressComponent,
				ValidationFieldsDirective,
				GujInputSourceDirective,
				GujInputTargetDirective,
				ActionBarComponent,
				FileUploadComponent
			],
			imports: [
				HttpClientTestingModule,
				BrowserAnimationsModule,
				ReactiveFormsModule,
				TranslateModule,
				NgSelectModule,
				MaterialModule,
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
				ValidationService,
				CommonService,
				HttpService,
				FormsActionsService,
				SessionStorageService,
				ToastrService,
				{ provide: ActivatedRoute, useValue: activatedRoute }
			]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodNewComponent);
    component = fixture.componentInstance;
    activatedRoute.testParams = convertToParamMap({ id: 10, apiCode: "HEL-MR" })
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
export class MockActivatedRoute {
	private paramsSubject = new BehaviorSubject(this.testParams);
	private _testParams: {};

	paramMap = this.paramsSubject.asObservable();

	get testParams() {
		return this._testParams;
	}

	set testParams(newParams) {
		this._testParams = newParams;
		this.paramsSubject.next(newParams);
	}
}
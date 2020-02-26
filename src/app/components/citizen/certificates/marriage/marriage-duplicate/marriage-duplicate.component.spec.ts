import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageDuplicateComponent } from './marriage-duplicate.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { BasicDetailsComponent } from '../../../../../shared/components/basic-details/basic-details.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from '../../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../shared/services/common.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MarriageDuplicateComponent', () => {
	let component: MarriageDuplicateComponent;
	let fixture: ComponentFixture<MarriageDuplicateComponent>;
	let activatedRoute: MockActivatedRoute;

	beforeEach(() => {
		activatedRoute = new MockActivatedRoute();
	})

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MarriageDuplicateComponent,
				ControlMessagesComponent,
				BasicDetailsComponent,
				ActionBarComponent,
				ValidationFieldsDirective,
				GujInputSourceDirective,
				GujInputTargetDirective,
			],
			imports: [
				BrowserAnimationsModule,
				TranslateModule,
				ReactiveFormsModule,
				MaterialModule,
				RouterTestingModule,
				HttpClientTestingModule,
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
				FormsActionsService,
				SessionStorageService,
				HttpService,
				ToastrService,
				CommonService,
				{ provide: ActivatedRoute, useValue: activatedRoute }
			]

		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MarriageDuplicateComponent);
		component = fixture.componentInstance;
		activatedRoute.testParams = convertToParamMap({ id: 10, apiCode: "SHOP-LIC" })
		fixture.detectChanges();
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
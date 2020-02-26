import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResourceComponent } from './my-resource.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '../../../shared/modules/translate/translate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { HttpService } from '../../../shared/services/http.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('MyResourceComponent', () => {
	let component: MyResourceComponent;
	let fixture: ComponentFixture<MyResourceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MyResourceComponent
			],
			imports: [
				MaterialModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
				TranslateModule,
				ReactiveFormsModule,
				ToastrModule.forRoot({
					timeOut: 5000,
					positionClass: 'toast-top-right',
					preventDuplicates: true,
					progressBar: true,
					closeButton: true
				})
			],
			providers: [
				FormsActionsService,
				CommonService,
				HttpService,
				SessionStorageService,
				PaginationService,
				ToastrService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MyResourceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { MaterialModule } from '../../../shared/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '../../../shared/modules/translate/translate.module';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { HttpService } from '../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { LoiPaymentComponent } from './loi-payment.component';

describe('MyApplicationsComponent', () => {
	let component: LoiPaymentComponent;
	let fixture: ComponentFixture<LoiPaymentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				LoiPaymentComponent
			],
			imports: [
				MaterialModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
				TranslateModule,
				RouterTestingModule
			],
			providers: [
				FormsActionsService,
				CommonService,
				HttpService,
				SessionStorageService,
				PaginationService,
				BsModalService,
				ComponentLoaderFactory,
				PositioningService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoiPaymentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});




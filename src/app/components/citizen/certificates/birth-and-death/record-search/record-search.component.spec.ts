import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSearchComponent } from './record-search.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionStorageService } from 'angular-web-storage';
import { PaginationService } from '../../../../../core/services/citizen/data-services/pagination.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Component : RecordSearchComponent', () => {
	let component: RecordSearchComponent;
	let fixture: ComponentFixture<RecordSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				TranslateModule,
				NgSelectModule,
				BrowserAnimationsModule,
				RouterTestingModule,
				HttpClientTestingModule,
				ReactiveFormsModule],
			declarations: [RecordSearchComponent,
				TitleBarComponent],
			providers: [FormsActionsService,
				HttpService,
				SessionStorageService,
				PaginationService,
				CommonService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

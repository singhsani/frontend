import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				BrowserAnimationsModule,
				HttpClientTestingModule,
				ToastrModule.forRoot(),
				RouterTestingModule],
			declarations: [DashboardComponent],
			providers: [FormsActionsService,
				SessionStorageService,
				ToastrService,
				PaginationService,
				HttpService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

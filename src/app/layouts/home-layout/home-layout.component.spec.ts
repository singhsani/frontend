import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HomeLayoutComponent } from './home-layout.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { AppService } from '../../core/services/citizen/app-services/app.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../shared/services/http.service';
import { FormsActionsService } from '../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Layouts : HomeLayoutComponent', () => {
	let component: HomeLayoutComponent;
	let fixture: ComponentFixture<HomeLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
				RouterTestingModule],
			declarations: [HomeLayoutComponent],
			providers: [AppService,
				CommonService,
				FormsActionsService,
				SessionStorageService,
				HttpService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

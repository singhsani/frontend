import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { AngularWebStorageModule } from 'angular-web-storage';
import { BirthCorrectionComponent } from './birth-correction.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CoreModule } from '../../../../../core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';


import { DebugElement } from "@angular/core";
import { By } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { error } from '@angular/compiler/src/util';


fdescribe('Component: BirthCorrectionComponent', () => {
	let component: BirthCorrectionComponent;
	let fixture: ComponentFixture<BirthCorrectionComponent>;
	let service : FormsActionsService

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, BrowserModule,
				BrowserAnimationsModule,
				ReactiveFormsModule, CoreModule, SharedModule, RouterTestingModule, AngularWebStorageModule, ToastrModule.forRoot({
					timeOut: 5000,
					positionClass: 'toast-top-right',
					preventDuplicates: true,
					progressBar: true,
					closeButton: true
				})],
			declarations: [BirthCorrectionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BirthCorrectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		component = null;
	})

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Should create birth correcion search form if user dont created earlier', () => {
		expect(component.showApplicationSearch).toBeTruthy();
	})

	it('Should birth correcion form if user searched data successfully', (err) => {
		component.appId = 23;
		component.apiCode = 'HEL-BCR';
		component.ngOnInit();
		
		fixture.detectChanges();
		expect(component.showcorrectionForm).toBeTruthy();
		fixture.detectChanges();
	});
});

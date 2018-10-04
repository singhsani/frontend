import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { AddressComponent } from './address.component';
import { GujInputTargetDirective } from '../../directives/guj-input-target.directive';
import { GujInputSourceDirective } from '../../directives/guj-input-source.directive';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';
import { TranslateModule } from '../../modules/translate/translate.module';
import { ControlMessagesComponent } from '../control-messages/control-messages.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpService } from '../../services/http.service';
import { SessionStorageService } from 'angular-web-storage';

describe('Shared : AddressComponent', () => {
	let component: AddressComponent;
	let fixture: ComponentFixture<AddressComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule,
				HttpClientTestingModule,
				TranslateModule,
				NgSelectModule,
				MaterialModule],
			declarations: [
				AddressComponent,
				ControlMessagesComponent,
				GujInputTargetDirective,
				GujInputSourceDirective],
			providers: [FormsActionsService,
				SessionStorageService,
				HttpService]
		}).compileComponents().then(() => {
				fixture = TestBed.createComponent(AddressComponent);
				component = fixture.componentInstance;
			});
	}));

	beforeEach(() => {
		//fixture.detectChanges();
	});

	it('should create', () => {
		const form = new FormGroup({
		})

		component.addressFormGroup = form;

		expect(component).toBeTruthy();
	});
});

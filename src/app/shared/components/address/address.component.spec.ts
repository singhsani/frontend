import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressComponent } from './address.component';
import { GujInputTargetDirective } from '../../directives/guj-input-target.directive';
import { GujInputSourceDirective } from '../../directives/guj-input-source.directive';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

describe('AddressComponent', () => {
	let component: AddressComponent;
	let fixture: ComponentFixture<AddressComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AddressComponent, 
				GujInputTargetDirective, 
				GujInputSourceDirective],
				providers:[FormsActionsService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddressComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

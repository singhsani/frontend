import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthRegistrationComponent } from './birth-registration.component';

describe('BirthRegistrationComponent', () => {
	let component: BirthRegistrationComponent;
	let fixture: ComponentFixture<BirthRegistrationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BirthRegistrationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BirthRegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

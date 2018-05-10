import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireRenewalNocComponent } from './fire-renewal-noc.component';

describe('FireRenewalNocComponent', () => {
	let component: FireRenewalNocComponent;
	let fixture: ComponentFixture<FireRenewalNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FireRenewalNocComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FireRenewalNocComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

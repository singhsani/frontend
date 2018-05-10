import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDuplicateBillComponent } from './property-duplicate-bill.component';

describe('PropertyDuplicateBillComponent', () => {
	let component: PropertyDuplicateBillComponent;
	let fixture: ComponentFixture<PropertyDuplicateBillComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PropertyDuplicateBillComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PropertyDuplicateBillComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

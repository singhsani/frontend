import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicCancellationComponent } from './shop-lic-cancellation.component';

describe('ShopLicCancellationComponent', () => {
	let component: ShopLicCancellationComponent;
	let fixture: ComponentFixture<ShopLicCancellationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ShopLicCancellationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ShopLicCancellationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

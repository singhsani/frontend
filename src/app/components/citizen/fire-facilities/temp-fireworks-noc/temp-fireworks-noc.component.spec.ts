import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempFireworksNocComponent } from './temp-fireworks-noc.component';

describe('TempFireworksNocComponent', () => {
	let component: TempFireworksNocComponent;
	let fixture: ComponentFixture<TempFireworksNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TempFireworksNocComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TempFireworksNocComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

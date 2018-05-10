import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathCorrectionComponent } from './death-correction.component';

describe('DeathCorrectionComponent', () => {
	let component: DeathCorrectionComponent;
	let fixture: ComponentFixture<DeathCorrectionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeathCorrectionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeathCorrectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

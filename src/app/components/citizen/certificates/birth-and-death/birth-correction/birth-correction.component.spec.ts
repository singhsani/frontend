import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthCorrectionComponent } from './birth-correction.component';

describe('BirthCorrectionComponent', () => {
	let component: BirthCorrectionComponent;
	let fixture: ComponentFixture<BirthCorrectionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BirthCorrectionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BirthCorrectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuttonFishRenewalComponent } from './mutton-fish-renewal.component';

describe('MuttonFishRenewalComponent', () => {
	let component: MuttonFishRenewalComponent;
	let fixture: ComponentFixture<MuttonFishRenewalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MuttonFishRenewalComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MuttonFishRenewalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

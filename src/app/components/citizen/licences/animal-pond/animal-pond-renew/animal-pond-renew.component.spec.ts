import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPondRenewComponent } from './animal-pond-renew.component';

describe('AnimalPondRenewComponent', () => {
	let component: AnimalPondRenewComponent;
	let fixture: ComponentFixture<AnimalPondRenewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AnimalPondRenewComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AnimalPondRenewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

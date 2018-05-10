import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPondNewComponent } from './animal-pond-new.component';

describe('AnimalPondNewComponent', () => {
	let component: AnimalPondNewComponent;
	let fixture: ComponentFixture<AnimalPondNewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AnimalPondNewComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AnimalPondNewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

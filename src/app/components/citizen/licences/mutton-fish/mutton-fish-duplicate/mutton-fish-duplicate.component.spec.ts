import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuttonFishDuplicateComponent } from './mutton-fish-duplicate.component';

describe('MuttonFishDuplicateComponent', () => {
	let component: MuttonFishDuplicateComponent;
	let fixture: ComponentFixture<MuttonFishDuplicateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MuttonFishDuplicateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MuttonFishDuplicateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

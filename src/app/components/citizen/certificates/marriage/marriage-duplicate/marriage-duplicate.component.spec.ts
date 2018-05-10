import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageDuplicateComponent } from './marriage-duplicate.component';

describe('MarriageDuplicateComponent', () => {
	let component: MarriageDuplicateComponent;
	let fixture: ComponentFixture<MarriageDuplicateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MarriageDuplicateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MarriageDuplicateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

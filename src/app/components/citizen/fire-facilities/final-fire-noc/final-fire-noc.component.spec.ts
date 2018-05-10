import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalFireNocComponent } from './final-fire-noc.component';

describe('FinalFireNocComponent', () => {
	let component: FinalFireNocComponent;
	let fixture: ComponentFixture<FinalFireNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FinalFireNocComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinalFireNocComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

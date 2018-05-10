import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempStructureNocComponent } from './temp-structure-noc.component';

describe('TempStructureNocComponent', () => {
	let component: TempStructureNocComponent;
	let fixture: ComponentFixture<TempStructureNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TempStructureNocComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TempStructureNocComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

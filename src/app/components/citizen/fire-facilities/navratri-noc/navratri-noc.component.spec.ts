import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavratriNocComponent } from './navratri-noc.component';

describe('NavratriNocComponent', () => {
	let component: NavratriNocComponent;
	let fixture: ComponentFixture<NavratriNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NavratriNocComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavratriNocComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

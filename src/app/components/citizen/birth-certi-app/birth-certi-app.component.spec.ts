import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthCertiAppComponent } from './birth-certi-app.component';

describe('BirthCertiAppComponent', () => {
	let component: BirthCertiAppComponent;
	let fixture: ComponentFixture<BirthCertiAppComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BirthCertiAppComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BirthCertiAppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleConnectionNocComponent } from './ele-connection-noc.component';

describe('EleConnectionNocComponent', () => {
	let component: EleConnectionNocComponent;
	let fixture: ComponentFixture<EleConnectionNocComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EleConnectionNocComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EleConnectionNocComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

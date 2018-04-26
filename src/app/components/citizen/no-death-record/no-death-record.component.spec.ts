import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDeathRecordComponent } from './no-death-record.component';

describe('NoDeathRecordComponent', () => {
	let component: NoDeathRecordComponent;
	let fixture: ComponentFixture<NoDeathRecordComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NoDeathRecordComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NoDeathRecordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

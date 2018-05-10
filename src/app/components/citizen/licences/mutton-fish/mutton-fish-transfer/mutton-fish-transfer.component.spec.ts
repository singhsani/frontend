import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuttonFishTransferComponent } from './mutton-fish-transfer.component';

describe('MuttonFishTransferComponent', () => {
	let component: MuttonFishTransferComponent;
	let fixture: ComponentFixture<MuttonFishTransferComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MuttonFishTransferComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MuttonFishTransferComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
